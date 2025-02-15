import cron from 'node-cron'
import Expert from '../models/expert-model.js'

cron.schedule("0 0 * * *", async()=>{
    console.log("Running cron job : Cleaning up past avaialability dates")

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    try{
        const experts = await Expert.find({ availability : { $exists : true, $ne : []} })

        for(const expert of experts){
            const updatedAvailability = expert.availability.filter(date => new Date(date) >= today)

            if(updatedAvailability.length !== expert.availability.length){
                expert.availability = updatedAvailability
                await expert.save()
                console.log(`✅ Updated availability for Expert ID: ${expert._id}`);
            }
        }
        console.log("🟢 Cron job completed: Past availability dates removed.");
    }catch(err){
        console.log("❌ Error in cron job:", err);
    }
})