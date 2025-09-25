import { SchoolSettings } from '../types';
import { LocalStorage } from './storage';

export class SchoolSettingsService {
  private static defaultSettings: SchoolSettings = {
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

  static getSettings(): SchoolSettings {
    try {
      const settings = LocalStorage.get<SchoolSettings>('schoolSettings');
      if (!settings) {
        this.initializeSettings();
        return this.defaultSettings;
      }
      return settings;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      return this.defaultSettings;
    }
  }

  static saveSettings(settings: SchoolSettings): void {
    try {
      const updatedSettings = {
        ...settings,
        updatedAt: new Date()
      };
      LocalStorage.set('schoolSettings', updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      throw error;
    }
  }

  static initializeSettings(): void {
    try {
      const existingSettings = LocalStorage.get<SchoolSettings>('schoolSettings');
      if (!existingSettings) {
        LocalStorage.set('schoolSettings', this.defaultSettings);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des paramètres:', error);
    }
  }

  static updateSetting<K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]): void {
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      [key]: value,
      updatedAt: new Date()
    };
    this.saveSettings(updatedSettings);
  }

  static getCurrentSchoolYear(): string {
    const settings = this.getSettings();
    return settings.anneeScolaireActuelle;
  }

  static getCurrentTrimester(): 1 | 2 | 3 {
    const settings = this.getSettings();
    return settings.trimestreActuel;
  }

  static getSchoolName(): string {
    const settings = this.getSettings();
    return settings.nomEtablissement;
  }

  static getSchoolColors(): { primary: string; secondary: string } {
    const settings = this.getSettings();
    return {
      primary: settings.couleurPrimaire,
      secondary: settings.couleurSecondaire
    };
  }

  static exportSettings(): string {
    const settings = this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  static importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson) as SchoolSettings;
      this.saveSettings(settings);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import des paramètres:', error);
      return false;
    }
  }

  static resetToDefaults(): void {
    LocalStorage.set('schoolSettings', this.defaultSettings);
  }
}