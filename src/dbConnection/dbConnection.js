const mongoose = require('mongoose');
const Contact = require('../models/contact.models')


//Funcion para conectar a la base de datos
mongoose.connect(process.env.DB_CONNECTION)
    .then(connection=>{
        console.log('Conectado correctamente a MongoDB');
    }).catch(error =>{
    console.log('Error de conexión:', error.message);
})

//Funcion para crear un nuevo contacto
function createContact(newUser) {
    return Contact.create(newUser);
}

module.exports = {
    createContact,
};