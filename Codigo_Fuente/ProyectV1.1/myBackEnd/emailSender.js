const nodemailer = require("nodemailer");

// Configuración del transportador SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "woladolitpoi@gmail.com",
      pass: "terd jnfk zywq ikya",
    },
  });

// Función para enviar correo
const enviarCorreo = async (destinatario, asunto, mensaje) => {
  try {
    const opcionesCorreo = {
      from: 'woladolitpoi@gmail.com', // Remitente
      to: destinatario, // Destinatario
      subject: asunto, // Asunto del correo
      text: mensaje, // Mensaje en texto plano
      // html: "<p>Este es un mensaje en formato HTML</p>", // (opcional) mensaje en HTML
    };

    // Enviar el correo
    const info = await transporter.sendMail(opcionesCorreo);
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};

module.exports = enviarCorreo;

// Llamar la función (ejemplo)
// enviarCorreo(
//   "wmconya@espe.edu.ec",
//   "Hola desde Node.js",
//   "Este es un mensaje enviado desde Node.js usando SMTP y Nodemailer"
// );