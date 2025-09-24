import React from 'react';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Calendar, Award, AlertCircle } from 'lucide-react';
import { LocalStorage } from '../utils/storage';
import { SchoolSettingsService } from '../utils/schoolSettings';
import { Student, Class, Payment, User } from '../types';

export const Dashboard: React.FC = () => {
  const schoolSettings = SchoolSettingsService.getSettings();
  
  // Récupération des données depuis le stockage local
  const students = LocalStorage.get<Student[]>('students') || [];
  const classes = LocalStorage.get<Class[]>('classes') || [];
  const payments = LocalStorage.get<Payment[]>('payments') || [];
  const users = LocalStorage.get<User[]>('users') || [];

  // Calculs des statistiques
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.statut === 'actif').length;
  const totalClasses = classes.length;
  const totalUsers = users.length;

  const currentMonth = new Date().getMonth();
  const monthlyPayments = payments.filter(p => 
    new Date(p.datePaiement).getMonth() === currentMonth
  );
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.montant, 0);

  const currentYear = new Date().getFullYear();
  const yearlyRevenue = payments
    .filter(p => new Date(p.datePaiement).getFullYear() === currentYear)
    .reduce((sum, p) => sum + p.montant, 0);

  // Statistiques par genre
  const maleStudents = students.filter(s => s.sexe === 'M').length;
  const femaleStudents = students.filter(s => s.sexe === 'F').length;

  // Événements récents (simulation)
  const recentEvents = [
    { date: '2025-01-15', title: 'Composition du 1er trimestre', type: 'evaluation' },
    { date: '2025-01-10', title: 'Réunion conseil d\'école', type: 'meeting' },
    { date: '2025-01-08', title: 'Fin des inscriptions', type: 'deadline' },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, bgColor, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-current" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center mb-2">
          {schoolSettings.logo ? (
            <img src={schoolSettings.logo} alt="Logo" className="h-8 w-8 object-contain mr-3" />
          ) : (
            <School className="h-8 w-8 mr-3" />
          )}
          <h1 className="text-2xl font-bold">Tableau de Bord - {schoolSettings.nomEtablissement}</h1>
        </div>
        <p className="text-green-100">
          Vue d'ensemble de votre établissement scolaire - Année scolaire {schoolSettings.anneeScolaireActuelle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Élèves Actifs"
          value={activeStudents}
          icon={Users}
          color="#10B981"
          bgColor="bg-green-50"
          trend={`${totalStudents} inscrits au total`}
        />
        <StatCard
          title="Classes"
          value={totalClasses}
          icon={GraduationCap}
          color="#3B82F6"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Recettes du Mois"
          value={`${monthlyRevenue.toLocaleString()} FCFA`}
          icon={DollarSign}
          color="#F59E0B"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Utilisateurs"
          value={totalUsers}
          icon={BookOpen}
          color="#8B5CF6"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par Genre */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Répartition par Genre
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Garçons</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${totalStudents > 0 ? (maleStudents / totalStudents) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900">{maleStudents}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Filles</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${totalStudents > 0 ? (femaleStudents / totalStudents) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900">{femaleStudents}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Événements Récents */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Événements Récents
          </h3>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full mr-3 ${
                  event.type === 'evaluation' ? 'bg-orange-100' :
                  event.type === 'meeting' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {event.type === 'evaluation' ? (
                    <Award className="h-4 w-4 text-orange-600" />
                  ) : event.type === 'meeting' ? (
                    <Users className="h-4 w-4 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé Financier */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Résumé Financier - Année {currentYear}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Année</p>
            <p className="text-2xl font-bold text-green-600">{yearlyRevenue.toLocaleString()} FCFA</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Ce Mois</p>
            <p className="text-2xl font-bold text-blue-600">{monthlyRevenue.toLocaleString()} FCFA</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Paiements</p>
            <p className="text-2xl font-bold text-orange-600">{monthlyPayments.length}</p>
          </div>
        </div>
      </div>

      {/* Messages d'Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-blue-800 text-sm">
            <strong>Information :</strong> Ce logiciel fonctionne entièrement hors ligne. 
            Toutes vos données sont stockées localement sur votre ordinateur.
          </p>
        </div>
      </div>
    </div>
  );
};