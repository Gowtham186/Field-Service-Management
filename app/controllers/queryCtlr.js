import Expert from "../models/expert-model.js";
import Customer from "../models/customer-model.js";
import axios from 'axios'
import geolib, { getDistance } from 'geolib'

const queryCtlr = {}

queryCtlr.search = async (req, res) => {
    try {
        const { location, skill } = req.query;
        console.log(location, skill);

        let lat, lng;
        let filteredExperts;

        if(location){
            const existAddress = await Customer.findOne({ 'location.address': location });

            if (!existAddress) {
                const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                    params: { q: location, key: process.env.OPENCAGE_API_KEY }
                });

                if (resource.data.results.length === 0) {
                    return res.status(400).json({ errors: 'Try another address' });
                }

                const geometry = resource.data.results[0].geometry;
                lat = geometry.lat;
                lng = geometry.lng;
                console.log('New Location:', { lat, lng });

            } else {
                const geometry = existAddress.location.coords;
                lat = geometry.lat;
                lng = geometry.lng;
                console.log('Existing Location:', { lat, lng });
            }

            const experts = await Expert.find({'location.coords': { $exists: true }})
                .populate('userId')
                .populate('skills');

            filteredExperts = experts.filter(expert => {
                if (!expert.location.coords || !expert.location.coords.lat || !expert.location.coords.lng) {
                    return false;
                }

                const distance = geolib.getDistance(
                    { latitude: expert.location.coords.lat, longitude: expert.location.coords.lng },
                    { latitude: lat, longitude: lng }
                );

                console.log(`Distance to ${expert.userId.name}: ${distance} meters`);

                return distance <= 10000; // 10 km radius
            });
            console.log(`Filtered Experts by location: ${filteredExperts.length}`);
        }else{
            filteredExperts = await Expert.find().populate('userId').populate('skills')
            //console.log(`Total experts no location filter: ${filteredExperts.length}`)
        }

        // const allSkillIds = filteredExperts.flatMap(expert => expert.skills.map(skill => skill))
        // const uniqueSkillIds = allSkillIds.filter((id, index, self) => self.indexOf(id) === index)
        // const skills = await Skill.find({_id : { $in : uniqueSkillIds}}).select('name')

        
        if(skill){
            filteredExperts = filteredExperts.filter(expert => 
                expert.skills.some(cat =>  cat._id.toString() === skill))
        }
        console.log(`Filtered Experts by location & skill: ${filteredExperts.length}`);
        //console.log(filteredExperts)
            
        res.json({filteredExperts});
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errors: 'Something went wrong' });
        }
};
    
queryCtlr.getAddress = async (req,res)=>{
    try{
        const { lat, lng} = req.query
        const apiKey = process.env.OPENCAGE_API_KEY
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`);
        res.json(response.data.results[0].formatted)
    }catch(err){
        console.log(err)
        return res.status(500).json({ errors: 'Something went wrong' });
    }
}

export default queryCtlr