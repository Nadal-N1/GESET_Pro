import React, { useState, useEffect } from 'react';
import { Save, School, MapPin, Phone, Mail, Globe, Calendar, Palette, User } from 'lucide-react';
import { SchoolSettings as SchoolSettingsType } from '../types';
import { LocalStorage, Generators } from '../utils/storage';

export const SchoolSettings: React.FC = () => {
  const [settings, setSettings] = useState<SchoolSettingsType>({
    id: '1',
    nomEtablissement: '',
    typeEtablissement: 'primaire_secondaire',
    adresse: '',
    ville: '',
    region: '',
    telephone: '',
    email: '',
    siteWeb: '',
    numeroAutorisation: '',
    dateCreation: new Date(),
    directeur: '',
    devise: '',
    logo: '',
    anneeScolaireActuelle: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    trimestreActuel: 1,
    couleurPrimaire: '#059669',
    couleurSecondaire: '#F59E0B',
    updatedAt: new Date()
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const regions = [
    'Boucle du Mouhoun', 'Cascades', 'Centre', 'Centre-Est', 'Centre-Nord',
    'Centre-Ouest', 'Centre-Sud', 'Est', 'Hauts-Bassins', 'Nord',
    'Plateau-Central', 'Sahel', 'Sud-Ouest'
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const storedSettings = LocalStorage.get<SchoolSettingsType>('schoolSettings');
    if (storedSettings) {
      setSettings(storedSettings);
    } else {
      // Initialiser avec des valeurs par défaut
      const defaultSettings: SchoolSettingsType = {
        id: '1',
        nomEtablissement: 'École Primaire et Secondaire',
        typeEtablissement: 'primaire_secondaire',
        adresse: '',
        ville: 'Ouagadougou',
        region: 'Centre',
        telephone: '',
        email: '',
        siteWeb: '',
        numeroAutorisation: '',
        dateCreation: new Date(),
        directeur: '',
        devise: 'Excellence et Discipline',
        logo: '',
        anneeScolaireActuelle: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        trimestreActuel: 1,
        couleurPrimaire: '#059669',
        couleurSecondaire: '#F59E0B',
        updatedAt: new Date()
      };
      setSettings(defaultSettings);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updatedSettings = {
        ...settings,
        updatedAt: new Date()
      };

      LocalStorage.set('schoolSettings', updatedSettings);
      setSettings(updatedSettings);
      
      setSaveMessage('Configuration sauvegardée avec succès !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SchoolSettingsType, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Configuration de l'Établissement</h1>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white transition-colors ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('succès') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <School className="h-5 w-5 mr-2 text-green-600" />
            Informations Générales
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'établissement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.nomEtablissement}
                onChange={(e) => handleInputChange('nomEtablissement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: École Primaire Publique de..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'établissement</label>
              <select
                value={settings.typeEtablissement}
                onChange={(e) => handleInputChange('typeEtablissement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="primaire">Primaire uniquement</option>
                <option value="secondaire">Secondaire uniquement</option>
                <option value="primaire_secondaire">Primaire et Secondaire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'autorisation</label>
              <input
                type="text"
                value={settings.numeroAutorisation}
                onChange={(e) => handleInputChange('numeroAutorisation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 2024-001-MENAPLN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
              <input
                type="date"
                value={settings.dateCreation ? new Date(settings.dateCreation).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('dateCreation', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Directeur/Directrice</label>
              <input
                type="text"
                value={settings.directeur}
                onChange={(e) => handleInputChange('directeur', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nom complet du directeur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise de l'établissement</label>
              <input
                type="text"
                value={settings.devise}
                onChange={(e) => handleInputChange('devise', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Excellence et Discipline"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Coordonnées
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <textarea
                value={settings.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="Adresse complète de l'établissement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={settings.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Ouagadougou"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
              <select
                value={settings.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sélectionner une région</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={settings.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: +226 25 XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="contact@ecole.bf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Site Web
              </label>
              <input
                type="url"
                value={settings.siteWeb}
                onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://www.ecole.bf"
              />
            </div>
          </div>
        </div>

        {/* Année scolaire */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Année Scolaire
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année scolaire actuelle</label>
              <input
                type="text"
                value={settings.anneeScolaireActuelle}
                onChange={(e) => handleInputChange('anneeScolaireActuelle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="2024-2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre actuel</label>
              <select
                value={settings.trimestreActuel}
                onChange={(e) => handleInputChange('trimestreActuel', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personnalisation */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-green-600" />
            Personnalisation
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur primaire</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.couleurPrimaire}
                  onChange={(e) => handleInputChange('couleurPrimaire', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.couleurPrimaire}
                  onChange={(e) => handleInputChange('couleurPrimaire', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="#059669"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.couleurSecondaire}
                  onChange={(e) => handleInputChange('couleurSecondaire', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.couleurSecondaire}
                  onChange={(e) => handleInputChange('couleurSecondaire', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="#F59E0B"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo de l'établissement</label>
              <input
                type="url"
                value={settings.logo}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="URL du logo (optionnel)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous pouvez utiliser une URL d'image ou laisser vide pour utiliser l'icône par défaut
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h2>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="h-16 w-16 object-contain" />
              ) : (
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: settings.couleurPrimaire + '20' }}
                >
                  <School className="h-10 w-10" style={{ color: settings.couleurPrimaire }} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{settings.nomEtablissement || 'Nom de l\'établissement'}</h3>
            {settings.devise && (
              <p className="text-sm text-gray-600 italic">"{settings.devise}"</p>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <p>{settings.adresse && `${settings.adresse}, `}{settings.ville} - {settings.region}</p>
              {settings.telephone && <p>Tél: {settings.telephone}</p>}
              {settings.email && <p>Email: {settings.email}</p>}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>Année scolaire: {settings.anneeScolaireActuelle} - Trimestre {settings.trimestreActuel}</p>
              {settings.directeur && <p>Directeur: {settings.directeur}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};