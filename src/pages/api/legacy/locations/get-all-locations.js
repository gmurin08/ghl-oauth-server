import { getAllLocations } from "@/utils/ghl_locations"
export default async function handler(req,res){
    if (req.method !== 'GET'){
        return res.status(405).json('GET only')
    }

    try {
        const locations = await getAllLocations()
        return res.status(200).json({locations:locations})
    } catch (err) {
        console.error(err)
        return res.status(500).json({error:err.message})
    }
}