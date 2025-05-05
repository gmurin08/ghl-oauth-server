import jwt from 'jsonwebtoken';
import Image from 'next/image';
import cookie from 'cookie';
import { useState, useEffect } from 'react';

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return { props: {} };
  } catch {
    return {
      redirect: {
        destination: '/locations/login',
        permanent: false,
      },
    };
  }
}

export default function Locations() {
  const [locationId, setLocationId] = useState('');
  const [token, setToken] = useState('');
  const [emails, setEmails] = useState('');
  const [status, setStatus] = useState(null);
  const [locationsList, setLocationsList] = useState([]);

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch('http://localhost:3001/api/locations/get-all-locations');
      const data = await res.json();
      setLocationsList(data.locations || []);
      
    };

    fetchLocations();
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const emailArray = emails.split(',').map((e) => e.trim()).filter(Boolean);

    const res = await fetch('/api/upsert-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId, token, emails: emailArray }),
    });

    const result = await res.json();

    if (res.ok) {
      setStatus('✅ Location saved successfully');
      setLocationId('');
      setToken('');
      setEmails('');
      // Refresh location list
      const updated = await fetch('/api/locations/get-all-locations');
      const updatedData = await updated.json();
      setLocationsList(updatedData.locations || []);
    } else {
      setStatus(`❌ Error: ${result.error || result.message}`);
    }
  };

  const handleEdit = (loc) => {
    setLocationId(loc.locationId);
    setToken(loc.token);
    setEmails(loc.emails.join(', '));
    setStatus(null);
  };

  const handleDelete = async (locationId) => {
    console.log(locationId)
    if (!confirm('Are you sure you want to delete this location?')) return;

    const res = await fetch('/api/locations/delete-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId }),
    });

    if (res.ok) {
      setLocationsList((prev) => prev.filter((loc) => loc.locationId !== locationId));
    } else {
      alert('Failed to delete location');
    }
  };
  return (
    <>
      <div className="flex justify-center pt-10">
        <Image src="/acd_logo.svg" height={200} width={350} alt="Alder Creek Digital Logo" />
      </div>

      <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow space-y-4">
        <h1 className="text-xl font-semibold">Add / Update GHL Location</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Location ID</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Token</label>
            <textarea
              className="w-full border p-2 rounded"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium">Emails (comma separated)</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Location
          </button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-lg font-semibold mb-4">Saved Locations</h2>
        <table className="w-full border rounded overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Location ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Emails</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locationsList.map((loc) => (
              <tr key={loc.location_id} className="hover:bg-gray-50">
                <td className="p-2 border">{loc.location_id}</td>
                <td className='p-2 border'>{loc.name}</td>
                <td className="p-2 border">{loc.emails.join(', ')}</td>
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(loc)}
                      title="Edit this location"
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(loc.location_id)}
                      title="Delete this location"
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {locationsList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center h-30">
        <button
          onClick={async () => {
            await fetch('/api/logout');
            window.location.href = '/locations/login';
          }}
          className="mt-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Logout
        </button>
      </div>
    </>
  );
}
