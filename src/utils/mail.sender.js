
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
const sendMail = async ({ to, subject, text, html, templateName, templateVars = {}, attachmentName, attachmentFolder, verificationCode, resetToken }) => {
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

    // Ajout pièce jointe si nécessaire
    if (attachmentName && attachmentFolder) {
        mailOptions.attachments = [
            {
                filename: `${attachmentName}.pdf`,
                path: `./${attachmentFolder}/${attachmentName}.pdf`
            }
        ];
    }

    // Ajout du code de vérification ou du lien de reset dans les variables du template si besoin
    // (déjà géré par templateVars lors de l'appel)

    await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };