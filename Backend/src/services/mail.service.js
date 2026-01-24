import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // 🔴 Gmail con 587 SIEMPRE false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔑 evita errores TLS locales
  },
});

// 🔍 Verificación real al iniciar el backend
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error al conectar con SMTP:", error.message);
  } else {
    console.log("📧 SMTP listo para enviar correos");
  }
});

export async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("📨 Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error enviando correo:", error.message);
    throw new Error("No se pudo enviar el correo");
  }
}
