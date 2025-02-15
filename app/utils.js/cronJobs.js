import cron  from 'node-cron'
import ServiceRequest from '../models/serviceRequest-model.js'

cron.schedule("0 0 * * *", async()=>{
    console.log("Running cron job : Deleting old service")

    const today = new Date()
    today.setHours(0,0,0,0)
    console.log(today)
    try{
        const expiredRequests = await ServiceRequest.find({
            status : "requested",
            scheduleDate : { $lt : today}
        })

        if(expiredRequests.length > 0){
            const updated = await ServiceRequest.updateMany(
                { _id : { $in : expiredRequests.map((req) => req._id)}},
                { $set : { status : 'expired'}}
            )
            console.log(`Marked ${updated.modifiedCount} service requests as expired.`);
        }else{
            console.log("No service requests to expire today.");
        }
    }catch(err){
        console.log(err)
    }
})