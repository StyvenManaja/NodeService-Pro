const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Utilitaire pour injecter les données dans le template HTML (synchrone)
function injectData(template, data) {
    let html = template;
    const safe = (v) => {
        if (v === null || v === undefined) return '';
        if (v instanceof Date) return v.toLocaleDateString('fr-FR');
        if (typeof v === 'number') return String(v);
        if (typeof v === 'boolean') return v ? 'Oui' : 'Non';
        return String(v);
    };

    for (const key in data) {
        const value = data[key];
        if (value && typeof value === 'object' && !(value instanceof Date)) {
            for (const subKey in value) {
                html = html.replace(new RegExp(`{{${key}.${subKey}}}`, 'g'), safe(value[subKey]));
            }
            // Remplace {{key}} par vide si c'est un objet non géré au niveau racine
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), '');
        } else {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), safe(value));
        }
    }
    // Nettoie les placeholders restants non résolus
    html = html.replace(/{{[^}]+}}/g, '');
    return html;
}

// Génère un PDF à partir d'un template HTML et des données
async function generatePdfFromHtml(html, outputPath) {
    if (typeof html !== 'string') {
        html = String(html);
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
    await browser.close();
}

// Crée un devis PDF
async function createDevis(devis, outputPath) {
    const templatePath = path.resolve(__dirname, '../templates/devisPdf.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    const html = injectData(template, devis);
    await generatePdfFromHtml(html, outputPath);
    return outputPath;
}

// Crée une facture PDF
async function createInvoice(invoice, outputPath) {
    const templatePath = path.resolve(__dirname, '../templates/invoicePdf.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    const html = injectData(template, invoice);
    await generatePdfFromHtml(html, outputPath);
    return outputPath;
}

module.exports = {
    createDevis,
    createInvoice
};