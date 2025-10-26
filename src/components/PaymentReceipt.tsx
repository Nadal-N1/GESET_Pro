import React from 'react';
import { X, Printer } from 'lucide-react';
import { Payment, Student, Fee, User } from '../types';
import { SchoolSettingsService } from '../utils/schoolSettings';

interface PaymentReceiptProps {
  payment: Payment;
  student: Student;
  fee: Fee;
  user: User;
  onClose: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  student,
  fee,
  user,
  onClose,
}) => {
  const schoolSettings = SchoolSettingsService.getSettings();

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR');
  };

  const ReceiptContent = () => (
    <div className="p-8">
          {/* En-tête de l'établissement */}
          <div className="mb-8 border-b-2 border-gray-300 pb-6">
            <div className="flex items-start justify-between">
              {/* Logo */}
              {schoolSettings.logo && (
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={schoolSettings.logo}
                    alt="Logo"
                    className="h-20 w-20 object-contain"
                  />
                </div>
              )}

              {/* Informations de l'établissement */}
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {schoolSettings.nomEtablissement}
                </h1>
                <p className="text-sm text-gray-600">{schoolSettings.adresse}</p>
                <p className="text-sm text-gray-600">
                  {schoolSettings.ville}, {schoolSettings.region}
                </p>
                <p className="text-sm text-gray-600">
                  Tél: {schoolSettings.telephone}
                  {schoolSettings.email && ` | Email: ${schoolSettings.email}`}
                </p>
                {schoolSettings.numeroAutorisation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Autorisation N° {schoolSettings.numeroAutorisation}
                  </p>
                )}
              </div>

              {/* Espace vide pour équilibrer */}
              {schoolSettings.logo && (
                <div className="flex-shrink-0 ml-4 w-20"></div>
              )}
            </div>
          </div>

          {/* Titre du document */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              Reçu de Paiement
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              N° {payment.numeroRecu}
            </p>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Informations Élève
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Nom complet:</span>
                  <p className="text-gray-900 font-semibold">
                    {student.nom} {student.prenom}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Matricule:</span>
                  <p className="text-gray-900">{student.matricule}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Informations Paiement
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Date:</span>
                  <p className="text-gray-900">{formatDate(payment.datePaiement)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Mode de paiement:</span>
                  <p className="text-gray-900 capitalize">{payment.modePaiement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails du paiement */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase">
                    Désignation
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{fee.nom}</p>
                      <p className="text-sm text-gray-500 capitalize">Type: {fee.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatAmount(payment.montant)} FCFA
                    </p>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 text-right">
                    <p className="text-lg font-bold text-gray-900">TOTAL PAYÉ:</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatAmount(payment.montant)} FCFA
                    </p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Montant en lettres */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Arrêté le présent reçu à la somme de:</p>
            <p className="text-base font-semibold text-gray-900 uppercase">
              {numberToWords(payment.montant)} Francs CFA
            </p>
          </div>

          {/* Signature du Caissier */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="max-w-sm">
              <p className="text-sm font-semibold text-gray-700 mb-16">Signature du Caissier</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-600">
                  {user.nom} {user.prenom}
                </p>
                <p className="text-xs text-gray-500">{formatDate(payment.datePaiement)}</p>
              </div>
            </div>
          </div>

          {/* Note de bas de page */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 italic">
              Ce reçu est valable et ne peut être remboursé. Merci de le conserver précieusement.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Année scolaire: {schoolSettings.anneeScolaireActuelle}
            </p>
          </div>
        </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec boutons d'action - Non imprimable */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Reçu de paiement (2 exemplaires)</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimer 2 exemplaires</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Premier exemplaire */}
        <ReceiptContent />

        {/* Séparateur visible à l'écran uniquement */}
        <div className="border-t-4 border-dashed border-gray-300 my-4 print:hidden"></div>

        {/* Deuxième exemplaire */}
        <ReceiptContent />
      </div>
    </div>
  );
};

// Fonction pour convertir un nombre en lettres (simplifié)
function numberToWords(num: number): string {
  if (num === 0) return 'Zéro';

  const units = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
  const teens = ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'];
  const tens = ['', 'Dix', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingt', 'Quatre-vingt-dix'];

  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    if (ten === 7 || ten === 9) {
      return tens[ten - 1] + (unit > 0 ? '-' + (ten === 7 ? teens[unit] : teens[unit]) : '');
    }
    return tens[ten] + (unit > 0 ? '-' + units[unit] : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return (hundred > 1 ? units[hundred] + ' ' : '') + 'Cent' + (rest > 0 ? ' ' + numberToWords(rest) : '');
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    return (thousand > 1 ? numberToWords(thousand) + ' ' : '') + 'Mille' + (rest > 0 ? ' ' + numberToWords(rest) : '');
  }

  const million = Math.floor(num / 1000000);
  const rest = num % 1000000;
  return numberToWords(million) + ' Million' + (million > 1 ? 's' : '') + (rest > 0 ? ' ' + numberToWords(rest) : '');
}
