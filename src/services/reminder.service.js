const Invoices = require('../models/Invoices');
const { sendMail } = require('../utils/mail.sender');
const AppError = require('../utils/AppError');

function addDays(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

const shouldSendReminder = (invoice, now = new Date()) => {
    if(invoice.status !== 'unpaid') return false;
    if(invoice.dueDate >= now) return false;
    
    const idx = invoice.reminder.count; // Prochain palier à viser
    const scheduleDay = invoice.reminder.scheduleDay || [0, 3, 7, 14];

    if(idx >= scheduleDay.length) return false; // Plus de relances à envoyer

    const targetDay = addDays(invoice.dueDate, scheduleDay[idx]);

    if(now <= targetDay) return false; // Pas encore le jour de relance

    // Eviter le double envoi le même jour
    if(invoice.reminder.lastSent && isSameDay(now, invoice.reminder.lastSent)) return false;

    return true;
};

const sendReminders = async () => {
    // Récupérer toutes les factures non payées dont l’échéance est passée
    const now = new Date();
    const invoices = await Invoices
        .find({ status: { $ne: "PAYEE" }, dueDate: { $lte: now } })
        .populate("client"); // on veut l’email du client

    for(const invoice of invoices) {
        const send = shouldSendReminder(invoice, now);
        if(!send) continue;

        // Mettre/forcer le statut "overdue"
        invoice.status = 'overdue';
        // Marquer l’envoi côté DB
        invoice.reminder.lastSent = now;
        invoice.reminder.count += 1;
        await invoice.save();
        try {
            await sendMail({
                to: invoice.client.email,
                subject: 'Rappel : Votre facture',
                templateName: 'reminder',
                templateVars: {
                    clientName: invoice.client.name
                },
                attachmentName: `invoice-${invoice._id.toString()}`,
                attachmentFolder: 'invoices'
            });
        } catch (error) {
            throw new AppError('Failed to send reminder email for invoice', 500);
        }
    }
};

module.exports = {
    sendReminders
};