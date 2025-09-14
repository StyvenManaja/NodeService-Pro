const PDFDocument = require('pdfkit');
const fs = require('fs');

// Crée un devis PDF
const createDevis = (devis, path) => {

    // Création du dossier cible si nécessaire
    const dir = require('path').dirname(path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    // Titre principal
    doc.fillColor('#222').fontSize(36).font('Helvetica-Bold').text('Devis', { align: 'left' });
    doc.moveDown(0.5);

    // Ligne de séparation
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor('#007bff').lineWidth(2).stroke();
    doc.moveDown(0.5);

    // Date et numéro de devis
    doc.fontSize(12).font('Helvetica').fillColor('#333').text(`${new Date(devis.date).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Devis n°${devis.number || 'XXXX'}`);
    doc.moveDown(1);

    // Colonnes client / destinataire
    const leftX = doc.x;
    const rightX = doc.page.width / 2 + 10;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff').text(devis.user.name || 'Nom société', leftX, doc.y);
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(devis.user.email || 'email@votresociete.com', leftX, doc.y);

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff').text('À L’ATTENTION DE', rightX, doc.y - 24);
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(devis.client.name || 'Nom client', rightX, doc.y - 12);
    doc.text(devis.client.company || '', rightX, doc.y);
    doc.text(devis.client.phone || '', rightX, doc.y + 12);

    doc.moveDown(2);

    // Tableau des prestations
    const tableTop = doc.y;
    const colWidths = [180, 60, 60, 80];
    const startX = doc.x;
    // En-tête du tableau
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#007bff');
    doc.text('DESCRIPTION', startX, tableTop, { width: colWidths[0], align: 'left' });
    doc.text('PRIX', startX + colWidths[0], tableTop, { width: colWidths[1], align: 'right' });
    doc.text('QUANTITÉ', startX + colWidths[0] + colWidths[1], tableTop, { width: colWidths[2], align: 'right' });
    doc.text('TOTAL', startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop, { width: colWidths[3], align: 'right' });

    // Bordure sous l'en-tête
    doc.moveTo(startX, tableTop + 15).lineTo(startX + colWidths.reduce((a,b)=>a+b,0), tableTop + 15).strokeColor('#007bff').lineWidth(1).stroke();

    // Lignes des prestations
    let y = tableTop + 20;
    doc.fontSize(10).font('Helvetica').fillColor('#222');
    devis.prestations.forEach((p) => {
        doc.text(p.name, startX, y, { width: colWidths[0], align: 'left' });
        doc.text(`${p.price} €`, startX + colWidths[0], y, { width: colWidths[1], align: 'right' });
        doc.text(`${p.quantity}`, startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
        doc.text(`${p.price * p.quantity} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
        y += 18;
        // Ligne de séparation entre prestations
        doc.moveTo(startX, y - 2).lineTo(startX + colWidths.reduce((a,b)=>a+b,0), y - 2).strokeColor('#eee').lineWidth(0.5).stroke();
    });

    // Sous-total, TVA, Total
    y += 10;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#222');
    doc.text('Sous total :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${devis.subTotal || devis.totalAmount || ''} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
    y += 16;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#222');
    doc.text('TVA (20%) :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${devis.tva || ''} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
    y += 16;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff');
    doc.text('TOTAL :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${devis.totalAmount} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });

    // Signature et mention
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#222').text('signature suivie de la mention "bon pour accord"');

    // Mentions légales et conditions (footer)
    doc.moveDown(1);
    doc.fontSize(8).font('Helvetica').fillColor('#888').text(devis.validityPeriod ? `Valable ${devis.validityPeriod} jours.` : 'Mentions légales et conditions ici.', { align: 'center' });

    // Coordonnées en bas de page
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#007bff');
    doc.text(devis.user.phone || '', 40, doc.page.height - 60, { width: 120, align: 'left' });
    doc.text(devis.user.email || '', doc.page.width / 2 - 60, doc.page.height - 60, { width: 180, align: 'center' });
    doc.text(devis.user.company || '', doc.page.width - 180, doc.page.height - 60, { width: 140, align: 'right' });

    doc.end();

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            resolve(path);
        });
        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}

// Crée une facture en PDF
const createInvoice = (invoice, path) => {
    // Création du dossier cible si nécessaire
    const dir = require('path').dirname(path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    // Titre principal
    doc.fillColor('#222').fontSize(36).font('Helvetica-Bold').text('Facture', { align: 'left' });
    doc.moveDown(0.5);

    // Ligne de séparation
    doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor('#007bff').lineWidth(2).stroke();
    doc.moveDown(0.5);

    // Date et numéro de facture
    doc.fontSize(12).font('Helvetica').fillColor('#333').text(`${new Date(invoice.date).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Facture n°${invoice.number || 'XXXX'}`);
    doc.moveDown(1);

    // Colonnes client / destinataire
    const leftX = doc.x;
    const rightX = doc.page.width / 2 + 10;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff').text(invoice.user.name || 'Nom société', leftX, doc.y);
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(invoice.user.email || 'email@votresociete.com', leftX, doc.y);

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff').text('À L’ATTENTION DE', rightX, doc.y - 24);
    doc.fontSize(10).font('Helvetica').fillColor('#333').text(invoice.client.name || 'Nom client', rightX, doc.y - 12);
    doc.text(invoice.client.company || '', rightX, doc.y);
    doc.text(invoice.client.phone || '', rightX, doc.y + 12);

    doc.moveDown(2);

    // Tableau des prestations
    const tableTop = doc.y;
    const colWidths = [180, 60, 60, 80];
    const startX = doc.x;
    // En-tête du tableau
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#007bff');
    doc.text('DESCRIPTION', startX, tableTop, { width: colWidths[0], align: 'left' });
    doc.text('PRIX', startX + colWidths[0], tableTop, { width: colWidths[1], align: 'right' });
    doc.text('QUANTITÉ', startX + colWidths[0] + colWidths[1], tableTop, { width: colWidths[2], align: 'right' });
    doc.text('TOTAL', startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop, { width: colWidths[3], align: 'right' });

    // Bordure sous l'en-tête
    doc.moveTo(startX, tableTop + 15).lineTo(startX + colWidths.reduce((a,b)=>a+b,0), tableTop + 15).strokeColor('#007bff').lineWidth(1).stroke();

    // Lignes des prestations
    let y = tableTop + 20;
    doc.fontSize(10).font('Helvetica').fillColor('#222');
    invoice.prestations.forEach((p) => {
        doc.text(p.name, startX, y, { width: colWidths[0], align: 'left' });
        doc.text(`${p.price} €`, startX + colWidths[0], y, { width: colWidths[1], align: 'right' });
        doc.text(`${p.quantity}`, startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
        doc.text(`${p.price * p.quantity} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
        y += 18;
        // Ligne de séparation entre prestations
        doc.moveTo(startX, y - 2).lineTo(startX + colWidths.reduce((a,b)=>a+b,0), y - 2).strokeColor('#eee').lineWidth(0.5).stroke();
    });

    // Sous-total, TVA, Total
    y += 10;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#222');
    doc.text('Sous total :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${invoice.subTotal || invoice.totalAmount || ''} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
    y += 16;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#222');
    doc.text('TVA (20%) :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${invoice.tva || ''} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });
    y += 16;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#007bff');
    doc.text('TOTAL :', startX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'right' });
    doc.text(`${invoice.totalAmount} €`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3], align: 'right' });

    // Signature et mention
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#222').text('signature suivie de la mention "bon pour accord"');

    // Mentions légales et conditions (footer)
    doc.moveDown(1);
    doc.fontSize(8).font('Helvetica').fillColor('#888').text(invoice.footer || 'Mentions légales et conditions ici.', { align: 'center' });

    // Coordonnées en bas de page
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#007bff');
    doc.text(invoice.user.phone || '', 40, doc.page.height - 60, { width: 120, align: 'left' });
    doc.text(invoice.user.email || '', doc.page.width / 2 - 60, doc.page.height - 60, { width: 180, align: 'center' });
    doc.text(invoice.user.company || '', doc.page.width - 180, doc.page.height - 60, { width: 140, align: 'right' });

    doc.end();

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            resolve(path);
        });
        writeStream.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    createDevis,
    createInvoice
};
