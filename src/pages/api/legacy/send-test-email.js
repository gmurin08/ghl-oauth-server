import { sendEmail } from '@/utils/sendEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST only' });
  }

  const { to, name = 'Test User', phone = '555-123-4567' } = req.body;

  if (!to) {
    return res.status(400).json({ message: 'Missing recipient email' });
  }

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const logoUrl = `${baseUrl}/acd_logo.svg`;

const html = `
  <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto;">
    <h2>New Lead from Website</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${to}</p>
    <p><strong>Phone:</strong> ${phone}</p>

    <hr style="margin: 30px 0;" />

    <footer style="text-align: center; font-size: 13px; color: #777;">
      <p>Sent by <strong>Alder Creek Digital</strong></p>
      <img
        src="${logoUrl}"
        alt="ACD Logo"
        style="height: 40px; margin-top: 10px;"
      />
    </footer>
  </div>
`;

  const result = await sendEmail({
    to,
    subject: '🚀 New Customer Request',
    html,
  });

  if (result.success) {
    return res.status(200).json({ message: 'Email sent successfully', info: result.info });
  }

  return res.status(500).json({ message: 'Failed to send email', error: result.error });
}
