import React from 'react';
import { User, LogOut, Users, GraduationCap, BookOpen, Calculator, FileText, Settings, School } from 'lucide-react';
import { AuthService } from '../utils/auth';
import { SchoolSettingsService } from '../utils/schoolSettings';

interface LayoutProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, children }) => {
  const user = AuthService.getCurrentUser();
  const schoolSettings = SchoolSettingsService.getSettings();
  
  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  const modules = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: Settings, roles: ['administrateur', 'directeur', 'secretaire'] },
    { id: 'settings', name: 'Configuration', icon: School, roles: ['administrateur', 'directeur'] },
    { id: 'students', name: 'Élèves', icon: Users, roles: ['administrateur', 'directeur', 'secretaire'] },
    { id: 'classes', name: 'Classes', icon: GraduationCap, roles: ['administrateur', 'directeur', 'secretaire'] },
    { id: 'subjects', name: 'Matières', icon: BookOpen, roles: ['administrateur', 'directeur', 'enseignant'] },
    { id: 'grades', name: 'Notes', icon: FileText, roles: ['administrateur', 'directeur', 'enseignant', 'secretaire'] },
    { id: 'fees', name: 'Frais & Paiements', icon: Calculator, roles: ['administrateur', 'directeur', 'comptable', 'secretaire'] },
    { id: 'reports', name: 'Rapports', icon: FileText, roles: ['administrateur', 'directeur', 'secretaire'] },
    { id: 'users', name: 'Utilisateurs', icon: User, roles: ['administrateur'] },
  ];

  const availableModules = modules.filter(module => 
    module.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {schoolSettings.logo ? (
                <img src={schoolSettings.logo} alt="Logo" className="h-8 w-8 object-contain" />
              ) : (
                <GraduationCap className="h-8 w-8 text-white" />
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{schoolSettings.nomEtablissement}</h1>
                <p className="text-sm text-white/90">{schoolSettings.ville} - {schoolSettings.region}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="text-sm font-medium">{user?.prenom} {user?.nom}</p>
                <p className="text-xs text-white/80 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <ul className="space-y-2">
              {availableModules.map((module) => {
                const Icon = module.icon;
                const isActive = currentModule === module.id;
                
                return (
                  <li key={module.id}>
                    <button
                      onClick={() => onModuleChange(module.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{module.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};