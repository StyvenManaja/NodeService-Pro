const PDFDocument = require('pdfkit');
const fs = require('fs');

// Crée un devis PDF
const createDevis = (devis, path) => {
    // Vérifie et crée le dossier cible si nécessaire
    const dir = require('path').dirname(path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    // Ajout du contenu du devis au PDF
    // En tête
    doc.fontSize(25).text('Devis', { align: 'center' }).moveDown();

    // Mes informations
    doc
        .fontSize(12)
        .text("NodeService Pro", { align: "left" })
        .text('Nom: RANAIVOSON Manaja Styven')
        .text('Email: ranaivoson@styven-manaja.digital')
        .moveDown();

    // Informations sur le client
    doc
        .fontSize(12)
        .text(`Client : ${devis.client.name}`)
        .text(`Email : ${devis.client.email}`)
        .text(`Société : ${devis.client.company}`)
        .text(`Téléphone : ${devis.client.phone}`)
        .text(`Date : ${new Date(devis.date).toLocaleDateString()}`)
        .moveDown();

    // Tableau des prestations
    doc.fontSize(12).text("Prestations :", { underline: true }).moveDown(0.5);

    devis.prestations.forEach((p) => {
        doc.text(`${p.name} : ${p.description} - ${p.price} € x ${p.quantity}`);
    });

    // Total
    doc
        .moveDown()
        .fontSize(14)
        .text(`Total TTC : ${devis.totalAmount} €`, { bold: true });

    // Conditions
    doc
        .moveDown()
        .fontSize(10)
        .text("Conditions : Le devis est valable 30 jours à compter de la date d'émission.", { italics: true });

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
    // Vérifie et crée le dossier cible si nécessaire
    const dir = require('path').dirname(path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    // Ajout du contenu de la facture au PDF
    // En tête
    doc.fontSize(25).text('Facture', { align: 'center' }).moveDown();

    // Mes informations
    doc
        .fontSize(12)
        .text("NodeService Pro", { align: "left" })
        .text('Nom: RANAIVOSON Manaja Styven')
        .text('Email: ranaivoson@styven-manaja.digital')
        .moveDown();

    // Informations sur le client
    doc
        .fontSize(12)
        .text(`Client : ${invoice.client.name}`)
        .text(`Email : ${invoice.client.email}`)
        .text(`Société : ${invoice.client.company}`)
        .text(`Téléphone : ${invoice.client.phone}`)
        .text(`Date : ${new Date(invoice.date).toLocaleDateString()}`)
        .moveDown();

    // Tableau des prestations
    doc.fontSize(12).text("Prestations :", { underline: true }).moveDown(0.5);

    invoice.prestations.forEach((p) => {
        doc.text(`${p.name} : ${p.description} - ${p.price} € x ${p.quantity}`);
    });

    // Total
    doc
        .moveDown()
        .fontSize(14)
        .text(`Total TTC : ${invoice.totalAmount} €`, { bold: true });

    // Conditions
    doc
        .moveDown()
        .fontSize(10)
        .text("Conditions : Le devis est valable 30 jours à compter de la date d'émission.", { italics: true });

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
