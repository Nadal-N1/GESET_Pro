import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { ClassManagement } from './components/ClassManagement';
import { SubjectManagement } from './components/SubjectManagement';
import { GradeManagement } from './components/GradeManagement';
import { FeeManagement } from './components/FeeManagement';
import { ReportManagement } from './components/ReportManagement';
import { UserManagement } from './components/UserManagement';
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