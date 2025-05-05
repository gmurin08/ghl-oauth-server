import { createLocationByToken } from "@/utils/ghl_locations";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { emails, locationId, token } = req.body;

  if (!emails || !locationId || !token) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const data = await createLocationByToken(locationId, token, emails);
    return res.status(200).json({ message: 'Location saved', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
