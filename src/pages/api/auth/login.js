import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400`);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
