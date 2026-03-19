const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor ingresa un email válido']
    },
    phone: {
        type: String,
        trim: true,
        default: '',
        validate: {
            validator: function(v) {
                // Permitir vacío o formato de teléfono válido
                return !v || /^[+]?[\d\s\-\(\)]*$/.test(v);
            },
            message: 'Formato de teléfono inválido'
        }
    },
    message: {
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        trim: true,
        minlength: [10, 'El mensaje debe tener al menos 10 caracteres'],
        maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres']
    },
    // Campos adicionales útiles
    status: {
        type: String,
        enum: ['nuevo', 'leido', 'respondido'],
        default: 'nuevo'
    },
    ipAddress: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    }
}, {
    timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar rendimiento
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });


module.exports = mongoose.model('Contact', contactSchema);