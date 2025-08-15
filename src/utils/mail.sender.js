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

module.exports = { sendMailWithAttachment };