import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Receipt, CreditCard } from 'lucide-react';
import { Fee, Payment, Student, Class } from '../types';
import { LocalStorage, Generators } from '../utils/storage';
import { AuthService } from '../utils/auth';

export const FeeManagement: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeTab, setActiveTab] = useState<'fees' | 'payments'>('fees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

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
    resetPaymentForm();
  };

  const deleteFee = (id: string) => {
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

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || fee.classeIds.includes(selectedClass);
    return matchesSearch && matchesClass;
  });

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.eleveId);
    const matchesSearch = student ? 
      `${student.prenom} ${student.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.numeroRecu.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesClass = selectedClass === '' || (student && student.classeId === selectedClass);
    return matchesSearch && matchesClass;
  });

  const availableStudents = students.filter(s => selectedClass === '' || s.classeId === selectedClass);
  const availableFees = fees.filter(f => selectedClass === '' || f.classeIds.includes(selectedClass));

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
                  placeholder="Ex: Frais de scolarité, Cantine..."
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
                  <label key={classe.id} className="flex items-center space-x-2">
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetFeeForm}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
                      {student.prenom} {student.nom} - {getClassName(student.classeId)}
                    </option>
                  ))}
                </select>
              </div>

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
                  Montant (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentFormData.montant}
                  onChange={(e) => setPaymentFormData({...paymentFormData, montant: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
                <input
                  type="date"
                  value={paymentFormData.datePaiement ? new Date(paymentFormData.datePaiement).toISOString().split('T')[0] : ''}
                  onChange={(e) => setPaymentFormData({...paymentFormData, datePaiement: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetPaymentForm}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingPayment ? 'Modifier' : 'Enregistrer'}
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
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Frais</span>
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Paiement</span>
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'fees'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Frais</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'payments'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>Paiements</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Filtres */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'fees' ? 'Rechercher un frais...' : 'Rechercher un paiement...'}
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
            <div className="text-sm text-gray-600 flex items-center">
              Total: {activeTab === 'fees' ? filteredFees.length : filteredPayments.length} {activeTab === 'fees' ? 'frais' : 'paiement'}
              {(activeTab === 'fees' ? filteredFees.length : filteredPayments.length) > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'fees' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFees.map((fee) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{fee.nom}</h3>
                      <p className="text-2xl font-bold text-green-600">{fee.montant.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editFee(fee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteFee(fee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{fee.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Obligatoire:</span>
                      <span className={fee.obligatoire ? 'text-red-600' : 'text-gray-600'}>
                        {fee.obligatoire ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600 text-xs">Classes concernées:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fee.classeIds.slice(0, 3).map(classId => (
                          <span key={classId} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            {getClassName(classId)}
                          </span>
                        ))}
                        {fee.classeIds.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            +{fee.classeIds.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getStudentName(payment.eleveId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getFeeName(payment.fraisId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
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
                          {payment.modePaiement}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.numeroRecu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editPayment(payment)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deletePayment(payment.id)}
                            className="text-red-600 hover:text-red-900"
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

          {((activeTab === 'fees' && filteredFees.length === 0) || 
            (activeTab === 'payments' && filteredPayments.length === 0)) && (
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
                {searchTerm || selectedClass ? 
                  `Aucun${activeTab === 'fees' ? ' frais' : ' paiement'} ne correspond aux critères de recherche.` : 
                  `Commencez par ajouter ${activeTab === 'fees' ? 'des frais' : 'des paiements'}.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};