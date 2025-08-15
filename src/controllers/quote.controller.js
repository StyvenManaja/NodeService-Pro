const quoteService = require('../services/quote.service');

// Crée un devis
const createQuote = async (req, res) => {
    try {
        let { prestations, ...rest } = req.body;
        // Si prestations est un tableau de chaînes, transformer en objets
        if (Array.isArray(prestations) && prestations.length > 0 && typeof prestations[0] === 'string') {
            prestations = prestations.map(id => ({ prestation: id, quantity: 1 }));
        }
        const quote = await quoteService.createQuote({ ...rest, prestations });
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
