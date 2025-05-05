// pages/api/me.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ authed: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authed: true });
  } catch {
    return res.status(401).json({ authed: false });
  }
}
