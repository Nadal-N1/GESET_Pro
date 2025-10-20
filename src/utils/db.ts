import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  User,
  Teacher,
  Student,
  Class,
  Subject,
  Grade,
  Fee,
  Payment,
  SchoolSettings
} from '../types';

interface SchoolDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-username': string };
  };
  teachers: {
    key: string;
    value: Teacher;
    indexes: { 'by-matricule': string; 'by-statut': string };
  };
  students: {
    key: string;
    value: Student;
    indexes: { 'by-matricule': string; 'by-classe': string; 'by-statut': string };
  };
  classes: {
    key: string;
    value: Class;
    indexes: { 'by-annee': string };
  };
  subjects: {
    key: string;
    value: Subject;
  };
  grades: {
    key: string;
    value: Grade;
    indexes: { 'by-eleve': string; 'by-matiere': string; 'by-classe': string; 'by-trimestre': number };
  };
  fees: {
    key: string;
    value: Fee;
  };
  payments: {
    key: string;
    value: Payment;
    indexes: { 'by-eleve': string; 'by-frais': string };
  };
  settings: {
    key: string;
    value: SchoolSettings;
  };
}

const DB_NAME = 'school-management-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SchoolDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<SchoolDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<SchoolDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('by-username', 'username', { unique: true });
        }

        if (!db.objectStoreNames.contains('teachers')) {
          const teacherStore = db.createObjectStore('teachers', { keyPath: 'id' });
          teacherStore.createIndex('by-matricule', 'matricule', { unique: true });
          teacherStore.createIndex('by-statut', 'statut');
        }

        if (!db.objectStoreNames.contains('students')) {
          const studentStore = db.createObjectStore('students', { keyPath: 'id' });
          studentStore.createIndex('by-matricule', 'matricule', { unique: true });
          studentStore.createIndex('by-classe', 'classeId');
          studentStore.createIndex('by-statut', 'statut');
        }

        if (!db.objectStoreNames.contains('classes')) {
          const classStore = db.createObjectStore('classes', { keyPath: 'id' });
          classStore.createIndex('by-annee', 'anneeScolaire');
        }

        if (!db.objectStoreNames.contains('subjects')) {
          db.createObjectStore('subjects', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('grades')) {
          const gradeStore = db.createObjectStore('grades', { keyPath: 'id' });
          gradeStore.createIndex('by-eleve', 'eleveId');
          gradeStore.createIndex('by-matiere', 'matiereId');
          gradeStore.createIndex('by-classe', 'classeId');
          gradeStore.createIndex('by-trimestre', 'trimestre');
        }

        if (!db.objectStoreNames.contains('fees')) {
          db.createObjectStore('fees', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('payments')) {
          const paymentStore = db.createObjectStore('payments', { keyPath: 'id' });
          paymentStore.createIndex('by-eleve', 'eleveId');
          paymentStore.createIndex('by-frais', 'fraisId');
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error('Impossible d\'initialiser la base de données');
  }
}

export class Database {
  private static async getDB(): Promise<IDBPDatabase<SchoolDB>> {
    return await initDB();
  }

  static async getAll<T extends keyof SchoolDB>(storeName: T): Promise<SchoolDB[T]['value'][]> {
    try {
      const db = await this.getDB();
      return await db.getAll(storeName);
    } catch (error) {
      console.error(`Error getting all from ${storeName}:`, error);
      return [];
    }
  }

  static async getByIndex<T extends keyof SchoolDB>(
    storeName: T,
    indexName: string,
    value: any
  ): Promise<SchoolDB[T]['value'][]> {
    try {
      const db = await this.getDB();
      return await db.getAllFromIndex(storeName, indexName as any, value);
    } catch (error) {
      console.error(`Error getting from index ${indexName}:`, error);
      return [];
    }
  }

  static async get<T extends keyof SchoolDB>(
    storeName: T,
    id: string
  ): Promise<SchoolDB[T]['value'] | undefined> {
    try {
      const db = await this.getDB();
      return await db.get(storeName, id);
    } catch (error) {
      console.error(`Error getting from ${storeName}:`, error);
      return undefined;
    }
  }

  static async add<T extends keyof SchoolDB>(
    storeName: T,
    value: SchoolDB[T]['value']
  ): Promise<string> {
    try {
      const db = await this.getDB();
      const result = await db.add(storeName, value);
      return result as string;
    } catch (error) {
      console.error(`Error adding to ${storeName}:`, error);
      throw new Error(`Impossible d'ajouter l'élément`);
    }
  }

  static async put<T extends keyof SchoolDB>(
    storeName: T,
    value: SchoolDB[T]['value']
  ): Promise<string> {
    try {
      const db = await this.getDB();
      const result = await db.put(storeName, value);
      return result as string;
    } catch (error) {
      console.error(`Error updating ${storeName}:`, error);
      throw new Error(`Impossible de mettre à jour l'élément`);
    }
  }

  static async delete<T extends keyof SchoolDB>(
    storeName: T,
    id: string
  ): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete(storeName, id);
    } catch (error) {
      console.error(`Error deleting from ${storeName}:`, error);
      throw new Error(`Impossible de supprimer l'élément`);
    }
  }

  static async clear<T extends keyof SchoolDB>(storeName: T): Promise<void> {
    try {
      const db = await this.getDB();
      await db.clear(storeName);
    } catch (error) {
      console.error(`Error clearing ${storeName}:`, error);
      throw new Error(`Impossible de vider la table`);
    }
  }

  static async count<T extends keyof SchoolDB>(storeName: T): Promise<number> {
    try {
      const db = await this.getDB();
      return await db.count(storeName);
    } catch (error) {
      console.error(`Error counting ${storeName}:`, error);
      return 0;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const db = await this.getDB();
      const data: Record<string, any[]> = {};

      const stores: Array<keyof SchoolDB> = [
        'users',
        'teachers',
        'students',
        'classes',
        'subjects',
        'grades',
        'fees',
        'payments',
        'settings',
      ];

      for (const store of stores) {
        data[store] = await db.getAll(store);
      }

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Impossible d\'exporter les données');
    }
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      const db = await this.getDB();

      const stores: Array<keyof SchoolDB> = [
        'users',
        'teachers',
        'students',
        'classes',
        'subjects',
        'grades',
        'fees',
        'payments',
        'settings',
      ];

      for (const store of stores) {
        if (data[store] && Array.isArray(data[store])) {
          await db.clear(store);
          for (const item of data[store]) {
            await db.put(store, item);
          }
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Impossible d\'importer les données');
    }
  }

  static async backup(): Promise<Blob> {
    try {
      const data = await this.exportData();
      return new Blob([data], { type: 'application/json' });
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Impossible de créer la sauvegarde');
    }
  }

  static async restore(file: File): Promise<void> {
    try {
      const text = await file.text();
      await this.importData(text);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Impossible de restaurer la sauvegarde');
    }
  }
}
