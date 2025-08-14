const Customer = require('../models/Customer');

// Création d'un client
const createCustomer = async (customerData) => {
    try {
        const customer = new Customer(customerData);
        return await customer.save();
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            throw new Error('Customer already exists: ' + error.message);
        }
        // Gestion des autres erreurs de création
        throw new Error('Error on creating customer: ' + error.message);
    }
};

// Récupération d'un client par ID
const getCustomerById = async (customerId) => {
    try {
        return await Customer.findById(customerId);
    } catch (error) {
        throw new Error('Error fetching customer');
    }
};

// Récuperation de la liste de tous les clients
const getAllCustomers = async () => {
    try {
        return await Customer.find();
    } catch (error) {
        throw new Error('Error fetching customers');
    }
};

// Mise à jour d'un client
const updateCustomer = async (customerId, customerData) => {
    try {
        return await Customer.findByIdAndUpdate(customerId, customerData, { new: true });
    } catch (error) {
        throw new Error('Error updating customer');
    }
};

// Suppression d'un client
const deleteCustomer = async (customerId) => {
    try {
        return await Customer.findByIdAndDelete(customerId);
    } catch (error) {
        throw new Error('Error deleting customer');
    }
};

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  deleteCustomer
};
