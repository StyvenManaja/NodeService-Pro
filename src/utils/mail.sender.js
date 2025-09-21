
const nodemailer = require('nodemailer');
const { loadTemplate } = require('./template.loader');

/**
 * Fonction générique pour envoyer tous types de mails (devis, facture, relance, vérification, confirmation, reset).
 * @param {Object} options - Options du mail
 * @param {string} options.to - Email du destinataire
 * @param {string} options.subject - Sujet du mail
 * @param {string} options.text - Texte du mail
 * @param {string} [options.html] - Contenu HTML du mail (optionnel)
 * @param {string} [options.attachmentName] - Nom du fichier PDF (sans extension)
 * @param {string} [options.attachmentFolder] - Dossier du fichier PDF (ex: 'devis', 'invoices')
 * @param {string} [options.verificationCode] - Code de vérification (optionnel)
 * @param {string} [options.resetToken] - Token de réinitialisation (optionnel)
 */
/**
 * Ajout du paramètre templateName et templateVars pour centraliser les templates
 */
const sendMail = async ({ to, subject, text, html, templateName, templateVars = {}, attachments = [] }) => {
    if (!process.env.BREVO_USER || !process.env.BREVO_PASS || !process.env.PROD_EMAIL) {
        throw new Error('Missing mail environment variables (BREVO_USER, BREVO_PASS, PROD_EMAIL)');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });

    let mailOptions = {
        from: process.env.PROD_EMAIL,
        to,
        subject
    };
    // Si un template est demandé, le charger et injecter les variables
    if (templateName) {
        mailOptions.html = loadTemplate(templateName, templateVars);
    } else if (html) {
        mailOptions.html = html;
    } else {
        mailOptions.text = text;
    }

    // Ajout des pièces jointes (buffer ou path)
    let attachmentsList = [];
    if (Array.isArray(attachments) && attachments.length > 0) {
        attachmentsList = attachments;
    } else if (attachmentName) {
        const looksLikePath = attachmentName.includes('/') || attachmentName.includes('\\');
        const pathOrName = looksLikePath ? attachmentName : `./${attachmentFolder || ''}/${attachmentName}.pdf`.replace('//','/');
        const fileNameOnly = looksLikePath ? attachmentName.split('/').pop() : `${attachmentName}.pdf`;
        attachmentsList = [{ filename: fileNameOnly, path: pathOrName }];
    }
    if (attachmentsList.length > 0) {
        mailOptions.attachments = attachmentsList;
        // Debug log for attachments
        console.log('[MAIL] attachments:', attachmentsList.map(a => ({ filename: a.filename, hasContent: !!a.content, path: a.path })));
    }

    await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };