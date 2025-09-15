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

export interface Class {
  id: string;
  nom: string;
  niveau: string;
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
  niveaux: string[];
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