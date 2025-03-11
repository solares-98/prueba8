const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    console.log("Datos recibidos en el backend:", req.body);

    const { name, email, phone, attending } = req.body;
    
    // Validación rápida de datos
    if (!name || !email || !phone || !attending) {
      throw new Error("Datos faltantes en la solicitud.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const messageContent = `Hola, confirmo mi asistencia a la boda. Mi nombre es: ${name}, mi correo: ${email} y este sería mi número en caso de comunicarse conmigo: ${phone}.`;

    const htmlContent = `
      <div style="font-family: 'Josefin Slab', serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #dddddd;">
              <div style="background-image: url('https://your-image-url.com/background.jpg'); background-size: cover; padding: 30px; border-radius: 10px;">
                  <h1 style="color: #ff6f61; font-family: 'Lancelot', cursive; font-size: 2.5em;">Alejandra y Roberto</h1>
                  <p style="color: #555555; font-size: 1.2em;">Hola <strong>${name}</strong>,</p>
                  <p style="color: #555555;">Nos complace invitarte a la boda de <strong>Alejandra y Roberto</strong>.</p>
                  <p style="color: #555555;"><strong>Fecha:</strong> 24 de Mayo de 2025</p>
                  <p style="color: #555555;"><strong>Ceremonia religiosa:</strong> Parroquia del Sagrado Corazón de Jesús, Calle Gil Preciado NO.11, Zona Centro, Tecolotlán Jal.</p>
                  <p style="color: #555555;"><strong>Evento social:</strong> Terraza las Palmas, Calle Roble NO.28, CP.48540 Tecolotlán, Jal.</p>
                  <p style="color: #555555; font-size: 1.1em;">¡Nos gustaria contar con tu valiosa presencia!</p>
              </div>
              <img src="https://your-image-url.com/footer-image.jpg" alt="Decorative Image" style="max-width: 100%; border-radius: 10px;">
          </div>
      </div>
    `;

    // Verificamos antes de enviar el correo
    console.log("Enviando correo a:", email);

    await transporter.sendMail({
      from: '"Boda de Alejandra y Roberto" <tu_correo@gmail.com>',
      to: email,
      subject: "Confirmación de Asistencia - Boda de Alejandra y Roberto",
      html: htmlContent
    });

    console.log("Correo enviado con éxito a:", email);

    // Generar enlace de WhatsApp
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER?.replace(/^\+/, "");
    if (!adminNumber) {
      throw new Error("Número de WhatsApp no configurado.");
    }

    const whatsappLink = "https://wa.me/" + adminNumber + "?text=" + encodeURIComponent(messageContent);
    console.log("Enlace de WhatsApp generado:", whatsappLink);

    return res.status(200).json({
      message: "Correo enviado y enlace de WhatsApp generado correctamente.",
      whatsappLink
    });

  } catch (error) {
    console.error("Error en el backend:", error);
    return res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
};