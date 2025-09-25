import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SchoolSettings } from './components/SchoolSettings';
import { StudentManagement } from './components/StudentManagement';
import { ClassManagement } from './components/ClassManagement';
import { SubjectManagement } from './components/SubjectManagement';
import { GradeManagement } from './components/GradeManagement';
import { FeeManagement } from './components/FeeManagement';
import { ReportManagement } from './components/ReportManagement';
import { UserManagement } from './components/UserManagement';
import { AuthService } from './utils/auth';
import { SchoolSettingsService } from './utils/schoolSettings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Initialiser l'admin par défaut
      AuthService.initializeDefaultAdmin();
      
      // Initialiser les paramètres de l'école
      SchoolSettingsService.initializeSettings();
      
      // Vérifier l'authentification
      setIsAuthenticated(AuthService.isAuthenticated());
    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err);
      setError('Erreur lors du chargement de l\'application');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderModule = () => {
    try {
      switch (currentModule) {
        case 'dashboard':
          return <Dashboard />;
        case 'settings':
          return <SchoolSettings />;
        case 'students':
          return <StudentManagement />;
        case 'classes':
          return <ClassManagement />;
        case 'subjects':
          return <SubjectManagement />;
        case 'grades':
          return <GradeManagement />;
        case 'fees':
          return <FeeManagement />;
        case 'reports':
          return <ReportManagement />;
        case 'users':
          return <UserManagement />;
        default:
          return <Dashboard />;
      }
    } catch (err) {
      console.error('Erreur lors du rendu du module:', err);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Erreur de chargement</div>
            <p className="text-gray-600 mb-4">Une erreur s'est produite lors du chargement du module.</p>
            <button
              onClick={() => setCurrentModule('dashboard')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      );
    }
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
          <p className="text-gray-600">Initialisation du système de gestion scolaire</p>
        </div>
      </div>
    );
  }

  // Écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur d'initialisation</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Recharger l'application
          </button>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentModule={currentModule}
      onModuleChange={setCurrentModule}
    >
      {renderModule()}
    </Layout>
  );
}

export default App;