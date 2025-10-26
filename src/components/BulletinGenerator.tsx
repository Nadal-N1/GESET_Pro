import { jsPDF } from 'jspdf';
import { Grade, Student, Subject, Class } from '../types';
import { SchoolSettingsService } from '../utils/schoolSettings';

export class BulletinGenerator {
  static generateSecondaireBulletin(
    student: Student,
    classInfo: Class,
    subjects: Subject[],
    grades: Grade[],
    trimester: 1 | 2 | 3,
    classStudents: Student[],
    allGrades: Grade[]
  ): jsPDF {
    const doc = new jsPDF();
    const schoolSettings = SchoolSettingsService.getSettings();

    let yPosition = 15;

    // En-tête avec logo et informations établissement
    if (schoolSettings.logo) {
      try {
        doc.addImage(schoolSettings.logo, 'PNG', 15, yPosition, 25, 25);
      } catch (e) {
        console.log('Logo non chargé');
      }
    }

    // Nom de l'établissement centré
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(schoolSettings.nomEtablissement.toUpperCase(), 105, yPosition + 5, { align: 'center' });

    // Slogan/Devise
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    if (schoolSettings.devise) {
      doc.text(schoolSettings.devise, 105, yPosition + 11, { align: 'center' });
    }

    // Adresse et contacts
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    if (schoolSettings.adresse) {
      doc.text(`${schoolSettings.adresse}`, 105, yPosition + 16, { align: 'center' });
    }
    doc.text(`${schoolSettings.ville || ''} - ${schoolSettings.region || 'BURKINA FASO'}`, 105, yPosition + 20, { align: 'center' });
    if (schoolSettings.telephone) {
      doc.text(`Tél : ${schoolSettings.telephone}`, 105, yPosition + 24, { align: 'center' });
    }

    // Localisation côté droit
    doc.setFontSize(9);
    doc.text('BURKINA FASO', 170, yPosition + 5, { align: 'center' });
    doc.text('La Patrie ou la Mort, Nous Vaincrons', 170, yPosition + 10, { align: 'center' });
    doc.text(`Année Scolaire ${schoolSettings.anneeScolaireActuelle}`, 170, yPosition + 20, { align: 'center' });

    yPosition = 48;

    // Titre du bulletin
    doc.setFillColor(240, 240, 240);
    doc.rect(50, yPosition, 110, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`BULLETIN DE NOTES DU ${trimester}er TRIMESTRE`, 105, yPosition + 5, { align: 'center' });

    yPosition = 60;

    // Informations de l'élève - Partie gauche
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom de l'élève : `, 15, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(student.nom.toUpperCase(), 50, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Prénom(s) : `, 15, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(student.prenom, 50, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`né(e) le : `, 15, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date(student.dateNaissance).toLocaleDateString('fr-FR'), 50, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`à `, 15, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(student.lieuNaissance || '', 50, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Sexe : `, 15, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(student.sexe, 50, yPosition);

    // Informations de l'élève - Partie droite
    yPosition = 60;
    doc.setFont('helvetica', 'normal');
    doc.text(`Matricule : `, 120, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(student.matricule, 145, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Classe : `, 120, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(classInfo.nom, 145, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Effectif : `, 120, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(classStudents.length.toString(), 145, yPosition);

    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Classe redoublée : `, 120, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text('Néant', 155, yPosition);

    yPosition = 90;

    // Tableau des notes
    const tableTop = yPosition;
    const colWidths = {
      discipline: 55,
      devoir: 15,
      compo: 15,
      moyenne: 18,
      coef: 10,
      pondre: 18,
      appreciation: 25,
      signature: 38
    };

    // En-tête du tableau
    doc.setFillColor(220, 220, 220);
    let xPos = 15;

    // Ligne 1 de l'en-tête
    doc.rect(xPos, yPosition, colWidths.discipline, 10, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Disciplines', xPos + 2, yPosition + 4);

    xPos += colWidths.discipline;
    doc.rect(xPos, yPosition, colWidths.devoir + colWidths.compo + colWidths.moyenne, 5, 'FD');
    doc.text('Notes', xPos + 20, yPosition + 3.5, { align: 'center' });

    // Ligne 2 de l'en-tête (Devoir, Compo, Moyenne)
    doc.rect(xPos, yPosition + 5, colWidths.devoir, 5, 'FD');
    doc.setFontSize(7);
    doc.text('Devoir', xPos + 7.5, yPosition + 8.5, { align: 'center' });

    doc.rect(xPos + colWidths.devoir, yPosition + 5, colWidths.compo, 5, 'FD');
    doc.text('Compo', xPos + colWidths.devoir + 7.5, yPosition + 8.5, { align: 'center' });

    doc.rect(xPos + colWidths.devoir + colWidths.compo, yPosition + 5, colWidths.moyenne, 5, 'FD');
    doc.text('Moyenne', xPos + colWidths.devoir + colWidths.compo + 9, yPosition + 8.5, { align: 'center' });

    xPos += colWidths.devoir + colWidths.compo + colWidths.moyenne;

    doc.rect(xPos, yPosition, colWidths.coef, 10, 'FD');
    doc.setFontSize(8);
    doc.text('Coef', xPos + 5, yPosition + 6.5, { align: 'center' });

    xPos += colWidths.coef;
    doc.rect(xPos, yPosition, colWidths.pondre, 10, 'FD');
    doc.text('Pondéré', xPos + 9, yPosition + 6.5, { align: 'center' });

    xPos += colWidths.pondre;
    doc.rect(xPos, yPosition, colWidths.appreciation, 10, 'FD');
    doc.text('Appréciation', xPos + 12.5, yPosition + 6.5, { align: 'center' });

    xPos += colWidths.appreciation;
    doc.rect(xPos, yPosition, colWidths.signature, 10, 'FD');
    doc.text('Signature du Professeur', xPos + 19, yPosition + 6.5, { align: 'center' });

    yPosition += 10;

    // Corps du tableau - Matières
    let totalPoints = 0;
    let totalCoefficients = 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    subjects.forEach((subject) => {
      const studentGrades = grades.filter(
        g => g.eleveId === student.id &&
        g.matiereId === subject.id &&
        g.trimestre === trimester
      );

      // Calcul des moyennes
      const devoirGrades = studentGrades.filter(g => g.typeEvaluation === 'devoir');
      const compoGrades = studentGrades.filter(g => g.typeEvaluation === 'composition');

      const moyenneDevoir = devoirGrades.length > 0
        ? devoirGrades.reduce((sum, g) => sum + (g.note / g.noteMax) * 20, 0) / devoirGrades.length
        : 0;

      const moyenneCompo = compoGrades.length > 0
        ? compoGrades.reduce((sum, g) => sum + (g.note / g.noteMax) * 20, 0) / compoGrades.length
        : 0;

      const moyenne = studentGrades.length > 0
        ? ((moyenneDevoir + moyenneCompo) / 2)
        : 0;

      const pondre = moyenne * subject.coefficient;

      if (moyenne > 0) {
        totalPoints += pondre;
        totalCoefficients += subject.coefficient;
      }

      // Appréciation
      let appreciation = '';
      if (moyenne >= 16) appreciation = 'Excellent';
      else if (moyenne >= 14) appreciation = 'Très Bien';
      else if (moyenne >= 12) appreciation = 'Bien';
      else if (moyenne >= 10) appreciation = 'Passable';
      else if (moyenne > 0) appreciation = 'Insuffisant';

      // Ligne de matière
      xPos = 15;
      doc.setFont('helvetica', 'italic');
      doc.text(subject.nom, xPos + 2, yPosition + 4);

      xPos += colWidths.discipline;
      doc.setFont('helvetica', 'normal');
      doc.text(moyenneDevoir > 0 ? moyenneDevoir.toFixed(2) : '', xPos + 7.5, yPosition + 4, { align: 'center' });

      xPos += colWidths.devoir;
      doc.text(moyenneCompo > 0 ? moyenneCompo.toFixed(2) : '', xPos + 7.5, yPosition + 4, { align: 'center' });

      xPos += colWidths.compo;
      doc.setFont('helvetica', 'bold');
      doc.text(moyenne > 0 ? moyenne.toFixed(2) : '', xPos + 9, yPosition + 4, { align: 'center' });

      xPos += colWidths.moyenne;
      doc.setFont('helvetica', 'normal');
      doc.text(subject.coefficient.toString(), xPos + 5, yPosition + 4, { align: 'center' });

      xPos += colWidths.coef;
      doc.setFont('helvetica', 'bold');
      doc.text(pondre > 0 ? pondre.toFixed(2) : '', xPos + 9, yPosition + 4, { align: 'center' });

      xPos += colWidths.pondre;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(appreciation, xPos + 12.5, yPosition + 4, { align: 'center' });
      doc.setFontSize(8);

      // Bordures
      xPos = 15;
      doc.rect(xPos, yPosition, colWidths.discipline, 6, 'D');
      xPos += colWidths.discipline;
      doc.rect(xPos, yPosition, colWidths.devoir, 6, 'D');
      xPos += colWidths.devoir;
      doc.rect(xPos, yPosition, colWidths.compo, 6, 'D');
      xPos += colWidths.compo;
      doc.rect(xPos, yPosition, colWidths.moyenne, 6, 'D');
      xPos += colWidths.moyenne;
      doc.rect(xPos, yPosition, colWidths.coef, 6, 'D');
      xPos += colWidths.coef;
      doc.rect(xPos, yPosition, colWidths.pondre, 6, 'D');
      xPos += colWidths.pondre;
      doc.rect(xPos, yPosition, colWidths.appreciation, 6, 'D');
      xPos += colWidths.appreciation;
      doc.rect(xPos, yPosition, colWidths.signature, 6, 'D');

      yPosition += 6;
    });

    // Ligne Retrait de points
    xPos = 15;
    doc.setFont('helvetica', 'italic');
    doc.text('Retrait de points', xPos + 2, yPosition + 4);
    doc.rect(xPos, yPosition, colWidths.discipline + colWidths.devoir + colWidths.compo + colWidths.moyenne + colWidths.coef, 6, 'D');
    xPos += colWidths.discipline + colWidths.devoir + colWidths.compo + colWidths.moyenne + colWidths.coef;
    doc.setFont('helvetica', 'bold');
    doc.text('0,00', xPos + 9, yPosition + 4, { align: 'center' });
    doc.rect(xPos, yPosition, colWidths.pondre, 6, 'D');
    xPos += colWidths.pondre;
    doc.rect(xPos, yPosition, colWidths.appreciation + colWidths.signature, 6, 'D');

    yPosition += 6;

    // Ligne TOTAUX
    xPos = 15;
    doc.setFillColor(220, 220, 220);
    doc.rect(xPos, yPosition, colWidths.discipline + colWidths.devoir + colWidths.compo + colWidths.moyenne, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAUX', xPos + 25, yPosition + 4);
    xPos += colWidths.discipline + colWidths.devoir + colWidths.compo + colWidths.moyenne;

    doc.rect(xPos, yPosition, colWidths.coef, 6, 'FD');
    doc.text(totalCoefficients.toString(), xPos + 5, yPosition + 4, { align: 'center' });
    xPos += colWidths.coef;

    doc.rect(xPos, yPosition, colWidths.pondre, 6, 'FD');
    doc.text(totalPoints.toFixed(2), xPos + 9, yPosition + 4, { align: 'center' });
    xPos += colWidths.pondre;
    doc.rect(xPos, yPosition, colWidths.appreciation + colWidths.signature, 6, 'FD');

    yPosition += 8;

    // Moyenne du trimestre et Rang
    const moyenneTrimestre = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : '0,00';

    // Calcul du rang
    const classAverages = classStudents.map(s => {
      let studentTotal = 0;
      let studentCoef = 0;
      subjects.forEach(subject => {
        const sGrades = allGrades.filter(
          g => g.eleveId === s.id &&
          g.matiereId === subject.id &&
          g.trimestre === trimester
        );
        if (sGrades.length > 0) {
          const avg = sGrades.reduce((sum, g) => sum + (g.note / g.noteMax) * 20, 0) / sGrades.length;
          studentTotal += avg * subject.coefficient;
          studentCoef += subject.coefficient;
        }
      });
      return { studentId: s.id, average: studentCoef > 0 ? studentTotal / studentCoef : 0 };
    }).sort((a, b) => b.average - a.average);

    const rang = classAverages.findIndex(a => a.studentId === student.id) + 1;
    const rangSuffix = rang === 1 ? 'er' : 'e';

    doc.setFontSize(9);
    doc.text(`Moyenne du trimestre : `, 50, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(moyenneTrimestre, 95, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rang : ${rang}${rangSuffix}`, 130, yPosition);

    yPosition += 2;
    doc.rect(15, yPosition, 180, 0.5, 'F');
    yPosition += 8;

    // Statistiques
    const maxAvg = classAverages[0]?.average || 0;
    const minAvg = classAverages[classAverages.length - 1]?.average || 0;
    const classAvg = classAverages.reduce((sum, a) => sum + a.average, 0) / (classAverages.length || 1);

    doc.setFontSize(8);
    doc.text(`Faible Moyenne: ${minAvg.toFixed(2)}`, 25, yPosition);
    doc.text(`Forte moyenne: ${maxAvg.toFixed(2)}`, 85, yPosition);
    doc.text(`Moyenne de classe: ${classAvg.toFixed(2)}`, 145, yPosition);

    yPosition += 10;
    doc.rect(15, yPosition, 180, 0.5, 'F');
    yPosition += 8;

    // Appréciation Générale et Sanctions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('APPRECIATION GENERALE', 70, yPosition, { align: 'center' });
    doc.text(`Ouagadougou, le ${new Date().toLocaleDateString('fr-FR')}`, 155, yPosition, { align: 'center' });

    yPosition += 6;

    // Colonnes Travail et Sanctions
    const colWidth = 55;
    let leftCol = 20;
    let rightCol = 90;

    // Travail
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TRAVAIL', leftCol + 20, yPosition);
    doc.rect(leftCol, yPosition + 2, colWidth, 30, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const travailItems = ['EXCELLENT', 'TRES BIEN', 'BIEN', 'ASSEZ BIEN', 'PASSABLE', 'TRES INSUFFISANT'];
    let itemY = yPosition + 7;
    travailItems.forEach(item => {
      doc.rect(leftCol + 2, itemY - 2, 3, 3, 'D');
      doc.text(item, leftCol + 7, itemY);
      itemY += 5;
    });

    // Sanctions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SANCTIONS', rightCol + 20, yPosition);
    doc.rect(rightCol, yPosition + 2, colWidth, 30, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const sanctionItems = ['Tableau d\'Honneur', 'Encouragements', 'Félicitations', 'Avertissements', 'Blâme'];
    itemY = yPosition + 7;
    sanctionItems.forEach(item => {
      doc.rect(rightCol + 2, itemY - 2, 3, 3, 'D');
      doc.text(item, rightCol + 7, itemY);
      itemY += 5;
    });

    yPosition += 35;

    // Conduite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CONDUITE', leftCol + 20, yPosition);
    doc.rect(leftCol, yPosition + 2, colWidth, 15, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const conduiteItems = ['Bonne', 'Passable', 'Mauvaise'];
    itemY = yPosition + 7;
    conduiteItems.forEach(item => {
      doc.rect(leftCol + 2, itemY - 2, 3, 3, 'D');
      doc.text(item, leftCol + 7, itemY);
      itemY += 5;
    });

    // Signature et Cachet du Proviseur
    doc.setFont('helvetica', 'bold');
    doc.text('Signature et Cachet du Proviseur', 155, yPosition + 7, { align: 'center' });
    doc.rect(rightCol, yPosition + 2, colWidth, 15, 'D');

    if (schoolSettings.directeur) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(schoolSettings.directeur, 155, yPosition + 14, { align: 'center' });
    }

    return doc;
  }
}
