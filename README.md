# EFMV · Backend

API REST del portfolio personal [efmv.es](https://www.efmv.es). Gestiona el formulario de contacto, el envío de notificaciones por email y la descarga del CV en PDF.

**Desplegado en Vercel · Base de datos en MongoDB Atlas**

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 24 | Runtime |
| Express | 4.x | Framework HTTP |
| Mongoose | 8.x | ODM para MongoDB |
| Nodemailer | 6.x | Envío de email vía SMTP |
| MongoDB Atlas | — | Base de datos en la nube |
| Vercel | — | Plataforma de despliegue |

---

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Verificación básica del servidor |
| `GET` | `/api/health` | Estado del servidor y timestamp |
| `POST` | `/api/contact` | Recibe el formulario, guarda en BD y envía email |
| `GET` | `/api/cv/download` | Descarga el CV en PDF |
| `GET` | `/api/cv/status` | Metadatos del archivo CV (tamaño, fecha) |

---

## Arquitectura

```
├── index.js                        # Punto de entrada: middlewares, rutas, arranque
└── src/
    ├── dbConnection/
    │   └── dbConnection.js         # connectDB() y createContact()
    ├── models/
    │   └── contact.models.js       # Schema Mongoose con validaciones e índices
    ├── services/
    │   └── emailServices.js        # Configuración SMTP y template HTML del email
    └── assets/
        └── cv/
            └── cv-endifray.pdf
```

**Flujo de una petición de contacto:**

```
POST /api/contact
  → Validación de campos (index.js)
  → Guardar contacto en MongoDB (dbConnection.js)
  → Enviar email de notificación (emailServices.js)
  → Respuesta al cliente
```

---

## Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo (nodemon)
npm run dev

# Producción
npm start
```

### Variables de entorno

```env
PORT=5001
NODE_ENV=development
DB_CONNECTION=mongodb+srv://usuario:password@cluster.mongodb.net/dbname
EMAIL_USER=correo@dominio.es
EMAIL_PASS=contraseña_smtp
```

---

## Seguridad

| Medida | Implementación |
|---|---|
| CORS restringido | Dominios exactos: `efmv.es`, `www.efmv.es`, `api.efmv.es`, `endi-fray.vercel.app` |
| XSS en emails | `escapeHtml()` aplicado a todos los campos del template HTML |
| Body limit | 1 mb — peticiones mayores devuelven HTTP 413 |
| Arranque controlado | El servidor no levanta si MongoDB no está disponible (`process.exit(1)`) |
| Logs de error | Solo activos en entorno `development` |
| Variables de entorno | Validadas al arranque — error explícito si faltan |

---

## Principios aplicados

- **Sin código muerto** — funciones y dependencias eliminadas si no tienen uso real
- **Separación de responsabilidades** — conexión BD, lógica de email y rutas en módulos independientes
- **Fallo rápido** — errores de configuración detienen el proceso en el arranque, no en tiempo de ejecución
- **Mínima superficie de ataque** — body limit ajustado, CORS con whitelist explícita, sin dependencias innecesarias

---

## Estado actual

- [x] API de contacto funcional con persistencia en MongoDB Atlas
- [x] Notificaciones por email vía SMTP IONOS
- [x] Descarga de CV en PDF
- [x] CORS restringido a dominios de producción
- [x] Protección XSS en templates de email
- [x] Arranque condicional a disponibilidad de MongoDB
- [x] Respuestas HTTP semánticamente correctas (400, 413, 500)
- [x] Sin dependencias no utilizadas

---

## Autor

**Endi Fray** · [efmv.es](https://www.efmv.es) · [endifray@efmv.es](mailto:endifray@efmv.es)
