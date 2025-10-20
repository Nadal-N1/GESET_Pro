import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin, Calendar, BookOpen, Award, AlertCircle } from 'lucide-react';
import { Teacher, Subject, NiveauType } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    nom: '',
    prenom: '',
    dateNaissance: new Date(),
    lieuNaissance: '',
    sexe: 'M',
    adresse: '',
    telephone: '',
    email: '',
    diplome: '',
    specialite: '',
    niveauxType: [],
    matieres: [],
    dateRecrutement: new Date(),
    situationMatrimoniale: 'celibataire',
    nombreEnfants: 0,
    personneUrgence: '',
    telephoneUrgence: '',
    statut: 'actif',
    photo: ''
  });

  const niveauxTypeOptions: NiveauType[] = ['MATERNELLE', 'PRIMAIRE', 'SECONDAIRE'];

  const diplomesOptions = [
    'BEPC',
    'BAC',
    'Licence',
    'Master',
    'Doctorat',
    'CAP',
    'BEP',
    'BTS',
    'DUT',
    'Autre'
  ];

  const matieresSuggestions = [
    'Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences Physiques',
    'Sciences de la Vie et de la Terre', 'Anglais', 'Allemand', 'Espagnol',
    'Philosophie', 'Éducation Physique et Sportive', 'Arts Plastiques',
    'Musique', 'Informatique', 'Économie', 'Comptabilité', 'Droit',
    'Éducation Civique et Morale', 'Travaux Pratiques', 'Technologie',
    'Éveil', 'Graphisme', 'Motricité'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedTeachers = LocalStorage.get<Teacher[]>('teachers') || [];
    const storedSubjects = LocalStorage.get<Subject[]>('subjects') || [];
    setTeachers(storedTeachers);
    setSubjects(storedSubjects);
  };

  const saveTeacher = () => {
    if (!formData.nom || !formData.prenom || !formData.telephone || !formData.diplome) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const currentYear = new Date().getFullYear();
    const teacherCode = `ENS${currentYear}`;
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const matricule = editingTeacher?.matricule || `${teacherCode}${sequence}`;

    const teacherData: Teacher = {
      id: editingTeacher?.id || Generators.generateId(),
      matricule,
      ...formData as Teacher
    };

    let updatedTeachers;
    if (editingTeacher) {
      updatedTeachers = teachers.map(t => t.id === editingTeacher.id ? teacherData : t);
    } else {
      updatedTeachers = [...teachers, teacherData];
    }

    setTeachers(updatedTeachers);
    LocalStorage.set('teachers', updatedTeachers);
    resetForm();
  };

  const deleteTeacher = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      const updatedTeachers = teachers.filter(t => t.id !== id);
      setTeachers(updatedTeachers);
      LocalStorage.set('teachers', updatedTeachers);
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
      telephone: '',
      email: '',
      diplome: '',
      specialite: '',
      niveauxType: [],
      matieres: [],
      dateRecrutement: new Date(),
      situationMatrimoniale: 'celibataire',
      nombreEnfants: 0,
      personneUrgence: '',
      telephoneUrgence: '',
      statut: 'actif',
      photo: ''
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  const editTeacher = (teacher: Teacher) => {
    setFormData(teacher);
    setEditingTeacher(teacher);
    setShowForm(true);
  };

  const handleNiveauTypeChange = (niveauType: NiveauType, checked: boolean) => {
    const currentNiveauxType = formData.niveauxType || [];
    if (checked) {
      setFormData({...formData, niveauxType: [...currentNiveauxType, niveauType]});
    } else {
      setFormData({...formData, niveauxType: currentNiveauxType.filter(n => n !== niveauType)});
    }
  };

  const handleMatiereChange = (matiere: string, checked: boolean) => {
    const currentMatieres = formData.matieres || [];
    if (checked) {
      setFormData({...formData, matieres: [...currentMatieres, matiere]});
    } else {
      setFormData({...formData, matieres: currentMatieres.filter(m => m !== matiere)});
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch =
      teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || teacher.statut === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut: string) => {
    const badges = {
      'actif': 'bg-green-100 text-green-800',
      'conge': 'bg-yellow-100 text-yellow-800',
      'suspendu': 'bg-red-100 text-red-800',
      'demissionnaire': 'bg-gray-100 text-gray-800'
    };
    return badges[statut as keyof typeof badges] || badges.actif;
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingTeacher ? 'Modifier l\'Enseignant' : 'Nouvel Enseignant'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveTeacher(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={formData.dateNaissance ? new Date(formData.dateNaissance).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, dateNaissance: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                <input
                  type="text"
                  value={formData.lieuNaissance}
                  onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+226 XX XX XX XX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diplôme <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.diplome}
                  onChange={(e) => setFormData({...formData, diplome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner un diplôme</option>
                  {diplomesOptions.map(diplome => (
                    <option key={diplome} value={diplome}>{diplome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input
                  type="text"
                  value={formData.specialite}
                  onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Mathématiques, Lettres..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de recrutement</label>
                <input
                  type="date"
                  value={formData.dateRecrutement ? new Date(formData.dateRecrutement).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, dateRecrutement: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situation matrimoniale</label>
                <select
                  value={formData.situationMatrimoniale}
                  onChange={(e) => setFormData({...formData, situationMatrimoniale: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf(ve)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                <input
                  type="number"
                  value={formData.nombreEnfants}
                  onChange={(e) => setFormData({...formData, nombreEnfants: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personne à contacter (urgence)</label>
                <input
                  type="text"
                  value={formData.personneUrgence}
                  onChange={(e) => setFormData({...formData, personneUrgence: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
                <input
                  type="tel"
                  value={formData.telephoneUrgence}
                  onChange={(e) => setFormData({...formData, telephoneUrgence: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <option value="conge">En congé</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="demissionnaire">Démissionnaire</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Niveaux d'enseignement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {niveauxTypeOptions.map(niveauType => (
                  <label key={niveauType} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.niveauxType?.includes(niveauType) || false}
                      onChange={(e) => handleNiveauTypeChange(niveauType, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{niveauType}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Matières enseignées
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {matieresSuggestions.map(matiere => (
                  <label key={matiere} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.matieres?.includes(matiere) || false}
                      onChange={(e) => handleMatiereChange(matiere, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{matiere}</span>
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
                {editingTeacher ? 'Modifier' : 'Enregistrer'}
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel Enseignant</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="conge">En congé</option>
            <option value="suspendu">Suspendu</option>
            <option value="demissionnaire">Démissionnaire</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {teacher.prenom} {teacher.nom}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(teacher.statut)}`}>
                    {teacher.statut}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Mat: {teacher.matricule}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {teacher.niveauxType?.map(niveauType => (
                    <span key={niveauType} className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      {niveauType}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-2">
                <button
                  onClick={() => editTeacher(teacher)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTeacher(teacher.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{teacher.diplome} - {teacher.specialite}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{teacher.telephone}</span>
              </div>
              {teacher.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{teacher.adresse || 'Non renseigné'}</span>
              </div>
              {teacher.matieres && teacher.matieres.length > 0 && (
                <div className="flex items-start text-gray-600 mt-2">
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{teacher.matieres.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun enseignant trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus ? 'Aucun enseignant ne correspond aux critères de recherche.' : 'Commencez par ajouter un enseignant.'}
          </p>
        </div>
      )}
    </div>
  );
};
