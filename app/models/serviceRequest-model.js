import { Schema, model} from 'mongoose'

const serviceRequestSchema = new Schema({
    serviceType :[
        {
            category : { type: Schema.Types.ObjectId, ref : 'Category', },
            servicesChoosen : [{type:Schema.Types.ObjectId, ref : 'Service'}]
        }
    ],
    description : String,
    location : { 
        address : String,   
        city : String,
        coords:Object
    },
    scheduleDate : { type : Date},
    budget:{
        bookingFee : Number,
        servicesPrice : Number,
        finalPrice : Number
    },
    serviceImages : [ 
        {
            pathName : String,
            originalName : String  
        }
    ],
    customerId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    expertId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    status : {
        type : String,
        enum : ['requested', 'assigned', 'in-progress', 'completed', 'cancelled'],
        default : 'requested'
    },
    onSiteServices : {
        type: [
            { 
                serviceName : String,
                price : Number
            }
        ],
        default : []
    },
    completionDate : { type : Date }
}, { timestamps : true})
const ServiceRequest = model('ServiceRequest', serviceRequestSchema)
export default ServiceRequest