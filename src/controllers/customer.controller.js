const customerService = require('../services/customer.service');

// Création d'un client
const createCustomer = async (req, res) => {
    const { name, company, email, phone } = req.body;
    try {
        const customer = await customerService.createCustomer(name, company, email, phone);
        if(!customer) {
            return res.status(400).json({ error: 'Error creating customer' });
        }
        res.status(200).json(customer);
    } catch (error) {
        // Gestion des erreurs (doublon ou erreur serveur)
        const status = error.message.includes('already exists') ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
};

// Récuperation de la liste de tous les clients
const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        if(!customers || customers.length === 0) {
            return res.status(404).json({ error: 'No customers found' });
        }
        res.status(200).json(customers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récuperer un client avec son ID
const getCustomerById = async (req, res) => {
    const { customerId } = req.params;
    try {
        const customer = await customerService.getCustomerById(customerId);
        if(!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour les données d'un client
const updateCustomer = async (req, res) => {
    const { customerId } = req.params;
    const customerData = req.body;
    try {
        const updatedCustomer = await customerService.updateCustomer(customerId, customerData);
        if(!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un client
const deleteCustomer = async (req, res) => {
    const { customerId } = req.params;
    try {
        const deletedCustomer = await customerService.deleteCustomer(customerId);
        if(!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};