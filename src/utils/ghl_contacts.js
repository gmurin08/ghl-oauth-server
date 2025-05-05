import { getLocationToken } from "./ghl_locations";
const BASE = 'https://services.leadconnectorhq.com';

const HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Version: '2021-07-28',
});

export async function findContactByEmail(locationId, email) {
  const token = await getLocationToken(locationId)
  const res = await fetch(`${BASE}/contacts/search`, {
    method: 'POST',
    headers: HEADERS(token),
    body: JSON.stringify({
      locationId,
      query: email,
      page: 1,
      pageLimit: 1,
    }),
  });

  const data = await res.json();
  console.log(data)
  return data.contacts?.[0] || null;
}

export async function createContact(locationId, contactData) {
  const token = await getLocationToken(locationId)
  const res = await fetch(`${BASE}/contacts/`, {
    method: 'POST',
    headers: HEADERS(token),
    body: JSON.stringify({ locationId, ...contactData }),
  });

  if (!res.ok) throw new Error('Failed to create contact');
  return res.json();
}

export async function updateContact(locationId, contactId, updateData) {
  const res = await fetch(`${BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: HEADERS(process.env.GHL_API_KEY),
    body: JSON.stringify({ locationId, ...updateData }),
  });

  if (!res.ok) throw new Error('Failed to update contact');
  return res.json();
}

export async function deleteContact({ contactId, token }) {
  const res = await fetch(`${BASE}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }

  return res.json();
}
