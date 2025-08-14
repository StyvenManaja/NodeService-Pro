const Quote = require('../models/quote.model');

// Crée un devis
const createQuote = async (quoteData) => {
    try {
        const quote = new Quote(quoteData);
        return await quote.save();
    } catch (error) {
        throw new Error('Error creating quote');
    }
};

module.exports = {
    createQuote
};
