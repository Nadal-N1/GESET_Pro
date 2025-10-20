import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, User, UserPlus } from 'lucide-react';
import { Subject, User as UserType, Teacher, NiveauType, ClasseNiveau } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiveauType, setSelectedNiveauType] = useState<NiveauType | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState<Partial<Subject>>({
    nom: '',
    coefficient: 1,
    niveauxType: [],
    niveaux: [],
    enseignantId: ''
  });

  const [teacherFormData, setTeacherFormData] = useState<Partial<Teacher>>({
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

  const niveauxConfig = {
    MATERNELLE: ['Petite Section', 'Moyenne Section', 'Grande Section'] as ClasseNiveau[],
    PRIMAIRE: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'] as ClasseNiveau[],
    SECONDAIRE: ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'] as ClasseNiveau[]
  };

  const matieresSuggestions = [
    'Français', 'Mathématiques', 'Histoire-Géographie', 'Sciences Physiques',
    'Sciences de la Vie et de la Terre', 'Anglais', 'Allemand', 'Espagnol',
    'Philosophie', 'Éducation Physique et Sportive', 'Arts Plastiques',
    'Musique', 'Informatique', 'Économie', 'Comptabilité', 'Droit',
    'Éducation Civique et Morale', 'Travaux Pratiques', 'Technologie',
    'Éveil', 'Graphisme', 'Motricité'
  ];

  const diplomesOptions = [
    'BEPC', 'BAC', 'Licence', 'Master', 'Doctorat', 'CAP', 'BEP', 'BTS', 'DUT', 'Autre'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedSubjects = LocalStorage.get<Subject[]>('subjects') || [];
    const storedUsers = LocalStorage.get<UserType[]>('users') || [];
    const storedTeachers = LocalStorage.get<Teacher[]>('teachers') || [];
    setSubjects(storedSubjects);
    setUsers(storedUsers);
    setTeachers(storedTeachers);
  };

  const saveTeacher = () => {
    if (!teacherFormData.nom || !teacherFormData.prenom || !teacherFormData.telephone || !teacherFormData.diplome) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const currentYear = new Date().getFullYear();
    const teacherCode = `ENS${currentYear}`;
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const matricule = `${teacherCode}${sequence}`;

    const teacherId = Generators.generateId();
    const teacherData: Teacher = {
      id: teacherId,
      matricule,
      ...teacherFormData as Teacher
    };

    const username = `${teacherFormData.nom?.toLowerCase()}.${teacherFormData.prenom?.toLowerCase()}`;
    const userData: UserType = {
      id: Generators.generateId(),
      username,
      password: 'password123',
      role: 'enseignant',
      nom: teacherFormData.nom!,
      prenom: teacherFormData.prenom!,
      email: teacherFormData.email,
      telephone: teacherFormData.telephone!,
      createdAt: new Date()
    };

    teacherData.userId = userData.id;

    const updatedTeachers = [...teachers, teacherData];
    const updatedUsers = [...users, userData];

    setTeachers(updatedTeachers);
    setUsers(updatedUsers);
    LocalStorage.set('teachers', updatedTeachers);
    LocalStorage.set('users', updatedUsers);

    setFormData({ ...formData, enseignantId: userData.id });
    resetTeacherForm();
    loadData();
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
      niveauxType: [],
      niveaux: [],
      enseignantId: ''
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  const resetTeacherForm = () => {
    setTeacherFormData({
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
    setShowTeacherModal(false);
  };

  const editSubject = (subject: Subject) => {
    setFormData(subject);
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleNiveauTypeChange = (niveauType: NiveauType, checked: boolean) => {
    const currentNiveauxType = formData.niveauxType || [];
    const currentNiveaux = formData.niveaux || [];

    if (checked) {
      setFormData({
        ...formData,
        niveauxType: [...currentNiveauxType, niveauType]
      });
    } else {
      const niveauxToRemove = niveauxConfig[niveauType];
      setFormData({
        ...formData,
        niveauxType: currentNiveauxType.filter(n => n !== niveauType),
        niveaux: currentNiveaux.filter(n => !niveauxToRemove.includes(n))
      });
    }
  };

  const handleNiveauChange = (niveau: ClasseNiveau, checked: boolean) => {
    const currentNiveaux = formData.niveaux || [];
    if (checked) {
      setFormData({...formData, niveaux: [...currentNiveaux, niveau]});
    } else {
      setFormData({...formData, niveaux: currentNiveaux.filter(n => n !== niveau)});
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNiveauType = selectedNiveauType === '' ||
      (subject.niveauxType && subject.niveauxType.includes(selectedNiveauType));
    return matchesSearch && matchesNiveauType;
  });

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Non assigné';
    const teacher = users.find(u => u.id === teacherId);
    return teacher ? `${teacher.prenom} ${teacher.nom}` : 'Non trouvé';
  };

  const teacherUsers = users.filter(u => u.role === 'enseignant');

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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                <div className="flex space-x-2">
                  <select
                    value={formData.enseignantId}
                    onChange={(e) => setFormData({...formData, enseignantId: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner un enseignant</option>
                    {teacherUsers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.prenom} {teacher.nom}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowTeacherModal(true)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    title="Ajouter un nouvel enseignant"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nouveau</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Types de niveaux concernés <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {(Object.keys(niveauxConfig) as NiveauType[]).map(niveauType => (
                  <label key={niveauType} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.niveauxType?.includes(niveauType) || false}
                      onChange={(e) => handleNiveauTypeChange(niveauType, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{niveauType}</span>
                  </label>
                ))}
              </div>

              {formData.niveauxType && formData.niveauxType.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Classes spécifiques <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    {formData.niveauxType.map(niveauType => (
                      <div key={niveauType} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">{niveauType}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {niveauxConfig[niveauType].map(niveau => (
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
                    ))}
                  </div>
                </div>
              )}
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

        {showTeacherModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Nouvel Enseignant</h3>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); saveTeacher(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={teacherFormData.nom}
                        onChange={(e) => setTeacherFormData({...teacherFormData, nom: e.target.value})}
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
                        value={teacherFormData.prenom}
                        onChange={(e) => setTeacherFormData({...teacherFormData, prenom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={teacherFormData.telephone}
                        onChange={(e) => setTeacherFormData({...teacherFormData, telephone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+226 XX XX XX XX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={teacherFormData.email}
                        onChange={(e) => setTeacherFormData({...teacherFormData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diplôme <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={teacherFormData.diplome}
                        onChange={(e) => setTeacherFormData({...teacherFormData, diplome: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Sélectionner</option>
                        {diplomesOptions.map(diplome => (
                          <option key={diplome} value={diplome}>{diplome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                      <input
                        type="text"
                        value={teacherFormData.specialite}
                        onChange={(e) => setTeacherFormData({...teacherFormData, specialite: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: Mathématiques"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Niveaux d'enseignement
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(niveauxConfig) as NiveauType[]).map(niveauType => (
                        <label key={niveauType} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={teacherFormData.niveauxType?.includes(niveauType) || false}
                            onChange={(e) => {
                              const currentNiveauxType = teacherFormData.niveauxType || [];
                              if (e.target.checked) {
                                setTeacherFormData({...teacherFormData, niveauxType: [...currentNiveauxType, niveauType]});
                              } else {
                                setTeacherFormData({...teacherFormData, niveauxType: currentNiveauxType.filter(n => n !== niveauType)});
                              }
                            }}
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
                            checked={teacherFormData.matieres?.includes(matiere) || false}
                            onChange={(e) => {
                              const currentMatieres = teacherFormData.matieres || [];
                              if (e.target.checked) {
                                setTeacherFormData({...teacherFormData, matieres: [...currentMatieres, matiere]});
                              } else {
                                setTeacherFormData({...teacherFormData, matieres: currentMatieres.filter(m => m !== matiere)});
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{matiere}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetTeacherForm}
                      className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Créer l'enseignant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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
            value={selectedNiveauType}
            onChange={(e) => setSelectedNiveauType(e.target.value as NiveauType | '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les types de niveaux</option>
            <option value="MATERNELLE">Maternelle</option>
            <option value="PRIMAIRE">Primaire</option>
            <option value="SECONDAIRE">Secondaire</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredSubjects.length} matière{filteredSubjects.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{subject.nom}</h3>
                <p className="text-sm text-gray-600">Coefficient: {subject.coefficient}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {subject.niveauxType?.map(niveauType => (
                    <span key={niveauType} className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      {niveauType}
                    </span>
                  ))}
                </div>
              </div>
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
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Enseignant: {getTeacherName(subject.enseignantId)}</span>
              </div>
              <div className="text-gray-600">
                <BookOpen className="h-4 w-4 inline mr-2" />
                <span className="text-xs">
                  {subject.niveaux?.join(', ') || 'Tous les niveaux'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune matière trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedNiveauType ? 'Aucune matière ne correspond aux critères de recherche.' : 'Commencez par ajouter une matière.'}
          </p>
        </div>
      )}
    </div>
  );
};
