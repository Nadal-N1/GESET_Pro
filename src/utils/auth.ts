import { User } from '../types';
import { LocalStorage } from './storage';

export class AuthService {
  private static currentUser: User | null = null;

  static login(username: string, password: string): boolean {
    try {
      if (!LocalStorage.isAvailable()) {
        throw new Error('Stockage local non disponible');
      }

      const users = LocalStorage.get<User[]>('users') || [];
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        user.lastLogin = new Date();
        this.currentUser = user;
        LocalStorage.set('currentUser', user);
        
        // Mettre à jour l'utilisateur dans la liste
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        LocalStorage.set('users', updatedUsers);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  }

  static logout(): void {
    try {
      this.currentUser = null;
      LocalStorage.remove('currentUser');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  static getCurrentUser(): User | null {
    try {
      if (!this.currentUser) {
        this.currentUser = LocalStorage.get<User>('currentUser');
      }
      return this.currentUser;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  static hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  static initializeDefaultAdmin(): void {
    try {
      if (!LocalStorage.isAvailable()) {
        console.warn('Stockage local non disponible');
        return;
      }

      const users = LocalStorage.get<User[]>('users') || [];
      
      if (users.length === 0) {
        const defaultAdmin: User = {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'administrateur',
          nom: 'Administrateur',
          prenom: 'Système',
          email: 'admin@ecole.bf',
          createdAt: new Date()
        };
        
        LocalStorage.set('users', [defaultAdmin]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'admin:', error);
    }
  }
}