import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, MapPin, Calendar } from 'lucide-react';
import { Student, Class } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<Partial<Student>>({
    nom: '',
    prenom: '',
    dateNaissance: new Date(),
    lieuNaissance: '',
    sexe: 'M',
    adresse: '',
    nomTuteur: '',
    telephoneTuteur: '',
    emailTuteur: '',
    classeId: '',
    situationScolaire: '',
    antecedents: '',
    statut: 'actif'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStudents = LocalStorage.get<Student[]>('students') || [];
    const storedClasses = LocalStorage.get<Class[]>('classes') || [];
    setStudents(storedStudents);
    setClasses(storedClasses);
  };

  const saveStudent = () => {
    if (!formData.nom || !formData.prenom || !formData.classeId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const currentYear = new Date().getFullYear();
    const selectedClassObj = classes.find(c => c.id === formData.classeId);
    const classCode = selectedClassObj?.nom.substring(0, 2).toUpperCase() || 'XX';

    const studentData: Student = {
      id: editingStudent?.id || Generators.generateId(),
      matricule: editingStudent?.matricule || Generators.generateMatricule(currentYear, classCode),
      ...formData as Student,
      inscriptionDate: editingStudent?.inscriptionDate || new Date()
    };

    let updatedStudents;
    if (editingStudent) {
      updatedStudents = students.map(s => s.id === editingStudent.id ? studentData : s);
    } else {
      updatedStudents = [...students, studentData];
    }

    setStudents(updatedStudents);
    LocalStorage.set('students', updatedStudents);
    
    resetForm();
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      LocalStorage.set('students', updatedStudents);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: new Date(),
      lieuNaissance: '',
      sexe: 'M',
      adresse: '',
      nomTuteur: '',
      telephoneTuteur: '',
      emailTuteur: '',
      classeId: '',
      situationScolaire: '',
      antecedents: '',
      statut: 'actif'
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  const editStudent = (student: Student) => {
    setFormData(student);
    setEditingStudent(student);
    setShowForm(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === '' || student.classeId === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const getClassName = (classeId: string) => {
    const classe = classes.find(c => c.id === classeId);
    return classe ? classe.nom : 'Non assignée';
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingStudent ? 'Modifier l\'Élève' : 'Nouvel Élève'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveStudent(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informations Personnelles</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de Naissance</label>
                  <input
                    type="date"
                    value={formData.dateNaissance ? new Date(formData.dateNaissance).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, dateNaissance: new Date(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de Naissance</label>
                  <input
                    type="text"
                    value={formData.lieuNaissance}
                    onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                  <select
                    value={formData.sexe}
                    onChange={(e) => setFormData({...formData, sexe: e.target.value as 'M' | 'F'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                  />
                </div>
              </div>

              {/* Informations du tuteur et classe */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Tuteur et Classe</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du Tuteur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomTuteur}
                    onChange={(e) => setFormData({...formData, nomTuteur: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone Tuteur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.telephoneTuteur}
                    onChange={(e) => setFormData({...formData, telephoneTuteur: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Tuteur</label>
                  <input
                    type="email"
                    value={formData.emailTuteur}
                    onChange={(e) => setFormData({...formData, emailTuteur: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Situation Scolaire</label>
                  <textarea
                    value={formData.situationScolaire}
                    onChange={(e) => setFormData({...formData, situationScolaire: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="Ancien établissement, niveau précédent..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="transfere">Transféré</option>
                    <option value="abandonne">Abandonné</option>
                  </select>
                </div>
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
                {editingStudent ? 'Modifier' : 'Enregistrer'}
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel Élève</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des élèves */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.prenom} {student.nom}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(student.dateNaissance).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getClassName(student.classeId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.nomTuteur}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {student.telephoneTuteur}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.statut === 'actif' ? 'bg-green-100 text-green-800' :
                      student.statut === 'inactif' ? 'bg-gray-100 text-gray-800' :
                      student.statut === 'transfere' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
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

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun élève trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedClass ? 'Aucun élève ne correspond aux critères de recherche.' : 'Commencez par ajouter un élève.'}
          </p>
        </div>
      )}
    </div>
  );
};