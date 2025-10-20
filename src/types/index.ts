export interface User {
  id: string;
  username: string;
  password: string;
  role: 'administrateur' | 'secretaire' | 'comptable' | 'enseignant' | 'directeur';
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Teacher {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  lieuNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  telephone: string;
  email?: string;
  diplome: string;
  specialite: string;
  niveauxType: NiveauType[];
  matieres: string[];
  dateRecrutement: Date;
  situationMatrimoniale: 'celibataire' | 'marie' | 'divorce' | 'veuf';
  nombreEnfants?: number;
  personneUrgence: string;
  telephoneUrgence: string;
  statut: 'actif' | 'conge' | 'suspendu' | 'demissionnaire';
  photo?: string;
  userId?: string;
}

export interface Student {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  lieuNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  nomTuteur: string;
  telephoneTuteur: string;
  emailTuteur?: string;
  classeId: string;
  photo?: string;
  situationScolaire: string;
  antecedents?: string;
  inscriptionDate: Date;
  statut: 'actif' | 'inactif' | 'transfere' | 'abandonne';
}

export type NiveauType = 'MATERNELLE' | 'PRIMAIRE' | 'SECONDAIRE';

export type ClasseMaternelle = 'Petite Section' | 'Moyenne Section' | 'Grande Section';
export type ClassePrimaire = 'CP1' | 'CP2' | 'CE1' | 'CE2' | 'CM1' | 'CM2';
export type ClasseSecondaire = '6e' | '5e' | '4e' | '3e' | '2de' | '1re' | 'Tle';

export type ClasseNiveau = ClasseMaternelle | ClassePrimaire | ClasseSecondaire;

export interface Class {
  id: string;
  nom: string;
  niveauType: NiveauType;
  niveau: ClasseNiveau;
  section?: string;
  filiere?: string;
  serie?: string;
  enseignantPrincipalId?: string;
  effectifMax: number;
  anneeScolaire: string;
}

export interface Subject {
  id: string;
  nom: string;
  coefficient: number;
  niveauxType: NiveauType[];
  niveaux: ClasseNiveau[];
  enseignantId?: string;
}

export interface Grade {
  id: string;
  eleveId: string;
  matiereId: string;
  classeId: string;
  typeEvaluation: 'devoir' | 'composition' | 'oral';
  note: number;
  noteMax: number;
  trimestre: 1 | 2 | 3;
  anneeScolaire: string;
  date: Date;
}

export interface Fee {
  id: string;
  nom: string;
  montant: number;
  type: 'inscription' | 'scolarite' | 'cantine' | 'transport' | 'fournitures' | 'autre';
  obligatoire: boolean;
  classeIds: string[];
}

export interface Payment {
  id: string;
  eleveId: string;
  fraisId: string;
  montant: number;
  datePaiement: Date;
  modePaiement: 'especes' | 'cheque' | 'virement';
  numeroRecu: string;
  utilisateurId: string;
}

export interface SchoolYear {
  id: string;
  annee: string;
  dateDebut: Date;
  dateFin: Date;
  trimestreActuel: 1 | 2 | 3;
  active: boolean;
}

export interface SchoolSettings {
  id: string;
  nomEtablissement: string;
  typeEtablissement: 'primaire' | 'secondaire' | 'primaire_secondaire';
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email?: string;
  siteWeb?: string;
  numeroAutorisation: string;
  dateCreation: Date;
  directeur: string;
  devise?: string;
  logo?: string;
  anneeScolaireActuelle: string;
  trimestreActuel: 1 | 2 | 3;
  couleurPrimaire: string;
  couleurSecondaire: string;
  updatedAt: Date;
}