import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Receipt, CreditCard, Eye, Download, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Fee, Payment, Student, Class, User } from '../types';
import { LocalStorage, Generators } from '../utils/storage';
import { AuthService } from '../utils/auth';
import { PaymentReceipt } from './PaymentReceipt';

export const FeeManagement: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeTab, setActiveTab] = useState<'fees' | 'payments' | 'analytics'>('fees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  const [feeFormData, setFeeFormData] = useState<Partial<Fee>>({
    nom: '',
    montant: 0,
    type: 'scolarite',
    obligatoire: true,
    classeIds: []
  });

  const [paymentFormData, setPaymentFormData] = useState<Partial<Payment>>({
    eleveId: '',
    fraisId: '',
    montant: 0,
    datePaiement: new Date(),
    modePaiement: 'especes',
    numeroRecu: '',
    utilisateurId: AuthService.getCurrentUser()?.id || ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedFees = LocalStorage.get<Fee[]>('fees') || [];
    const storedPayments = LocalStorage.get<Payment[]>('payments') || [];
    const storedStudents = LocalStorage.get<Student[]>('students') || [];
    const storedClasses = LocalStorage.get<Class[]>('classes') || [];

    setFees(storedFees);
    setPayments(storedPayments);
    setStudents(storedStudents);
    setClasses(storedClasses);
  };

  const saveFee = () => {
    if (!feeFormData.nom || !feeFormData.montant || feeFormData.classeIds?.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const feeData: Fee = {
      id: editingFee?.id || Generators.generateId(),
      ...feeFormData as Fee
    };

    let updatedFees;
    if (editingFee) {
      updatedFees = fees.map(f => f.id === editingFee.id ? feeData : f);
    } else {
      updatedFees = [...fees, feeData];
    }

    setFees(updatedFees);
    LocalStorage.set('fees', updatedFees);
    resetFeeForm();
  };

  const savePayment = () => {
    if (!paymentFormData.eleveId || !paymentFormData.fraisId || !paymentFormData.montant) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const paymentData: Payment = {
      id: editingPayment?.id || Generators.generateId(),
      numeroRecu: editingPayment?.numeroRecu || Generators.generateReceiptNumber(),
      ...paymentFormData as Payment
    };

    let updatedPayments;
    if (editingPayment) {
      updatedPayments = payments.map(p => p.id === editingPayment.id ? paymentData : p);
    } else {
      updatedPayments = [...payments, paymentData];
    }

    setPayments(updatedPayments);
    LocalStorage.set('payments', updatedPayments);

    // Afficher le reçu après la création du paiement
    if (!editingPayment) {
      setViewingReceipt(paymentData);
    }

    resetPaymentForm();
  };

  const deleteFee = (id: string) => {
    const relatedPayments = payments.filter(p => p.fraisId === id);
    if (relatedPayments.length > 0) {
      alert('Impossible de supprimer ce frais car des paiements y sont associés.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) {
      const updatedFees = fees.filter(f => f.id !== id);
      setFees(updatedFees);
      LocalStorage.set('fees', updatedFees);
    }
  };

  const deletePayment = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      const updatedPayments = payments.filter(p => p.id !== id);
      setPayments(updatedPayments);
      LocalStorage.set('payments', updatedPayments);
    }
  };

  const resetFeeForm = () => {
    setFeeFormData({
      nom: '',
      montant: 0,
      type: 'scolarite',
      obligatoire: true,
      classeIds: []
    });
    setEditingFee(null);
    setShowFeeForm(false);
  };

  const resetPaymentForm = () => {
    setPaymentFormData({
      eleveId: '',
      fraisId: '',
      montant: 0,
      datePaiement: new Date(),
      modePaiement: 'especes',
      numeroRecu: '',
      utilisateurId: AuthService.getCurrentUser()?.id || ''
    });
    setEditingPayment(null);
    setShowPaymentForm(false);
  };

  const editFee = (fee: Fee) => {
    setFeeFormData(fee);
    setEditingFee(fee);
    setShowFeeForm(true);
  };

  const editPayment = (payment: Payment) => {
    setPaymentFormData(payment);
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const handleClassSelection = (classId: string, checked: boolean) => {
    const currentClasses = feeFormData.classeIds || [];
    if (checked) {
      setFeeFormData({...feeFormData, classeIds: [...currentClasses, classId]});
    } else {
      setFeeFormData({...feeFormData, classeIds: currentClasses.filter(id => id !== classId)});
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Non trouvé';
  };

  const getFeeName = (feeId: string) => {
    const fee = fees.find(f => f.id === feeId);
    return fee ? fee.nom : 'Non trouvé';
  };

  const getClassName = (classId: string) => {
    const classe = classes.find(c => c.id === classId);
    return classe ? classe.nom : 'Non trouvé';
  };

  const getStudentPayments = (studentId: string) => {
    return payments.filter(p => p.eleveId === studentId);
  };

  const getStudentTotalPaid = (studentId: string) => {
    return getStudentPayments(studentId).reduce((sum, p) => sum + p.montant, 0);
  };

  const getStudentExpectedTotal = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;

    return fees
      .filter(f => f.classeIds.includes(student.classeId))
      .reduce((sum, f) => sum + f.montant, 0);
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || fee.classeIds.includes(selectedClass);
    const matchesType = selectedFeeType === '' || fee.type === selectedFeeType;
    return matchesSearch && matchesClass && matchesType;
  });

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.eleveId);
    const matchesSearch = student ?
      `${student.prenom} ${student.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.numeroRecu.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesClass = selectedClass === '' || (student && student.classeId === selectedClass);
    const matchesMode = selectedPaymentMode === '' || payment.modePaiement === selectedPaymentMode;
    return matchesSearch && matchesClass && matchesMode;
  });

  const availableStudents = students.filter(s => selectedClass === '' || s.classeId === selectedClass);
  const availableFees = fees.filter(f => {
    if (!paymentFormData.eleveId) return false;
    const student = students.find(s => s.id === paymentFormData.eleveId);
    if (!student) return false;
    return f.classeIds.includes(student.classeId);
  });

  // Calculs statistiques
  const totalFeesAmount = fees.reduce((sum, f) => sum + f.montant, 0);
  const totalPaymentsAmount = payments.reduce((sum, p) => sum + p.montant, 0);
  const paymentsThisMonth = payments.filter(p => {
    const date = new Date(p.datePaiement);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).reduce((sum, p) => sum + p.montant, 0);

  const paymentsByMode = {
    especes: payments.filter(p => p.modePaiement === 'especes').reduce((sum, p) => sum + p.montant, 0),
    cheque: payments.filter(p => p.modePaiement === 'cheque').reduce((sum, p) => sum + p.montant, 0),
    virement: payments.filter(p => p.modePaiement === 'virement').reduce((sum, p) => sum + p.montant, 0),
  };

  if (showFeeForm) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingFee ? 'Modifier le Frais' : 'Nouveau Frais'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); saveFee(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du frais <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={feeFormData.nom}
                  onChange={(e) => setFeeFormData({...feeFormData, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Frais de scolarité du 1er trimestre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={feeFormData.montant}
                  onChange={(e) => setFeeFormData({...feeFormData, montant: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
                <select
                  value={feeFormData.type}
                  onChange={(e) => setFeeFormData({...feeFormData, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="inscription">Inscription</option>
                  <option value="scolarite">Scolarité</option>
                  <option value="cantine">Cantine</option>
                  <option value="transport">Transport</option>
                  <option value="fournitures">Fournitures</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="obligatoire"
                  checked={feeFormData.obligatoire}
                  onChange={(e) => setFeeFormData({...feeFormData, obligatoire: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="obligatoire" className="ml-2 text-sm text-gray-700">
                  Frais obligatoire
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Classes concernées <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {classes.map(classe => (
                  <label key={classe.id} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feeFormData.classeIds?.includes(classe.id) || false}
                      onChange={(e) => handleClassSelection(classe.id, e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{classe.nom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetFeeForm}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {editingFee ? 'Modifier' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    const selectedStudent = students.find(s => s.id === paymentFormData.eleveId);
    const selectedFee = fees.find(f => f.id === paymentFormData.fraisId);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingPayment ? 'Modifier le Paiement' : 'Nouveau Paiement'}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); savePayment(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                >
                  <option value="">Toutes les classes</option>
                  {classes.map(classe => (
                    <option key={classe.id} value={classe.id}>{classe.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentFormData.eleveId}
                  onChange={(e) => setPaymentFormData({...paymentFormData, eleveId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.prenom} {student.nom} - {getClassName(student.classeId)} ({student.matricule})
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudent && (
                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Situation de paiement de l'élève</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Total attendu:</span>
                      <p className="font-semibold">{getStudentExpectedTotal(selectedStudent.id).toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <span className="text-green-600">Déjà payé:</span>
                      <p className="font-semibold">{getStudentTotalPaid(selectedStudent.id).toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <span className="text-orange-600">Reste à payer:</span>
                      <p className="font-semibold">
                        {(getStudentExpectedTotal(selectedStudent.id) - getStudentTotalPaid(selectedStudent.id)).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frais <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentFormData.fraisId}
                  onChange={(e) => {
                    const selectedFee = fees.find(f => f.id === e.target.value);
                    setPaymentFormData({
                      ...paymentFormData,
                      fraisId: e.target.value,
                      montant: selectedFee?.montant || 0
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={!paymentFormData.eleveId}
                >
                  <option value="">Sélectionner un frais</option>
                  {availableFees.map(fee => (
                    <option key={fee.id} value={fee.id}>
                      {fee.nom} - {fee.montant.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant payé (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentFormData.montant}
                  onChange={(e) => setPaymentFormData({...paymentFormData, montant: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="100"
                  required
                />
                {selectedFee && paymentFormData.montant !== selectedFee.montant && (
                  <p className="text-sm text-orange-600 mt-1">
                    Montant différent du montant attendu ({selectedFee.montant.toLocaleString()} FCFA)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={paymentFormData.datePaiement ? new Date(paymentFormData.datePaiement).toISOString().split('T')[0] : ''}
                  onChange={(e) => setPaymentFormData({...paymentFormData, datePaiement: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                <select
                  value={paymentFormData.modePaiement}
                  onChange={(e) => setPaymentFormData({...paymentFormData, modePaiement: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="especes">Espèces</option>
                  <option value="cheque">Chèque</option>
                  <option value="virement">Virement</option>
                </select>
              </div>

              {editingPayment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de reçu</label>
                  <input
                    type="text"
                    value={paymentFormData.numeroRecu}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetPaymentForm}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {editingPayment ? 'Modifier' : 'Enregistrer et Imprimer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Frais et Paiements</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFeeForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Frais</span>
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Paiement</span>
          </button>
        </div>
      </div>

      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Frais Configurés</p>
              <p className="text-3xl font-bold mt-1">{totalFeesAmount.toLocaleString()}</p>
              <p className="text-xs text-blue-100 mt-1">FCFA</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Encaissé</p>
              <p className="text-3xl font-bold mt-1">{totalPaymentsAmount.toLocaleString()}</p>
              <p className="text-xs text-green-100 mt-1">FCFA</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Ce Mois</p>
              <p className="text-3xl font-bold mt-1">{paymentsThisMonth.toLocaleString()}</p>
              <p className="text-xs text-orange-100 mt-1">FCFA</p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Nombre de Paiements</p>
              <p className="text-3xl font-bold mt-1">{payments.length}</p>
              <p className="text-xs text-purple-100 mt-1">Reçus émis</p>
            </div>
            <Receipt className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'fees'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Frais ({fees.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>Paiements ({payments.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analyses</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Filtres */}
        {activeTab !== 'analytics' && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'fees' ? 'Rechercher un frais...' : 'Rechercher un paiement ou reçu...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Toutes les classes</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>{classe.nom}</option>
                ))}
              </select>

              {activeTab === 'fees' && (
                <select
                  value={selectedFeeType}
                  onChange={(e) => setSelectedFeeType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tous les types</option>
                  <option value="inscription">Inscription</option>
                  <option value="scolarite">Scolarité</option>
                  <option value="cantine">Cantine</option>
                  <option value="transport">Transport</option>
                  <option value="fournitures">Fournitures</option>
                  <option value="autre">Autre</option>
                </select>
              )}

              {activeTab === 'payments' && (
                <select
                  value={selectedPaymentMode}
                  onChange={(e) => setSelectedPaymentMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tous les modes</option>
                  <option value="especes">Espèces</option>
                  <option value="cheque">Chèque</option>
                  <option value="virement">Virement</option>
                </select>
              )}

              <div className="text-sm text-gray-600 flex items-center justify-end">
                <span className="font-medium">
                  {activeTab === 'fees' ? filteredFees.length : filteredPayments.length} résultat{(activeTab === 'fees' ? filteredFees.length : filteredPayments.length) > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'fees' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFees.map((fee) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{fee.nom}</h3>
                        {fee.obligatoire && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-green-600">{fee.montant.toLocaleString()} FCFA</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize font-medium text-gray-900">{fee.type}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-gray-600 text-xs font-medium">Classes concernées:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {fee.classeIds.slice(0, 4).map(classId => (
                          <span key={classId} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {getClassName(classId)}
                          </span>
                        ))}
                        {fee.classeIds.length > 4 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                            +{fee.classeIds.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => editFee(fee)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => deleteFee(fee.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu N°
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élève
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frais
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {payment.numeroRecu}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getStudentName(payment.eleveId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getFeeName(payment.fraisId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {payment.montant.toLocaleString()} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.datePaiement).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.modePaiement === 'especes' ? 'bg-green-100 text-green-800' :
                          payment.modePaiement === 'cheque' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {payment.modePaiement.charAt(0).toUpperCase() + payment.modePaiement.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setViewingReceipt(payment)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Voir et imprimer le reçu"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => editPayment(payment)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deletePayment(payment.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Mode de Paiement</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Espèces</span>
                        <span className="text-sm font-semibold">{paymentsByMode.especes.toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{width: `${totalPaymentsAmount ? (paymentsByMode.especes / totalPaymentsAmount * 100) : 0}%`}}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Chèque</span>
                        <span className="text-sm font-semibold">{paymentsByMode.cheque.toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{width: `${totalPaymentsAmount ? (paymentsByMode.cheque / totalPaymentsAmount * 100) : 0}%`}}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Virement</span>
                        <span className="text-sm font-semibold">{paymentsByMode.virement.toLocaleString()} FCFA</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{width: `${totalPaymentsAmount ? (paymentsByMode.virement / totalPaymentsAmount * 100) : 0}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frais par Type</h3>
                  <div className="space-y-3">
                    {['inscription', 'scolarite', 'cantine', 'transport', 'fournitures', 'autre'].map(type => {
                      const typeFees = fees.filter(f => f.type === type);
                      const count = typeFees.length;
                      if (count === 0) return null;
                      return (
                        <div key={type} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600 capitalize">{type}</span>
                          <span className="text-sm font-semibold">{count} frais</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Situation des Paiements par Classe</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Classe</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Élèves</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total Attendu</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Total Payé</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Reste</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Taux</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map(classe => {
                        const classStudents = students.filter(s => s.classeId === classe.id);
                        const classFees = fees.filter(f => f.classeIds.includes(classe.id));
                        const expectedPerStudent = classFees.reduce((sum, f) => sum + f.montant, 0);
                        const totalExpected = expectedPerStudent * classStudents.length;
                        const totalPaid = classStudents.reduce((sum, s) => sum + getStudentTotalPaid(s.id), 0);
                        const remaining = totalExpected - totalPaid;
                        const rate = totalExpected ? (totalPaid / totalExpected * 100) : 0;

                        return (
                          <tr key={classe.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{classe.nom}</td>
                            <td className="py-3 px-4 text-sm text-right">{classStudents.length}</td>
                            <td className="py-3 px-4 text-sm text-right font-semibold">{totalExpected.toLocaleString()} FCFA</td>
                            <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">{totalPaid.toLocaleString()} FCFA</td>
                            <td className="py-3 px-4 text-sm text-right text-orange-600 font-semibold">{remaining.toLocaleString()} FCFA</td>
                            <td className="py-3 px-4 text-sm text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                rate >= 80 ? 'bg-green-100 text-green-800' :
                                rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {rate.toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {((activeTab === 'fees' && filteredFees.length === 0) ||
            (activeTab === 'payments' && filteredPayments.length === 0)) && activeTab !== 'analytics' && (
            <div className="text-center py-12">
              {activeTab === 'fees' ? (
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun{activeTab === 'fees' ? ' frais' : ' paiement'} trouvé
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedClass || selectedFeeType || selectedPaymentMode ?
                  `Aucun${activeTab === 'fees' ? ' frais' : ' paiement'} ne correspond aux critères de recherche.` :
                  `Commencez par ajouter ${activeTab === 'fees' ? 'des frais' : 'des paiements'}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualisation du reçu */}
      {viewingReceipt && (() => {
        const student = students.find(s => s.id === viewingReceipt.eleveId);
        const fee = fees.find(f => f.id === viewingReceipt.fraisId);
        const user = AuthService.getCurrentUser();

        if (student && fee && user) {
          return (
            <PaymentReceipt
              payment={viewingReceipt}
              student={student}
              fee={fee}
              user={user}
              onClose={() => setViewingReceipt(null)}
            />
          );
        }
        return null;
      })()}
    </div>
  );
};
