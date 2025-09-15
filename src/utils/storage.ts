// Gestion du stockage local pour fonctionnement hors ligne
export class LocalStorage {
  private static prefix = 'burkina_school_';

  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
    localStorage.removeItem(this.prefix + key);
  }

  static clear(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  static getAll<T>(pattern: string): T[] {
    const items: T[] = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix + pattern)) {
        const item = this.get<T>(key.substring(this.prefix.length));
        if (item) items.push(item);
      }
    });
    return items;
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