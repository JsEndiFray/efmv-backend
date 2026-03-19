/*
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

const path = require('path');
const fs = require('fs');

const dbConnection = require('./src/dbConnection/dbConnection');
const sendEmailNotification = require('./src/services/emailServices.js')

const app = express();
const port = process.env.PORT || 5001;

// Acceso a log
// const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
//     flags: 'a'
// })
//La se convierte en string
// app.use((req, res, next) => {
//     req.requesTime = new Date().toISOString();
//     next();
// })
// // que que hago pedir la ip fecha el metodo el tiempo
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms - :request-body - :request-time', {stream: logStream}));
//
//
// morgan.token('request-body', (req)=> JSON.stringify(req.body));
// morgan.token('request-time', (req)=> req.requesTime);

//Debug middleware verificar todas solicitudes.
// app.use((req, res, next)=>{
//     //Debug of the request
//     console.log('Request received');
//
//     //Debug of the body
//     console.log('Body:', req.body);
//
//     //Debug of the query
//     console.log('Query:', req.query);
//
//     //Debug of the params
//     console.log('Params:', req.params);
//
//     //Debug of the header
//     console.log('Headers:', req.headers);
//
//     next();
// })
//Integrar Sentry para Monitoreo de Errores


// Middleware
app.use(cors({
    origin: [
        'https://efmv.es',
        'https://www.efmv.es',
        'http://localhost:4200',
        'https://api.efmv.es',
        'https://endi-fray.vercel.app',
        'https://!*.vercel.app',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'content-type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200 //Para compatibilidad con navegadores antiguos
}));

//Middleware adicional para headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // Responder a preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.options('*', cors());
app.use(express.json());


//Ruta conexión con vercel.
app.get("/", (req, res) => res.send("Express en Vercel"));

//Ruta para enviar mensaje
app.post('/api/contact', async (req, res) => {
    try {
        console.log('📨 Contacto recibido:', req.body); // Debug

        const {name, email, message, phone} = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, email y mensaje son obligatorios'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Guardar en BD
        await dbConnection.createContact({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            phone: phone?.trim() || ''
        });

        // Enviar email
        const emailResult = await sendEmailNotification(
            name.trim(),
            email.trim(),
            message.trim(),
            phone?.trim() || ''
        );

        res.status(200).json({
            success: true,
            message: 'Mensaje enviado correctamente',
            messageId: emailResult.messageId
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json(
            false,
            'Error interno del servidor'
        );
    }
});

// Endpoint para descargar CV
app.get('/api/cv/download', (req, res) => {
    try {
        const cvPath = path.join(__dirname, 'src', 'assets', 'cv', 'cv-endifray.pdf');

        if (!fs.existsSync(cvPath)) {
            return res.status(404).json({
                success: false,
                error: 'CV no encontrado'
            });
        }

        res.setHeader('Content-Disposition', 'attachment; filename="CV-EndiFray.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'no-cache');

        res.sendFile(cvPath, (err) => {
            if (err) {
                console.error('Error al enviar CV:', err);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        error: 'Error al descargar CV'
                    });
                }
            } else {
                console.log('CV descargado correctamente:', new Date().toISOString());
            }
        });

    } catch (error) {
        console.error('Error en endpoint de CV:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});


// Endpoint para estado del CV
app.get('/api/cv/status', (req, res) => {
    try {
        const cvPath = path.join(__dirname, 'src', 'assets', 'cv', 'cv-endifray.pdf');
        const exists = fs.existsSync(cvPath);

        if (exists) {
            const stats = fs.statSync(cvPath);
            res.json({
                success: true,
                exists: true,
                data: {
                    size: stats.size,
                    lastModified: stats.mtime,
                    sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`
                }
            });
        } else {
            res.json({
                success: true,
                exists: false,
                message: 'CV no encontrado'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al verificar estado del CV'
        });
    }
});


app.listen(port, () => {
    console.log('Servidor conectado en el puerto:', port);
});
*/



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs');

const dbConnection = require('./src/dbConnection/dbConnection');
const sendEmailNotification = require('./src/services/emailServices.js')

const app = express();
const port = process.env.PORT || 5001;

// Middleware CORS
app.use(cors({
    origin: [
        'https://efmv.es',
        'https://www.efmv.es',
        'https://api.efmv.es',
        'https://endi-fray.vercel.app',
        'https://*.vercel.app',
        ...(process.env.NODE_ENV === 'development' ? ['http://localhost:4200', 'http://localhost:3000'] : [])
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging solo en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, req.body);
        next();
    });
}

// Rutas principales
app.get("/", (req, res) => res.send("Express en Vercel"));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend funcionando correctamente",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Endpoint de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const {name, email, message, phone} = req.body;

        // Validaciones
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, email y mensaje son obligatorios'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Guardar en BD
        try {
            await dbConnection.createContact({
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                phone: phone?.trim() || ''
            });
        } catch (dbError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error BD:', dbError);
            }
        }

        // Enviar email
        try {
            const emailResult = await sendEmailNotification(
                name.trim(),
                email.trim(),
                message.trim(),
                phone?.trim() || ''
            );

            res.status(200).json({
                success: true,
                message: 'Mensaje enviado correctamente',
                messageId: emailResult.messageId
            });
        } catch (emailError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error email:', emailError);
            }

            res.status(200).json({
                success: true,
                message: 'Mensaje recibido correctamente. Te contactaremos pronto.'
            });
        }

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error general:', error.message);
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor. Intenta nuevamente.'
        });
    }
});

// Endpoint para descargar CV
app.get('/api/cv/download', (req, res) => {
    try {
        const cvPath = path.join(__dirname, 'src', 'assets', 'cv', 'cv-endifray.pdf');

        if (!fs.existsSync(cvPath)) {
            return res.status(404).json({
                success: false,
                error: 'CV no encontrado'
            });
        }

        res.setHeader('Content-Disposition', 'attachment; filename="CV-EndiFray.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'no-cache');

        res.sendFile(cvPath, (err) => {
            if (err && !res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error al descargar CV'
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Endpoint para estado del CV
app.get('/api/cv/status', (req, res) => {
    try {
        const cvPath = path.join(__dirname, 'src', 'assets', 'cv', 'cv-endifray.pdf');
        const exists = fs.existsSync(cvPath);

        if (exists) {
            const stats = fs.statSync(cvPath);
            res.json({
                success: true,
                exists: true,
                data: {
                    size: stats.size,
                    lastModified: stats.mtime,
                    sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`
                }
            });
        } else {
            res.json({
                success: true,
                exists: false,
                message: 'CV no encontrado'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al verificar estado del CV'
        });
    }
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error no manejado:', error);
    }
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Servidor conectado en el puerto:', port);
        console.log('🌍 CORS configurado para producción');
    }
});