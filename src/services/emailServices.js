const nodemailer = require('nodemailer');
require('dotenv').config();

// Validar variables de entorno al inicio
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Variables de entorno EMAIL_USER y EMAIL_PASS son requeridas');
}

//Configura los datos SMTP de IONOS
const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.es',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});


// Valida que los campos obligatorios estén presentes y que el email tenga formato válido
const sendEmailNotification = async (name, email, message, phone = '') => {
    // Validación de parámetros individuales
    if (!name || !email || !message) {
        throw new Error('Los campos nombre, email y mensaje son obligatorios');
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('El formato del email no es válido');
    }

    try {
        // Define los datos del correo (remitente, receptor, asunto, contenido HTML y texto plano)
        const mailOptions = {
            from: `"Sistema de Contacto EFMV" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Envía a tu mismo correo
            subject: `✉️ Nuevo mensaje de ${name} - EFMV`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">🆕 Nuevo Mensaje de Contacto</h2>
                        <p style="margin: 5px 0 0 0;">Sitio Web EFMV</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                            <h3 style="color: #333; margin-top: 0;">Información del Contacto:</h3>
                            <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
                            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p style="margin: 10px 0;"><strong>📱 Teléfono:</strong> ${phone || 'No proporcionado'}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #333; margin-bottom: 10px;">💬 Mensaje:</h3>
                            <div style="background-color: white; padding: 20px; border-left: 4px solid #007bff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                📅 Recibido el: ${new Date().toLocaleString('es-ES')}
                            </p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
                                Enviado desde el formulario de contacto de efmv.es
                            </p>
                        </div>
                    </div>
                </div>
            `,
            text: `
🆕 NUEVO MENSAJE DE CONTACTO - EFMV

👤 Nombre: ${name}
📧 Email: ${email}
📱 Teléfono: ${phone || 'No proporcionado'}

💬 Mensaje:
${message}

📅 Recibido el: ${new Date().toLocaleString('es-ES')}
Enviado desde el formulario de contacto de efmv.es
            `,
            // Configuración adicional para mejor entrega
            headers: {
                'X-Priority': '1', // Alta prioridad
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };
        //Intenta enviar el correo con la configuración principal y devuelve los datos si funciona
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            message: 'Correo enviado correctamente',
            to: process.env.EMAIL_USER
        };

    } catch (error) {
        throw new Error(`Error en el envío: ${error.message}`);
    }
};

module.exports = sendEmailNotification;