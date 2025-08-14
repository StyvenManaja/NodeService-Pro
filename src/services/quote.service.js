const quoteRepository = require('../repositories/quote.repository');

// Crée un devis
const createQuote = async (quoteData) => {
    try {
        return await quoteRepository.createQuote(quoteData);
    } catch (error) {
        throw new Error('Error creating quote');
    }
};

module.exports = {
    createQuote
};
