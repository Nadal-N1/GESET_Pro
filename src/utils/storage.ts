import { Database } from './db';
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

export class LocalStorage {
  private static prefix = 'burkina_school_';
  private static fallbackEnabled = true;

  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error('Impossible de sauvegarder les données');
    }
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }

  static getAll<T>(pattern: string): T[] {
    const items: T[] = [];
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix + pattern)) {
          const item = this.get<T>(key.substring(this.prefix.length));
          if (item) items.push(item);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    }
    return items;
  }

  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export class StorageManager {
  static async getUsers(): Promise<User[]> {
    try {
      return await Database.getAll('users');
    } catch (error) {
      console.error('Error getting users:', error);
      return LocalStorage.get<User[]>('users') || [];
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      await Database.put('users', user);
      const users = await this.getUsers();
      LocalStorage.set('users', users);
    } catch (error) {
      console.error('Error saving user:', error);
      const users = LocalStorage.get<User[]>('users') || [];
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      LocalStorage.set('users', users);
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await Database.delete('users', id);
      const users = await this.getUsers();
      LocalStorage.set('users', users);
    } catch (error) {
      console.error('Error deleting user:', error);
      const users = (LocalStorage.get<User[]>('users') || []).filter(u => u.id !== id);
      LocalStorage.set('users', users);
    }
  }

  static async getTeachers(): Promise<Teacher[]> {
    try {
      return await Database.getAll('teachers');
    } catch (error) {
      console.error('Error getting teachers:', error);
      return LocalStorage.get<Teacher[]>('teachers') || [];
    }
  }

  static async saveTeacher(teacher: Teacher): Promise<void> {
    try {
      await Database.put('teachers', teacher);
    } catch (error) {
      console.error('Error saving teacher:', error);
      const teachers = LocalStorage.get<Teacher[]>('teachers') || [];
      const index = teachers.findIndex(t => t.id === teacher.id);
      if (index >= 0) {
        teachers[index] = teacher;
      } else {
        teachers.push(teacher);
      }
      LocalStorage.set('teachers', teachers);
    }
  }

  static async deleteTeacher(id: string): Promise<void> {
    try {
      await Database.delete('teachers', id);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      const teachers = (LocalStorage.get<Teacher[]>('teachers') || []).filter(t => t.id !== id);
      LocalStorage.set('teachers', teachers);
    }
  }

  static async getStudents(): Promise<Student[]> {
    try {
      return await Database.getAll('students');
    } catch (error) {
      console.error('Error getting students:', error);
      return LocalStorage.get<Student[]>('students') || [];
    }
  }

  static async saveStudent(student: Student): Promise<void> {
    try {
      await Database.put('students', student);
    } catch (error) {
      console.error('Error saving student:', error);
      const students = LocalStorage.get<Student[]>('students') || [];
      const index = students.findIndex(s => s.id === student.id);
      if (index >= 0) {
        students[index] = student;
      } else {
        students.push(student);
      }
      LocalStorage.set('students', students);
    }
  }

  static async deleteStudent(id: string): Promise<void> {
    try {
      await Database.delete('students', id);
    } catch (error) {
      console.error('Error deleting student:', error);
      const students = (LocalStorage.get<Student[]>('students') || []).filter(s => s.id !== id);
      LocalStorage.set('students', students);
    }
  }

  static async getClasses(): Promise<Class[]> {
    try {
      return await Database.getAll('classes');
    } catch (error) {
      console.error('Error getting classes:', error);
      return LocalStorage.get<Class[]>('classes') || [];
    }
  }

  static async saveClass(classe: Class): Promise<void> {
    try {
      await Database.put('classes', classe);
    } catch (error) {
      console.error('Error saving class:', error);
      const classes = LocalStorage.get<Class[]>('classes') || [];
      const index = classes.findIndex(c => c.id === classe.id);
      if (index >= 0) {
        classes[index] = classe;
      } else {
        classes.push(classe);
      }
      LocalStorage.set('classes', classes);
    }
  }

  static async deleteClass(id: string): Promise<void> {
    try {
      await Database.delete('classes', id);
    } catch (error) {
      console.error('Error deleting class:', error);
      const classes = (LocalStorage.get<Class[]>('classes') || []).filter(c => c.id !== id);
      LocalStorage.set('classes', classes);
    }
  }

  static async getSubjects(): Promise<Subject[]> {
    try {
      return await Database.getAll('subjects');
    } catch (error) {
      console.error('Error getting subjects:', error);
      return LocalStorage.get<Subject[]>('subjects') || [];
    }
  }

  static async saveSubject(subject: Subject): Promise<void> {
    try {
      await Database.put('subjects', subject);
    } catch (error) {
      console.error('Error saving subject:', error);
      const subjects = LocalStorage.get<Subject[]>('subjects') || [];
      const index = subjects.findIndex(s => s.id === subject.id);
      if (index >= 0) {
        subjects[index] = subject;
      } else {
        subjects.push(subject);
      }
      LocalStorage.set('subjects', subjects);
    }
  }

  static async deleteSubject(id: string): Promise<void> {
    try {
      await Database.delete('subjects', id);
    } catch (error) {
      console.error('Error deleting subject:', error);
      const subjects = (LocalStorage.get<Subject[]>('subjects') || []).filter(s => s.id !== id);
      LocalStorage.set('subjects', subjects);
    }
  }

  static async getGrades(): Promise<Grade[]> {
    try {
      return await Database.getAll('grades');
    } catch (error) {
      console.error('Error getting grades:', error);
      return LocalStorage.get<Grade[]>('grades') || [];
    }
  }

  static async saveGrade(grade: Grade): Promise<void> {
    try {
      await Database.put('grades', grade);
    } catch (error) {
      console.error('Error saving grade:', error);
      const grades = LocalStorage.get<Grade[]>('grades') || [];
      const index = grades.findIndex(g => g.id === grade.id);
      if (index >= 0) {
        grades[index] = grade;
      } else {
        grades.push(grade);
      }
      LocalStorage.set('grades', grades);
    }
  }

  static async deleteGrade(id: string): Promise<void> {
    try {
      await Database.delete('grades', id);
    } catch (error) {
      console.error('Error deleting grade:', error);
      const grades = (LocalStorage.get<Grade[]>('grades') || []).filter(g => g.id !== id);
      LocalStorage.set('grades', grades);
    }
  }

  static async getFees(): Promise<Fee[]> {
    try {
      return await Database.getAll('fees');
    } catch (error) {
      console.error('Error getting fees:', error);
      return LocalStorage.get<Fee[]>('fees') || [];
    }
  }

  static async saveFee(fee: Fee): Promise<void> {
    try {
      await Database.put('fees', fee);
    } catch (error) {
      console.error('Error saving fee:', error);
      const fees = LocalStorage.get<Fee[]>('fees') || [];
      const index = fees.findIndex(f => f.id === fee.id);
      if (index >= 0) {
        fees[index] = fee;
      } else {
        fees.push(fee);
      }
      LocalStorage.set('fees', fees);
    }
  }

  static async deleteFee(id: string): Promise<void> {
    try {
      await Database.delete('fees', id);
    } catch (error) {
      console.error('Error deleting fee:', error);
      const fees = (LocalStorage.get<Fee[]>('fees') || []).filter(f => f.id !== id);
      LocalStorage.set('fees', fees);
    }
  }

  static async getPayments(): Promise<Payment[]> {
    try {
      return await Database.getAll('payments');
    } catch (error) {
      console.error('Error getting payments:', error);
      return LocalStorage.get<Payment[]>('payments') || [];
    }
  }

  static async savePayment(payment: Payment): Promise<void> {
    try {
      await Database.put('payments', payment);
    } catch (error) {
      console.error('Error saving payment:', error);
      const payments = LocalStorage.get<Payment[]>('payments') || [];
      const index = payments.findIndex(p => p.id === payment.id);
      if (index >= 0) {
        payments[index] = payment;
      } else {
        payments.push(payment);
      }
      LocalStorage.set('payments', payments);
    }
  }

  static async deletePayment(id: string): Promise<void> {
    try {
      await Database.delete('payments', id);
    } catch (error) {
      console.error('Error deleting payment:', error);
      const payments = (LocalStorage.get<Payment[]>('payments') || []).filter(p => p.id !== id);
      LocalStorage.set('payments', payments);
    }
  }

  static async getSettings(): Promise<SchoolSettings | null> {
    try {
      const settings = await Database.getAll('settings');
      return settings[0] || null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return LocalStorage.get<SchoolSettings>('schoolSettings');
    }
  }

  static async saveSettings(settings: SchoolSettings): Promise<void> {
    try {
      await Database.put('settings', settings);
      LocalStorage.set('schoolSettings', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      LocalStorage.set('schoolSettings', settings);
    }
  }

  static async exportAllData(): Promise<Blob> {
    try {
      return await Database.backup();
    } catch (error) {
      console.error('Error exporting data:', error);
      const data = {
        users: LocalStorage.get('users'),
        teachers: LocalStorage.get('teachers'),
        students: LocalStorage.get('students'),
        classes: LocalStorage.get('classes'),
        subjects: LocalStorage.get('subjects'),
        grades: LocalStorage.get('grades'),
        fees: LocalStorage.get('fees'),
        payments: LocalStorage.get('payments'),
        settings: LocalStorage.get('schoolSettings'),
      };
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  }

  static async importAllData(file: File): Promise<void> {
    try {
      await Database.restore(file);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Impossible d\'importer les données');
    }
  }
}

// Générateurs d'ID et de matricules
export class Generators {
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static generateMatricule(year: number, classCode: string): string {
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${year}${classCode}${sequence}`;
  }

  static generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `RC${year}${month}${day}${sequence}`;
  }
}