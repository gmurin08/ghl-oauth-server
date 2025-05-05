import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  const from = `"Alder Creek Digital" <${process.env.SMTP_FROM}>`;

  const mailOptions = {
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
}
