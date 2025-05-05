import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BASE = 'https://services.leadconnectorhq.com';

const HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Version: '2021-07-28',
});


export async function getLocationConfig(locationId) {
  const { data, error } = await supabase
    .from('locations')
    .select('token, emails')
    .eq('location_id', locationId)
    .single();

  if (error || !data) throw new Error('Location config not found');
  return data; // { token, emails }
}

export async function getAllLocations(){
    const {data,error} = await supabase
        .from('locations')
        .select('*')

    if (error||!data) throw new Error('No Locations Found')
    return data
}


export async function getLocationToken(locationId){
    const {data,error} = await supabase
        .from('locations')
        .select('token')
        .eq('location_id', locationId)
        .single()

    if (error || !data){
        throw new Error("No token found for this location")
        //EMAIL ADMIN TO NOTIFY
    }

    return data.token;
}

// export async function createLocationByToken(locationId, token, emails) {
//     const locationData = getCompanyInfoFromGHL(locationId,token)
//     console.log(locationData)
//     const { data, error } = await supabase
//       .from('locations')
//       .upsert(
//         {
//           location_id: locationId,
//           token,
//           emails,
//         },
//         { onConflict: 'location_id' } // ensures it updates if exists
//       );
  
//     if (error) {
//       throw new Error(`Failed to insert location: ${error.message}`);
//     }
  
//     return data;
//   }

export async function createLocationByToken(locationId, token, emails) {
  // Fetch company data from GHL
  console.log(token, "," ,locationId)
  const companyData = await getCompanyInfoFromGHL(locationId, token);
  const name = companyData.location.name || null;

  const { data, error } = await supabase
    .from('locations')
    .upsert(
      {
        location_id: locationId,
        token,
        emails,
        name,
        company_data: companyData, // optionally store entire company object as JSONB
      },
      { onConflict: 'location_id' }
    );

  if (error) {
    throw new Error(`Failed to insert location: ${error.message}`);
  }

  return data;
}

// export async function getLocationInfoById(location_id){
//     const {data, error} = await supabase
//         .from('locations')
//         .select('*')
//         .eq('location_id',location_id)
//         .single()
    
//     if (error || !data){
//         throw new Error("No token found for this location")
//         //EMAIL ADMIN TO NOTIFY
//     }

//     await fetch()
// }

export async function deleteLocationById(location_id) {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('location_id', location_id);

  if (error) {
    console.error('Failed to delete location:', error.message);
    throw error;
  }

  return { success: true, message: 'Location deleted successfully.' };
}

// helpers/getCompanyInfoFromGHL.js
export async function getCompanyInfoFromGHL(companyId, token){
  const url = `${BASE}/locations/${companyId}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: HEADERS(token),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch company info: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
  
    return data;
  } catch (error) {
    console.error('Error in getCompanyInfoFromGHL:', error.message);
    throw error;
  }
};

