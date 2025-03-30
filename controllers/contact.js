const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

async function contact(req, res) {
    let { nombre_contacto, email_contacto, mensaje_contacto } = req.body;

    // Aplicar trim y sanitización
    nombre_contacto = sanitizeHtml(nombre_contacto?.trim());
    email_contacto = sanitizeHtml(email_contacto?.trim());
    mensaje_contacto = sanitizeHtml(mensaje_contacto?.trim());

    // Validaciones
    if (!nombre_contacto) {
        return res.status(400).json({ msg: "Nombre de contacto obligatorio" });
    }

    if (!email_contacto || !validator.isEmail(email_contacto)) {
        return res.status(400).json({ msg: "Email de contacto inválido" });
    }

    if (!mensaje_contacto) {
        return res.status(400).json({ msg: "Mensaje de contacto obligatorio" });
    }

    if (nombre_contacto.length > 100) {
        return res.status(400).json({ msg: "El nombre es demasiado largo" });
    }
    
    if (mensaje_contacto.length > 1000) {
        return res.status(400).json({ msg: "El mensaje es demasiado largo" });
    }

    // Crea un transporte para Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL_USER,
            pass: process.env.NODEMAILER_EMAIL_PASS,
        },
    });

    try {
        // Configuración del correo
        const mailOptions = {
            from: `Web Consedcity <${process.env.NODEMAILER_EMAIL_USER}>`, // Usar tu propio correo
            replyTo: email_contacto, // Permitir respuestas al remitente real
            to: process.env.NODEMAILER_EMAIL_USER,
            subject: `Web Consedcity - Mensaje de contacto de: ${nombre_contacto}`,
            text: `
                Nombre: ${nombre_contacto}
                Correo: ${email_contacto}
                Mensaje: ${mensaje_contacto}
            `,
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ msg: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Hubo un problema al enviar el correo' });
    }
}

module.exports = {
    contact,
};
