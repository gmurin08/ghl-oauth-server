// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getLocationToken } from "@/utils/ghl_locations";
import { findContactByEmail } from "@/utils/ghl_contacts";

export default async function handler(req, res) {
  const token = await getLocationToken(req.query.location_id)
  console.log('~~!!!TOKEN',token)
  const contact = await findContactByEmail(token,'gino@email.com')
  res.status(200).json({contact:contact})
}
