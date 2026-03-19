const mongoose = require('mongoose');
const Contact = require('../models/contact.models')

async function connectDB() {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Conectado correctamente a MongoDB');
}

function createContact(newUser) {
    return Contact.create(newUser);
}

module.exports = {
    connectDB,
    createContact,
};