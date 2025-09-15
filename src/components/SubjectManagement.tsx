import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, User } from 'lucide-react';
import { Subject, User as UserType } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState<Partial<Subject>>({
    nom: '',
    coefficient: 1,
    niveaux: [],
    enseignantId: ''
  });

  const niveaux = [
    'Maternelle',
    'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    '2nde', '1ère', 'Terminale'
  ];

  const matieresSuggestions = [
    'Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences Physiques',
    'Sciences de la Vie et de la Terre', 'Anglais', 'Allemand', 'Espagnol',
    'Philosophie', 'Éducation Physique et Sportive', 'Arts Plastiques',
    'Musique', 'Informatique', 'Économie', 'Comptabilité', 'Droit',
    'Éducation Civique et Morale', 'Travaux Pratiques', 'Technologie'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedSubjects = LocalStorage.get<Subject[]>('subjects') || [];
    const storedUsers = LocalStorage.get<UserType[]>('users') || [];
    setSubjects(storedSubjects);
    setUsers(storedUsers);
  };

  const saveSubject = () => {
    if (!formData.nom || !formData.coefficient || formData.niveaux?.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const subjectData: Subject = {
      id: editingSubject?.id || Generators.generateId(),
      ...formData as Subject
    };

    let updatedSubjects;
    if (editingSubject) {
      updatedSubjects = subjects.map(s => s.id === editingSubject.id ? subjectData : s);
    } else {
      updatedSubjects = [...subjects, subjectData];
    }

    setSubjects(updatedSubjects);
    LocalStorage.set('subjects', updatedSubjects);
    resetForm();
  };

  const deleteSubject = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      const updatedSubjects = subjects.filter(s => s.id !== id);
      setSubjects(updatedSubjects);
      LocalStorage.set('subjects', updatedSubjects);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      coefficient: 1,
      niveaux: [],
      enseignantId: ''
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  const editSubject = (subject: Subject) => {
    setFormData(subject);
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleNiveauChange = (niveau: string, checked: boolean) => {
    const currentNiveaux = formData.niveaux || [];
    if (checked) {
      setFormData({...formData, niveaux: [...currentNiveaux, niveau]});
    } else {
      setFormData({...formData, niveaux: currentNiveaux.filter(n => n !== niveau)});
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNiveau = selectedNiveau === '' || subject.niveaux.includes(selectedNiveau);
    return matchesSearch && matchesNiveau;
  });

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Non assigné';
    const teacher = users.find(u => u.id === teacherId);
    return teacher ? `${teacher.prenom} ${teacher.nom}` : 'Non trouvé';
  };

  const teachers = users.filter(u => u.role === 'enseignant');

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingSubject ? 'Modifier la Matière' : 'Nouvelle Matière'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveSubject(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la matière <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="matieres-suggestions"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Mathématiques, Français..."
                  required
                />
                <datalist id="matieres-suggestions">
                  {matieresSuggestions.map(matiere => (
                    <option key={matiere} value={matiere} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coefficient <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.coefficient}
                  onChange={(e) => setFormData({...formData, coefficient: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0.5"
                  max="10"
                  step="0.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                <select
                  value={formData.enseignantId}
                  onChange={(e) => setFormData({...formData, enseignantId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.prenom} {teacher.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Niveaux concernés <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {niveaux.map(niveau => (
                  <label key={niveau} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.niveaux?.includes(niveau) || false}
                      onChange={(e) => handleNiveauChange(niveau, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{niveau}</span>
                  </label>
                ))}
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
                {editingSubject ? 'Modifier' : 'Enregistrer'}
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Matières</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Matière</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les niveaux</option>
            {niveaux.map(niveau => (
              <option key={niveau} value={niveau}>{niveau}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredSubjects.length} matière{filteredSubjects.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des matières */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coefficient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveaux
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subject.nom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {subject.coefficient}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {subject.niveaux.slice(0, 3).map(niveau => (
                        <span key={niveau} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                          {niveau}
                        </span>
                      ))}
                      {subject.niveaux.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                          +{subject.niveaux.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {getTeacherName(subject.enseignantId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editSubject(subject)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
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

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune matière trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedNiveau ? 'Aucune matière ne correspond aux critères de recherche.' : 'Commencez par ajouter une matière.'}
          </p>
        </div>
      )}
    </div>
  );
};