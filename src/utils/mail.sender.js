const nodemailer = require('nodemailer');

// Fonction générique pour envoyer un mail avec pièce jointe (devis ou facture)
const sendMailWithAttachment = async (clientsMail, pdfName, type = 'devis') => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });

    let subject, text, folder;
    if (type === 'devis') {
        subject = 'Votre devis';
        text = 'Bonjour, voici votre devis en pièce jointe.';
        folder = 'devis';
    } else if (type === 'invoice') {
        subject = 'Votre facture';
        text = 'Bonjour, voici votre facture en pièce jointe.';
        folder = 'invoices';
    } else {
        throw new Error('Type de document non supporté');
    }

    const mailOption = {
        from: 'ranaivoson@styven-manaja.digital',
        to: `${clientsMail}`,
        subject,
        text,
        attachments: [
            {
                filename: `${pdfName}.pdf`,
                path: `./${folder}/${pdfName}.pdf`
            }
        ]
    };

    // envoi du mail
    await transporter.sendMail(mailOption);
};

// Fonction pour envoyer un mail de relance
const sendReminderEmail = async (clientsMail, pdfName, type = 'invoice') => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });

    let subject, text, folder;
    subject = 'Rappel : Votre facture';
    text = 'Bonjour, ceci est un rappel concernant votre facture.';
    folder = 'invoices';

    const mailOption = {
        from: 'ranaivoson@styven-manaja.digital',
        to: `${clientsMail}`,
        subject,
        text,
        attachments: [
            {
                filename: `${pdfName}.pdf`,
                path: `./${folder}/${pdfName}.pdf`
            }
        ]
    };

    // envoi du mail
    await transporter.sendMail(mailOption);
};

// Fonction pour envoyer un mail après un paiement
const sendPaymentConfirmationEmail = async (clientsMail, pdfName) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });

    const subject = 'Confirmation de paiement';
    const text = 'Bonjour, votre paiement a bien été reçu.';

    const mailOption = {
        from: 'ranaivoson@styven-manaja.digital',
        to: `${clientsMail}`,
        subject,
        text,
        attachments: [
            {
                filename: `${pdfName}.pdf`,
                path: `./invoices/${pdfName}.pdf`
            }
        ]
    };

    // envoi du mail
    await transporter.sendMail(mailOption);
};

// Fonction pour envoyer un mail de vérification
const sendVerificationEmail = async (clientsMail, verificationCode) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS
        }
    });

    const subject = 'Vérification de votre compte';
    const text = `Bonjour, voici votre code de vérification : ${verificationCode}`;

    const mailOption = {
        from: 'ranaivoson@styven-manaja.digital',
        to: `${clientsMail}`,
        subject,
        text
    };

    // envoi du mail
    await transporter.sendMail(mailOption);
};

module.exports = { sendMailWithAttachment, sendReminderEmail, sendPaymentConfirmationEmail, sendVerificationEmail };