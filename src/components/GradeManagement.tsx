import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react';
import { Grade, Student, Subject, Class } from '../types';
import { LocalStorage, Generators } from '../utils/storage';
import { SchoolSettingsService } from '../utils/schoolSettings';
import { jsPDF } from 'jspdf';
import { BulletinGenerator } from './BulletinGenerator';

export const GradeManagement: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const [formData, setFormData] = useState<Partial<Grade>>({
    eleveId: '',
    matiereId: '',
    classeId: '',
    typeEvaluation: 'devoir',
    note: 0,
    noteMax: 20,
    trimestre: 1,
    anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    date: new Date()
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedGrades = LocalStorage.get<Grade[]>('grades') || [];
    const storedStudents = LocalStorage.get<Student[]>('students') || [];
    const storedSubjects = LocalStorage.get<Subject[]>('subjects') || [];
    const storedClasses = LocalStorage.get<Class[]>('classes') || [];
    
    setGrades(storedGrades);
    setStudents(storedStudents);
    setSubjects(storedSubjects);
    setClasses(storedClasses);
  };

  const saveGrade = () => {
    if (!formData.eleveId || !formData.matiereId || !formData.classeId || formData.note === undefined) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.note! > formData.noteMax!) {
      alert('La note ne peut pas être supérieure à la note maximale');
      return;
    }

    const gradeData: Grade = {
      id: editingGrade?.id || Generators.generateId(),
      ...formData as Grade
    };

    let updatedGrades;
    if (editingGrade) {
      updatedGrades = grades.map(g => g.id === editingGrade.id ? gradeData : g);
    } else {
      updatedGrades = [...grades, gradeData];
    }

    setGrades(updatedGrades);
    LocalStorage.set('grades', updatedGrades);
    resetForm();
  };

  const deleteGrade = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      const updatedGrades = grades.filter(g => g.id !== id);
      setGrades(updatedGrades);
      LocalStorage.set('grades', updatedGrades);
    }
  };

  const resetForm = () => {
    setFormData({
      eleveId: '',
      matiereId: '',
      classeId: selectedClass,
      typeEvaluation: 'devoir',
      note: 0,
      noteMax: 20,
      trimestre: selectedTrimester,
      anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      date: new Date()
    });
    setEditingGrade(null);
    setShowForm(false);
  };

  const editGrade = (grade: Grade) => {
    setFormData(grade);
    setEditingGrade(grade);
    setShowForm(true);
  };

  const filteredGrades = grades.filter(grade => {
    const matchesClass = selectedClass === '' || grade.classeId === selectedClass;
    const matchesSubject = selectedSubject === '' || grade.matiereId === selectedSubject;
    const matchesTrimester = grade.trimestre === selectedTrimester;
    return matchesClass && matchesSubject && matchesTrimester;
  });

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Non trouvé';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.nom : 'Non trouvé';
  };

  const getClassName = (classId: string) => {
    const classe = classes.find(c => c.id === classId);
    return classe ? classe.nom : 'Non trouvé';
  };

  const calculateAverage = (studentId: string, subjectId: string, trimester: number) => {
    const studentGrades = grades.filter(g => 
      g.eleveId === studentId && 
      g.matiereId === subjectId && 
      g.trimestre === trimester
    );
    
    if (studentGrades.length === 0) return null;
    
    const total = studentGrades.reduce((sum, grade) => sum + (grade.note / grade.noteMax) * 20, 0);
    return (total / studentGrades.length).toFixed(2);
  };

  const generateBulletin = () => {
    if (!selectedClass) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    const classe = classes.find(c => c.id === selectedClass);
    if (!classe) {
      alert('Classe non trouvée');
      return;
    }

    const classStudents = students.filter(s => s.classeId === selectedClass);
    const classSubjects = subjects.filter(s => {
      return s.niveaux.includes(classe.niveau);
    });

    if (classStudents.length === 0) {
      alert('Aucun élève dans cette classe');
      return;
    }

    // Déterminer le type de bulletin selon le niveau
    const isSecondaire = classe.niveauType === 'SECONDAIRE';

    if (isSecondaire) {
      // Utiliser le générateur de bulletin secondaire
      const allGrades = grades;

      classStudents.forEach((student) => {
        const doc = BulletinGenerator.generateSecondaireBulletin(
          student,
          classe,
          classSubjects,
          grades,
          selectedTrimester,
          classStudents,
          allGrades
        );

        doc.save(`Bulletin_${classe.nom}_T${selectedTrimester}_${student.nom}.pdf`);
      });

      alert('Bulletins secondaire générés avec succès !');
    } else if (classe.niveauType === 'PRIMAIRE') {
      // Utiliser le générateur de bulletin primaire
      const allGrades = grades;

      classStudents.forEach((student) => {
        const doc = BulletinGenerator.generatePrimaireBulletin(
          student,
          classe,
          classSubjects,
          grades,
          selectedTrimester,
          classStudents,
          allGrades
        );

        doc.save(`Bulletin_${classe.nom}_T${selectedTrimester}_${student.nom}.pdf`);
      });

      alert('Bulletins primaire générés avec succès !');
    } else {
      // Format par défaut (Maternelle ou autre)
      const schoolSettings = SchoolSettingsService.getSettings();
      const doc = new jsPDF();

      classStudents.forEach((student, studentIndex) => {
        if (studentIndex > 0) {
          doc.addPage();
        }

        let yPosition = 20;

        if (schoolSettings.logo) {
          try {
            doc.addImage(schoolSettings.logo, 'PNG', 15, yPosition, 30, 30);
          } catch (e) {
            console.log('Logo non chargé');
          }
        }

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(schoolSettings.nomEtablissement, 105, yPosition + 10, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (schoolSettings.adresse) {
          doc.text(`${schoolSettings.adresse}, ${schoolSettings.ville}`, 105, yPosition + 17, { align: 'center' });
        }
        if (schoolSettings.telephone) {
          doc.text(`Tél: ${schoolSettings.telephone}`, 105, yPosition + 22, { align: 'center' });
        }

        yPosition += 35;
        doc.setLineWidth(0.5);
        doc.line(15, yPosition, 195, yPosition);

        yPosition += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('BULLETIN DE NOTES', 105, yPosition, { align: 'center' });

        yPosition += 7;
        doc.setFontSize(12);
        doc.text(`${getClassName(selectedClass)} - Trimestre ${selectedTrimester}`, 105, yPosition, { align: 'center' });
        doc.text(`Année scolaire: ${schoolSettings.anneeScolaireActuelle}`, 105, yPosition + 6, { align: 'center' });

        yPosition += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Informations de l\'élève:', 15, yPosition);

        yPosition += 6;
        doc.setFont('helvetica', 'normal');
        doc.text(`Nom: ${student.nom}`, 15, yPosition);
        doc.text(`Prénom: ${student.prenom}`, 105, yPosition);

        yPosition += 6;
        doc.text(`Matricule: ${student.matricule}`, 15, yPosition);
        doc.text(`Date de naissance: ${new Date(student.dateNaissance).toLocaleDateString('fr-FR')}`, 105, yPosition);

        yPosition += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Résultats scolaires:', 15, yPosition);

        yPosition += 8;
        doc.setFillColor(schoolSettings.couleurPrimaire || '#059669');
        doc.rect(15, yPosition - 5, 180, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.text('Matière', 20, yPosition);
        doc.text('Coef', 120, yPosition);
        doc.text('Moyenne', 160, yPosition);

        yPosition += 5;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        let totalPoints = 0;
        let totalCoefficients = 0;

        classSubjects.forEach(subject => {
          const average = calculateAverage(student.id, subject.id, selectedTrimester);
          const displayAverage = average || 'N/A';

          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }

          doc.text(subject.nom.substring(0, 40), 20, yPosition);
          doc.text(subject.coefficient.toString(), 125, yPosition);
          doc.text(displayAverage.toString(), 165, yPosition);

          if (average) {
            totalPoints += parseFloat(average) * subject.coefficient;
            totalCoefficients += subject.coefficient;
          }

          yPosition += 6;
        });

        const generalAverage = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 'N/A';

        yPosition += 5;
        doc.setLineWidth(0.5);
        doc.line(15, yPosition, 195, yPosition);

        yPosition += 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('MOYENNE GÉNÉRALE:', 20, yPosition);
        doc.text(`${generalAverage}/20`, 165, yPosition);

        yPosition += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        let appreciation = '';
        const avg = parseFloat(generalAverage);
        if (avg >= 16) appreciation = 'Excellent travail';
        else if (avg >= 14) appreciation = 'Très bien';
        else if (avg >= 12) appreciation = 'Bien';
        else if (avg >= 10) appreciation = 'Assez bien';
        else if (avg >= 8) appreciation = 'Passable';
        else appreciation = 'Insuffisant';

        doc.text(`Appréciation: ${appreciation}`, 20, yPosition);

        yPosition += 15;
        doc.text(`Le Directeur`, 140, yPosition);
        if (schoolSettings.directeur) {
          doc.text(schoolSettings.directeur, 140, yPosition + 15);
        }

        doc.setFontSize(8);
        doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: 'center' });
      });

      doc.save(`bulletin_${getClassName(selectedClass)}_T${selectedTrimester}.pdf`);
      alert('Bulletins primaire générés avec succès !');
    }
  };

  const classStudents = students.filter(s => selectedClass === '' || s.classeId === selectedClass);
  const availableSubjects = subjects.filter(s => {
    if (selectedClass === '') return true;
    const classe = classes.find(c => c.id === selectedClass);
    return classe && s.niveaux.includes(classe.niveau);
  });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingGrade ? 'Modifier la Note' : 'Nouvelle Note'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveGrade(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classeId}
                  onChange={(e) => setFormData({...formData, classeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(classe => (
                    <option key={classe.id} value={classe.id}>{classe.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.eleveId}
                  onChange={(e) => setFormData({...formData, eleveId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={!formData.classeId}
                >
                  <option value="">Sélectionner un élève</option>
                  {students
                    .filter(s => s.classeId === formData.classeId)
                    .map(student => (
                      <option key={student.id} value={student.id}>
                        {student.prenom} {student.nom}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.matiereId}
                  onChange={(e) => setFormData({...formData, matiereId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {availableSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation</label>
                <select
                  value={formData.typeEvaluation}
                  onChange={(e) => setFormData({...formData, typeEvaluation: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="devoir">Devoir</option>
                  <option value="composition">Composition</option>
                  <option value="oral">Oral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  max={formData.noteMax}
                  step="0.25"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note Maximale</label>
                <input
                  type="number"
                  value={formData.noteMax}
                  onChange={(e) => setFormData({...formData, noteMax: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
                <select
                  value={formData.trimestre}
                  onChange={(e) => setFormData({...formData, trimestre: parseInt(e.target.value) as 1 | 2 | 3})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={1}>1er Trimestre</option>
                  <option value={2}>2ème Trimestre</option>
                  <option value={3}>3ème Trimestre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingGrade ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Notes</h1>
        <div className="flex space-x-2">
          <button
            onClick={generateBulletin}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={!selectedClass}
          >
            <Download className="h-4 w-4" />
            <span>Bulletin</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Note</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes les classes</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>{classe.nom}</option>
            ))}
          </select>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes les matières</option>
            {availableSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.nom}</option>
            ))}
          </select>

          <select
            value={selectedTrimester}
            onChange={(e) => setSelectedTrimester(parseInt(e.target.value) as 1 | 2 | 3)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={1}>1er Trimestre</option>
            <option value={2}>2ème Trimestre</option>
            <option value={3}>3ème Trimestre</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredGrades.length} note{filteredGrades.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des notes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getStudentName(grade.eleveId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getClassName(grade.classeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSubjectName(grade.matiereId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      grade.typeEvaluation === 'composition' ? 'bg-red-100 text-red-800' :
                      grade.typeEvaluation === 'devoir' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {grade.typeEvaluation}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {grade.note}/{grade.noteMax}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((grade.note / grade.noteMax) * 20).toFixed(2)}/20
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(grade.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editGrade(grade)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGrade(grade.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune note trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter des notes pour ce trimestre.
          </p>
        </div>
      )}
    </div>
  );
};