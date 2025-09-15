import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart3, PieChart, Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';
import { Student, Class, Grade, Payment, Subject } from '../types';
import { LocalStorage } from '../utils/storage';

export const ReportManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedReport, setSelectedReport] = useState('statistics');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStudents = LocalStorage.get<Student[]>('students') || [];
    const storedClasses = LocalStorage.get<Class[]>('classes') || [];
    const storedGrades = LocalStorage.get<Grade[]>('grades') || [];
    const storedPayments = LocalStorage.get<Payment[]>('payments') || [];
    const storedSubjects = LocalStorage.get<Subject[]>('subjects') || [];
    
    setStudents(storedStudents);
    setClasses(storedClasses);
    setGrades(storedGrades);
    setPayments(storedPayments);
    setSubjects(storedSubjects);
  };

  const generateStatisticsReport = () => {
    const currentYear = new Date().getFullYear();
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.statut === 'actif').length;
    const maleStudents = students.filter(s => s.sexe === 'M').length;
    const femaleStudents = students.filter(s => s.sexe === 'F').length;
    
    const yearlyPayments = payments.filter(p => 
      new Date(p.datePaiement).getFullYear() === currentYear
    );
    const totalRevenue = yearlyPayments.reduce((sum, p) => sum + p.montant, 0);

    let report = `RAPPORT STATISTIQUE - ANNÉE SCOLAIRE ${currentYear}-${currentYear + 1}\n`;
    report += `${'='.repeat(60)}\n\n`;
    
    report += `1. EFFECTIFS\n`;
    report += `${'-'.repeat(20)}\n`;
    report += `Total élèves inscrits: ${totalStudents}\n`;
    report += `Élèves actifs: ${activeStudents}\n`;
    report += `Élèves inactifs: ${totalStudents - activeStudents}\n`;
    report += `Garçons: ${maleStudents} (${((maleStudents / totalStudents) * 100).toFixed(1)}%)\n`;
    report += `Filles: ${femaleStudents} (${((femaleStudents / totalStudents) * 100).toFixed(1)}%)\n\n`;

    report += `2. RÉPARTITION PAR CLASSE\n`;
    report += `${'-'.repeat(30)}\n`;
    classes.forEach(classe => {
      const classStudents = students.filter(s => s.classeId === classe.id);
      const classMales = classStudents.filter(s => s.sexe === 'M').length;
      const classFemales = classStudents.filter(s => s.sexe === 'F').length;
      report += `${classe.nom}: ${classStudents.length} élèves (G: ${classMales}, F: ${classFemales})\n`;
    });

    report += `\n3. FINANCES\n`;
    report += `${'-'.repeat(15)}\n`;
    report += `Recettes totales ${currentYear}: ${totalRevenue.toLocaleString()} FCFA\n`;
    report += `Nombre de paiements: ${yearlyPayments.length}\n`;
    report += `Recette moyenne par paiement: ${yearlyPayments.length > 0 ? (totalRevenue / yearlyPayments.length).toLocaleString() : 0} FCFA\n\n`;

    report += `4. NOTES ET ÉVALUATIONS\n`;
    report += `${'-'.repeat(25)}\n`;
    const trimesterGrades = grades.filter(g => g.trimestre === selectedTrimester);
    report += `Notes saisies (Trimestre ${selectedTrimester}): ${trimesterGrades.length}\n`;
    
    const compositions = trimesterGrades.filter(g => g.typeEvaluation === 'composition').length;
    const devoirs = trimesterGrades.filter(g => g.typeEvaluation === 'devoir').length;
    const oraux = trimesterGrades.filter(g => g.typeEvaluation === 'oral').length;
    
    report += `Compositions: ${compositions}\n`;
    report += `Devoirs: ${devoirs}\n`;
    report += `Oraux: ${oraux}\n\n`;

    report += `Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`;

    return report;
  };

  const generateClassReport = () => {
    if (!selectedClass) {
      alert('Veuillez sélectionner une classe');
      return '';
    }

    const classe = classes.find(c => c.id === selectedClass);
    const classStudents = students.filter(s => s.classeId === selectedClass);
    const classGrades = grades.filter(g => g.classeId === selectedClass && g.trimestre === selectedTrimester);

    let report = `RAPPORT DE CLASSE - ${classe?.nom} - TRIMESTRE ${selectedTrimester}\n`;
    report += `${'='.repeat(60)}\n\n`;

    report += `1. INFORMATIONS GÉNÉRALES\n`;
    report += `${'-'.repeat(30)}\n`;
    report += `Classe: ${classe?.nom}\n`;
    report += `Niveau: ${classe?.niveau}\n`;
    report += `Effectif: ${classStudents.length} élèves\n`;
    report += `Garçons: ${classStudents.filter(s => s.sexe === 'M').length}\n`;
    report += `Filles: ${classStudents.filter(s => s.sexe === 'F').length}\n\n`;

    report += `2. LISTE DES ÉLÈVES\n`;
    report += `${'-'.repeat(25)}\n`;
    classStudents.forEach((student, index) => {
      report += `${index + 1}. ${student.prenom} ${student.nom} (${student.matricule}) - ${student.sexe === 'M' ? 'Garçon' : 'Fille'}\n`;
    });

    report += `\n3. RÉSULTATS SCOLAIRES (Trimestre ${selectedTrimester})\n`;
    report += `${'-'.repeat(45)}\n`;
    
    const classSubjects = subjects.filter(s => classe && s.niveaux.includes(classe.niveau));
    
    classStudents.forEach(student => {
      report += `\nÉlève: ${student.prenom} ${student.nom}\n`;
      report += `${'-'.repeat(30)}\n`;
      
      let totalPoints = 0;
      let totalCoefficients = 0;
      
      classSubjects.forEach(subject => {
        const studentSubjectGrades = classGrades.filter(g => 
          g.eleveId === student.id && g.matiereId === subject.id
        );
        
        if (studentSubjectGrades.length > 0) {
          const average = studentSubjectGrades.reduce((sum, grade) => 
            sum + (grade.note / grade.noteMax) * 20, 0
          ) / studentSubjectGrades.length;
          
          report += `${subject.nom}: ${average.toFixed(2)}/20 (Coef: ${subject.coefficient})\n`;
          totalPoints += average * subject.coefficient;
          totalCoefficients += subject.coefficient;
        } else {
          report += `${subject.nom}: Non noté (Coef: ${subject.coefficient})\n`;
        }
      });
      
      const generalAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
      report += `Moyenne générale: ${generalAverage.toFixed(2)}/20\n`;
    });

    report += `\nRapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`;

    return report;
  };

  const generateFinancialReport = () => {
    const currentYear = new Date().getFullYear();
    const yearlyPayments = payments.filter(p => 
      new Date(p.datePaiement).getFullYear() === currentYear
    );

    let report = `RAPPORT FINANCIER - ANNÉE ${currentYear}\n`;
    report += `${'='.repeat(40)}\n\n`;

    // Recettes par mois
    report += `1. RECETTES PAR MOIS\n`;
    report += `${'-'.repeat(25)}\n`;
    
    const monthlyRevenue: { [key: number]: number } = {};
    yearlyPayments.forEach(payment => {
      const month = new Date(payment.datePaiement).getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.montant;
    });

    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    Object.keys(monthlyRevenue).forEach(monthKey => {
      const month = parseInt(monthKey);
      report += `${monthNames[month]}: ${monthlyRevenue[month].toLocaleString()} FCFA\n`;
    });

    // Recettes par mode de paiement
    report += `\n2. RECETTES PAR MODE DE PAIEMENT\n`;
    report += `${'-'.repeat(35)}\n`;
    
    const paymentModes: { [key: string]: number } = {};
    yearlyPayments.forEach(payment => {
      paymentModes[payment.modePaiement] = (paymentModes[payment.modePaiement] || 0) + payment.montant;
    });

    Object.keys(paymentModes).forEach(mode => {
      report += `${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${paymentModes[mode].toLocaleString()} FCFA\n`;
    });

    // Recettes par classe
    report += `\n3. RECETTES PAR CLASSE\n`;
    report += `${'-'.repeat(25)}\n`;
    
    const classRevenue: { [key: string]: number } = {};
    yearlyPayments.forEach(payment => {
      const student = students.find(s => s.id === payment.eleveId);
      if (student) {
        const className = classes.find(c => c.id === student.classeId)?.nom || 'Non assignée';
        classRevenue[className] = (classRevenue[className] || 0) + payment.montant;
      }
    });

    Object.keys(classRevenue).forEach(className => {
      report += `${className}: ${classRevenue[className].toLocaleString()} FCFA\n`;
    });

    const totalRevenue = yearlyPayments.reduce((sum, p) => sum + p.montant, 0);
    report += `\nTOTAL GÉNÉRAL: ${totalRevenue.toLocaleString()} FCFA\n`;
    report += `Nombre total de paiements: ${yearlyPayments.length}\n`;

    report += `\nRapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`;

    return report;
  };

  const downloadReport = (reportType: string) => {
    let reportContent = '';
    let fileName = '';

    switch (reportType) {
      case 'statistics':
        reportContent = generateStatisticsReport();
        fileName = `rapport_statistiques_${new Date().getFullYear()}.txt`;
        break;
      case 'class':
        reportContent = generateClassReport();
        if (!reportContent) return;
        const className = classes.find(c => c.id === selectedClass)?.nom || 'classe';
        fileName = `rapport_${className}_T${selectedTrimester}.txt`;
        break;
      case 'financial':
        reportContent = generateFinancialReport();
        fileName = `rapport_financier_${new Date().getFullYear()}.txt`;
        break;
      default:
        return;
    }

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  }> = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  // Calculs pour les statistiques
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.statut === 'actif').length;
  const totalClasses = classes.length;
  const currentYear = new Date().getFullYear();
  const yearlyRevenue = payments
    .filter(p => new Date(p.datePaiement).getFullYear() === currentYear)
    .reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rapports et Statistiques</h1>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Élèves Actifs"
          value={activeStudents}
          icon={Users}
          color="#10B981"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Classes"
          value={totalClasses}
          icon={GraduationCap}
          color="#3B82F6"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Recettes Année"
          value={`${yearlyRevenue.toLocaleString()} FCFA`}
          icon={DollarSign}
          color="#F59E0B"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Taux de Réussite"
          value="85%"
          icon={TrendingUp}
          color="#8B5CF6"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Types de rapports */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Générer des Rapports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rapport Statistiques */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Rapport Statistique</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Statistiques générales de l'établissement : effectifs, répartition par genre et classe, finances.
            </p>
            <button
              onClick={() => downloadReport('statistics')}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </button>
          </div>

          {/* Rapport de Classe */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <PieChart className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Rapport de Classe</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rapport détaillé d'une classe : liste des élèves, notes et moyennes par trimestre.
            </p>
            
            <div className="space-y-3 mb-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>{classe.nom}</option>
                ))}
              </select>
              
              <select
                value={selectedTrimester}
                onChange={(e) => setSelectedTrimester(parseInt(e.target.value) as 1 | 2 | 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
            </div>
            
            <button
              onClick={() => downloadReport('class')}
              disabled={!selectedClass}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </button>
          </div>

          {/* Rapport Financier */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileText className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Rapport Financier</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Analyse financière : recettes par mois, mode de paiement et classe.
            </p>
            <button
              onClick={() => downloadReport('financial')}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Graphiques et visualisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par genre */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Genre</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Garçons</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${totalStudents > 0 ? (students.filter(s => s.sexe === 'M').length / totalStudents) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900">{students.filter(s => s.sexe === 'M').length}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Filles</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${totalStudents > 0 ? (students.filter(s => s.sexe === 'F').length / totalStudents) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900">{students.filter(s => s.sexe === 'F').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Effectifs par classe */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Effectifs par Classe</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {classes.map(classe => {
              const classStudents = students.filter(s => s.classeId === classe.id);
              const percentage = totalStudents > 0 ? (classStudents.length / totalStudents) * 100 : 0;
              
              return (
                <div key={classe.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{classe.nom}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {classStudents.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};