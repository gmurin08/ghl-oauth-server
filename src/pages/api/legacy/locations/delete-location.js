import { deleteLocationById } from '@/utils/ghl_locations';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { locationId } = req.body;
  console.log('!!',locationId)
  if (!locationId) {
    return res.status(400).json({ error: 'Missing locationId' });
  }

  try {
    await deleteLocationById(locationId);
    return res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
