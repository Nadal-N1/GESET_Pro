import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, GraduationCap, User } from 'lucide-react';
import { Class, User as UserType, NiveauType, ClasseNiveau } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiveauType, setSelectedNiveauType] = useState<NiveauType | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const [formData, setFormData] = useState<Partial<Class>>({
    nom: '',
    niveauType: undefined,
    niveau: undefined,
    section: '',
    filiere: '',
    serie: '',
    enseignantPrincipalId: '',
    effectifMax: 30,
    anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  const niveauxConfig = {
    MATERNELLE: ['Petite Section', 'Moyenne Section', 'Grande Section'] as ClasseNiveau[],
    PRIMAIRE: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'] as ClasseNiveau[],
    SECONDAIRE: ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'] as ClasseNiveau[]
  };

  const sectionsSecondaire = {
    '2de': ['A', 'C', 'D'],
    '1re': ['A', 'C', 'D'],
    'Tle': ['A', 'C', 'D']
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedClasses = LocalStorage.get<Class[]>('classes') || [];
    const storedUsers = LocalStorage.get<UserType[]>('users') || [];
    setClasses(storedClasses);
    setUsers(storedUsers);
  };

  const saveClass = () => {
    if (!formData.nom || !formData.niveauType || !formData.niveau) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const classData: Class = {
      id: editingClass?.id || Generators.generateId(),
      ...formData as Class
    };

    let updatedClasses;
    if (editingClass) {
      updatedClasses = classes.map(c => c.id === editingClass.id ? classData : c);
    } else {
      updatedClasses = [...classes, classData];
    }

    setClasses(updatedClasses);
    LocalStorage.set('classes', updatedClasses);
    resetForm();
  };

  const deleteClass = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      LocalStorage.set('classes', updatedClasses);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      niveauType: undefined,
      niveau: undefined,
      section: '',
      filiere: '',
      serie: '',
      enseignantPrincipalId: '',
      effectifMax: 30,
      anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
    });
    setEditingClass(null);
    setShowForm(false);
  };

  const editClass = (classe: Class) => {
    setFormData(classe);
    setEditingClass(classe);
    setShowForm(true);
  };

  const filteredClasses = classes.filter(classe => {
    const matchesSearch = classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classe.niveau.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNiveauType = selectedNiveauType === '' || classe.niveauType === selectedNiveauType;
    return matchesSearch && matchesNiveauType;
  });

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Non assigné';
    const teacher = users.find(u => u.id === teacherId);
    return teacher ? `${teacher.prenom} ${teacher.nom}` : 'Non trouvé';
  };

  const teachers = users.filter(u => u.role === 'enseignant');

  const handleNiveauTypeChange = (niveauType: NiveauType) => {
    setFormData({
      ...formData,
      niveauType,
      niveau: undefined,
      section: '',
      filiere: '',
      serie: ''
    });
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingClass ? 'Modifier la Classe' : 'Nouvelle Classe'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveClass(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de niveau <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.niveauType || ''}
                  onChange={(e) => handleNiveauTypeChange(e.target.value as NiveauType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="MATERNELLE">Maternelle</option>
                  <option value="PRIMAIRE">Primaire</option>
                  <option value="SECONDAIRE">Secondaire</option>
                </select>
              </div>

              {formData.niveauType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.niveau || ''}
                    onChange={(e) => setFormData({...formData, niveau: e.target.value as ClasseNiveau, section: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {niveauxConfig[formData.niveauType].map(niveau => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la classe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 6e A, CP1 B, Petite Section Rouge..."
                  required
                />
              </div>

              {formData.niveauType === 'SECONDAIRE' && formData.niveau &&
               ['2de', '1re', 'Tle'].includes(formData.niveau) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner une section</option>
                    {sectionsSecondaire[formData.niveau as keyof typeof sectionsSecondaire]?.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.niveauType === 'SECONDAIRE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <input
                      type="text"
                      value={formData.filiere}
                      onChange={(e) => setFormData({...formData, filiere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Littéraire, Scientifique..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
                    <input
                      type="text"
                      value={formData.serie}
                      onChange={(e) => setFormData({...formData, serie: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: A, C, D..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.niveauType === 'MATERNELLE' ? 'Enseignant(e) Responsable' : 'Enseignant Principal'}
                </label>
                <select
                  value={formData.enseignantPrincipalId}
                  onChange={(e) => setFormData({...formData, enseignantPrincipalId: e.target.value})}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effectif Maximum</label>
                <input
                  type="number"
                  value={formData.effectifMax}
                  onChange={(e) => setFormData({...formData, effectifMax: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année Scolaire</label>
                <input
                  type="text"
                  value={formData.anneeScolaire}
                  onChange={(e) => setFormData({...formData, anneeScolaire: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="2024-2025"
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
                {editingClass ? 'Modifier' : 'Enregistrer'}
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Classe</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une classe..."
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
            <option value="">Tous les niveaux</option>
            <option value="MATERNELLE">Maternelle</option>
            <option value="PRIMAIRE">Primaire</option>
            <option value="SECONDAIRE">Secondaire</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredClasses.length} classe{filteredClasses.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classe) => (
          <div key={classe.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{classe.nom}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                    {classe.niveauType}
                  </span>
                  <p className="text-sm text-gray-600">{classe.niveau}</p>
                </div>
                {classe.section && (
                  <p className="text-sm text-gray-500 mt-1">Section: {classe.section}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editClass(classe)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteClass(classe.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Enseignant: {getTeacherName(classe.enseignantPrincipalId)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Effectif max: {classe.effectifMax}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>Année: {classe.anneeScolaire}</span>
              </div>
              {classe.filiere && (
                <p className="text-gray-600">Filière: {classe.filiere}</p>
              )}
              {classe.serie && (
                <p className="text-gray-600">Série: {classe.serie}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune classe trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedNiveauType ? 'Aucune classe ne correspond aux critères de recherche.' : 'Commencez par ajouter une classe.'}
          </p>
        </div>
      )}
    </div>
  );
};
