const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // o tu servidor SMTP
  port: 587,
  secure: false,
  auth: {
    user: 'tu_email@gmail.com',
    pass: 'tu_contraseña_o_clave_de_aplicacion'
  }
});

module.exports = transporter; 