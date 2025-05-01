const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

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

    // Configurar transporte SMTP explícitamente
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Cambia de 465 a 587
        secure: false, // false para el puerto 587 (STARTTLS)
        auth: {
            user: process.env.NODEMAILER_EMAIL_USER,
            pass: process.env.NODEMAILER_EMAIL_PASS,
        },
    });

    try {
        const mailOptions = {
            from: `Web Consedcity <${process.env.NODEMAILER_EMAIL_USER}>`,
            replyTo: email_contacto,
            to: process.env.NODEMAILER_EMAIL_USER,
            subject: `Web Consedcity - Mensaje de contacto de: ${nombre_contacto}`,
            text: `Nombre: ${nombre_contacto}\nCorreo: ${email_contacto}\nMensaje: ${mensaje_contacto}`,
        };

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
