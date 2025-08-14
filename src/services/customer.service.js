const customerRepository = require('../repositories/customer.repository');

// Création d'un client
const createCustomer = async (name, company, email, phone) => {
    const customerData = { name, company, email, phone };
    return await customerRepository.createCustomer(customerData);
};

// Récupération d'un client par ID
const getCustomerById = async (customerId) => {
    return await customerRepository.getCustomerById(customerId);
};

// Récuperation de la liste de tous les clients
const getAllCustomers = async () => {
    return await customerRepository.getAllCustomers();
};

// Mise à jour d'un client
const updateCustomer = async (customerId, customerData) => {
    return await customerRepository.updateCustomer(customerId, customerData);
};

// Suppression d'un client
const deleteCustomer = async (customerId) => {
    return await customerRepository.deleteCustomer(customerId);
};

module.exports = {
    createCustomer,
    getCustomerById,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
};
