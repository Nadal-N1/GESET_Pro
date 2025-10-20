import type {
  User,
  Teacher,
  Student,
  Class,
  Subject,
  Grade,
  Fee,
  Payment,
  SchoolSettings
} from '../types';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validator {
  static validateRequired(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`Le champ ${fieldName} est obligatoire`, fieldName);
    }
  }

  static validateEmail(email: string, required = false): void {
    if (!required && (!email || email.trim() === '')) {
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Format d\'email invalide', 'email');
    }
  }

  static validatePhone(phone: string, fieldName = 'telephone'): void {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (phone && !phoneRegex.test(phone)) {
      throw new ValidationError('Format de téléphone invalide', fieldName);
    }
  }

  static validateDate(date: Date | string, fieldName = 'date'): void {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError('Date invalide', fieldName);
    }
  }

  static validateNumber(value: number, min?: number, max?: number, fieldName = 'valeur'): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError('Valeur numérique invalide', fieldName);
    }
    if (min !== undefined && value < min) {
      throw new ValidationError(`${fieldName} doit être supérieur ou égal à ${min}`, fieldName);
    }
    if (max !== undefined && value > max) {
      throw new ValidationError(`${fieldName} doit être inférieur ou égal à ${max}`, fieldName);
    }
  }

  static validateUser(user: Partial<User>): void {
    this.validateRequired(user.username, 'nom d\'utilisateur');
    this.validateRequired(user.password, 'mot de passe');
    this.validateRequired(user.role, 'rôle');
    this.validateRequired(user.nom, 'nom');
    this.validateRequired(user.prenom, 'prénom');

    if (user.email) {
      this.validateEmail(user.email);
    }
    if (user.telephone) {
      this.validatePhone(user.telephone);
    }

    if (user.password && user.password.length < 6) {
      throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères', 'password');
    }

    const validRoles = ['administrateur', 'secretaire', 'comptable', 'enseignant', 'directeur'];
    if (user.role && !validRoles.includes(user.role)) {
      throw new ValidationError('Rôle invalide', 'role');
    }
  }

  static validateTeacher(teacher: Partial<Teacher>): void {
    this.validateRequired(teacher.matricule, 'matricule');
    this.validateRequired(teacher.nom, 'nom');
    this.validateRequired(teacher.prenom, 'prénom');
    this.validateRequired(teacher.dateNaissance, 'date de naissance');
    this.validateRequired(teacher.lieuNaissance, 'lieu de naissance');
    this.validateRequired(teacher.sexe, 'sexe');
    this.validateRequired(teacher.adresse, 'adresse');
    this.validateRequired(teacher.telephone, 'téléphone');
    this.validateRequired(teacher.diplome, 'diplôme');
    this.validateRequired(teacher.specialite, 'spécialité');
    this.validateRequired(teacher.personneUrgence, 'personne à contacter en urgence');
    this.validateRequired(teacher.telephoneUrgence, 'téléphone d\'urgence');

    if (teacher.dateNaissance) {
      this.validateDate(teacher.dateNaissance, 'date de naissance');
    }

    if (teacher.sexe && !['M', 'F'].includes(teacher.sexe)) {
      throw new ValidationError('Le sexe doit être M ou F', 'sexe');
    }

    if (teacher.telephone) {
      this.validatePhone(teacher.telephone, 'téléphone');
    }

    if (teacher.telephoneUrgence) {
      this.validatePhone(teacher.telephoneUrgence, 'téléphone d\'urgence');
    }

    if (teacher.email) {
      this.validateEmail(teacher.email);
    }

    const validStatuts = ['actif', 'conge', 'suspendu', 'demissionnaire'];
    if (teacher.statut && !validStatuts.includes(teacher.statut)) {
      throw new ValidationError('Statut invalide', 'statut');
    }
  }

  static validateStudent(student: Partial<Student>): void {
    this.validateRequired(student.matricule, 'matricule');
    this.validateRequired(student.nom, 'nom');
    this.validateRequired(student.prenom, 'prénom');
    this.validateRequired(student.dateNaissance, 'date de naissance');
    this.validateRequired(student.lieuNaissance, 'lieu de naissance');
    this.validateRequired(student.sexe, 'sexe');
    this.validateRequired(student.adresse, 'adresse');
    this.validateRequired(student.nomTuteur, 'nom du tuteur');
    this.validateRequired(student.telephoneTuteur, 'téléphone du tuteur');
    this.validateRequired(student.classeId, 'classe');

    if (student.dateNaissance) {
      this.validateDate(student.dateNaissance, 'date de naissance');
    }

    if (student.sexe && !['M', 'F'].includes(student.sexe)) {
      throw new ValidationError('Le sexe doit être M ou F', 'sexe');
    }

    if (student.telephoneTuteur) {
      this.validatePhone(student.telephoneTuteur, 'téléphone du tuteur');
    }

    if (student.emailTuteur) {
      this.validateEmail(student.emailTuteur);
    }

    const validStatuts = ['actif', 'inactif', 'transfere', 'abandonne'];
    if (student.statut && !validStatuts.includes(student.statut)) {
      throw new ValidationError('Statut invalide', 'statut');
    }
  }

  static validateClass(classe: Partial<Class>): void {
    this.validateRequired(classe.nom, 'nom de la classe');
    this.validateRequired(classe.niveauType, 'type de niveau');
    this.validateRequired(classe.niveau, 'niveau');
    this.validateRequired(classe.anneeScolaire, 'année scolaire');

    const validNiveauxTypes = ['MATERNELLE', 'PRIMAIRE', 'SECONDAIRE'];
    if (classe.niveauType && !validNiveauxTypes.includes(classe.niveauType)) {
      throw new ValidationError('Type de niveau invalide', 'niveauType');
    }

    if (classe.effectifMax !== undefined) {
      this.validateNumber(classe.effectifMax, 1, 100, 'effectif maximum');
    }
  }

  static validateSubject(subject: Partial<Subject>): void {
    this.validateRequired(subject.nom, 'nom de la matière');
    this.validateRequired(subject.coefficient, 'coefficient');

    if (subject.coefficient !== undefined) {
      this.validateNumber(subject.coefficient, 0.5, 10, 'coefficient');
    }

    if (subject.niveauxType && (!Array.isArray(subject.niveauxType) || subject.niveauxType.length === 0)) {
      throw new ValidationError('Au moins un type de niveau doit être sélectionné', 'niveauxType');
    }

    if (subject.niveaux && (!Array.isArray(subject.niveaux) || subject.niveaux.length === 0)) {
      throw new ValidationError('Au moins un niveau doit être sélectionné', 'niveaux');
    }
  }

  static validateGrade(grade: Partial<Grade>): void {
    this.validateRequired(grade.eleveId, 'élève');
    this.validateRequired(grade.matiereId, 'matière');
    this.validateRequired(grade.classeId, 'classe');
    this.validateRequired(grade.typeEvaluation, 'type d\'évaluation');
    this.validateRequired(grade.note, 'note');
    this.validateRequired(grade.noteMax, 'note maximale');
    this.validateRequired(grade.trimestre, 'trimestre');
    this.validateRequired(grade.anneeScolaire, 'année scolaire');

    if (grade.note !== undefined && grade.noteMax !== undefined) {
      this.validateNumber(grade.note, 0, grade.noteMax, 'note');
      this.validateNumber(grade.noteMax, 1, undefined, 'note maximale');
    }

    if (grade.trimestre && ![1, 2, 3].includes(grade.trimestre)) {
      throw new ValidationError('Le trimestre doit être 1, 2 ou 3', 'trimestre');
    }

    const validTypes = ['devoir', 'composition', 'oral'];
    if (grade.typeEvaluation && !validTypes.includes(grade.typeEvaluation)) {
      throw new ValidationError('Type d\'évaluation invalide', 'typeEvaluation');
    }

    if (grade.date) {
      this.validateDate(grade.date, 'date');
    }
  }

  static validateFee(fee: Partial<Fee>): void {
    this.validateRequired(fee.nom, 'nom du frais');
    this.validateRequired(fee.montant, 'montant');
    this.validateRequired(fee.type, 'type de frais');

    if (fee.montant !== undefined) {
      this.validateNumber(fee.montant, 0, undefined, 'montant');
    }

    const validTypes = ['inscription', 'scolarite', 'cantine', 'transport', 'fournitures', 'autre'];
    if (fee.type && !validTypes.includes(fee.type)) {
      throw new ValidationError('Type de frais invalide', 'type');
    }

    if (fee.classeIds && (!Array.isArray(fee.classeIds) || fee.classeIds.length === 0)) {
      throw new ValidationError('Au moins une classe doit être sélectionnée', 'classeIds');
    }
  }

  static validatePayment(payment: Partial<Payment>): void {
    this.validateRequired(payment.eleveId, 'élève');
    this.validateRequired(payment.fraisId, 'type de frais');
    this.validateRequired(payment.montant, 'montant');
    this.validateRequired(payment.datePaiement, 'date de paiement');
    this.validateRequired(payment.modePaiement, 'mode de paiement');
    this.validateRequired(payment.numeroRecu, 'numéro de reçu');

    if (payment.montant !== undefined) {
      this.validateNumber(payment.montant, 0, undefined, 'montant');
    }

    if (payment.datePaiement) {
      this.validateDate(payment.datePaiement, 'date de paiement');
    }

    const validModes = ['especes', 'cheque', 'virement'];
    if (payment.modePaiement && !validModes.includes(payment.modePaiement)) {
      throw new ValidationError('Mode de paiement invalide', 'modePaiement');
    }
  }

  static validateSchoolSettings(settings: Partial<SchoolSettings>): void {
    this.validateRequired(settings.nomEtablissement, 'nom de l\'établissement');
    this.validateRequired(settings.typeEtablissement, 'type d\'établissement');
    this.validateRequired(settings.ville, 'ville');
    this.validateRequired(settings.region, 'région');
    this.validateRequired(settings.anneeScolaireActuelle, 'année scolaire');
    this.validateRequired(settings.trimestreActuel, 'trimestre actuel');

    if (settings.email) {
      this.validateEmail(settings.email);
    }

    if (settings.telephone) {
      this.validatePhone(settings.telephone);
    }

    if (settings.trimestreActuel && ![1, 2, 3].includes(settings.trimestreActuel)) {
      throw new ValidationError('Le trimestre doit être 1, 2 ou 3', 'trimestreActuel');
    }

    const validTypes = ['primaire', 'secondaire', 'primaire_secondaire'];
    if (settings.typeEtablissement && !validTypes.includes(settings.typeEtablissement)) {
      throw new ValidationError('Type d\'établissement invalide', 'typeEtablissement');
    }
  }
}
