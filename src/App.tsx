import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { AuthService } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentModule, setCurrentModule] = useState('dashboard');

  useEffect(() => {
    // Initialiser l'admin par défaut
    AuthService.initializeDefaultAdmin();
    
    // Vérifier l'authentification
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement />;
      case 'classes':
        return <div className="text-center py-12 text-gray-500">Module Classes - En développement</div>;
      case 'subjects':
        return <div className="text-center py-12 text-gray-500">Module Matières - En développement</div>;
      case 'grades':
        return <div className="text-center py-12 text-gray-500">Module Notes - En développement</div>;
      case 'fees':
        return <div className="text-center py-12 text-gray-500">Module Frais & Paiements - En développement</div>;
      case 'reports':
        return <div className="text-center py-12 text-gray-500">Module Rapports - En développement</div>;
      case 'users':
        return <div className="text-center py-12 text-gray-500">Module Utilisateurs - En développement</div>;
      default:
        return <Dashboard />;
    }
  };

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