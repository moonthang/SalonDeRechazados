import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const { EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } = process.env;
    const toEmail = process.env.EMAIL_TO || 'elsalonderechazados@gmail.com';

    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
      return NextResponse.json({ error: 'El servicio de correo no está configurado correctamente en el servidor.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Salón de Rechazados" <${EMAIL_SERVER_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de: ${name}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
