// src/pages/api/view-contacts.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST allowed' });
    }
    const locationId = '3xGyNbyyifHaQaEVS0Sx'
    try {
        console.log(process.env.SUBACCOUNT_ID)
      const response = await fetch(
        `https://services.leadconnectorhq.com/contacts/search`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SUBACCOUNT_TOKEN}`,
            Version:  '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: process.env.SUBACCOUNT_ID,
            query:'',
            "page": 1,
            "pageLimit": 20
          })
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts');
      }
  
      return res.status(200).json({ contacts: data.contacts || data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
  