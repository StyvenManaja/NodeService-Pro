const quoteService = require('../services/quote.service');

// Crée un devis
const createQuote = async (req, res) => {
    try {
        const quote = await quoteService.createQuote(req.body);
        if(!quote) {
            return res.status(400).json({ message: 'Error creating quote' });
        }
        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuote
};
