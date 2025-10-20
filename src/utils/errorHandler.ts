import { ValidationError } from './validation';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  static handle(error: unknown): string {
    console.error('Error caught:', error);

    if (error instanceof ValidationError) {
      return error.message;
    }

    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return 'Espace de stockage insuffisant. Veuillez libérer de l\'espace.';
      }

      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Erreur de connexion. Vérifiez votre connexion internet.';
      }

      if (error.message.includes('permission')) {
        return 'Permission refusée. Vérifiez vos droits d\'accès.';
      }

      return error.message;
    }

    return 'Une erreur inattendue s\'est produite';
  }

  static async safeAsync<T>(
    fn: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      console.error('Async operation failed:', error);
      return fallback;
    }
  }

  static safe<T>(fn: () => T, fallback?: T): T | undefined {
    try {
      return fn();
    } catch (error) {
      console.error('Operation failed:', error);
      return fallback;
    }
  }

  static showError(error: unknown): void {
    const message = this.handle(error);
    alert(message);
  }

  static async wrapAsync<T>(
    fn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      console.error(errorMessage || 'Operation failed:', error);
      this.showError(error);
      return null;
    }
  }
}

export const handleError = (error: unknown): void => {
  ErrorHandler.showError(error);
};

export const safeAsync = <T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  return ErrorHandler.safeAsync(fn, fallback);
};

export const safe = <T>(fn: () => T, fallback?: T): T | undefined => {
  return ErrorHandler.safe(fn, fallback);
};
