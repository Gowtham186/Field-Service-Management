import {Schema,model} from 'mongoose'

const epxertSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    profilePic : { type : String},
    age:Number,
    gender:{
        type:String,
    },
    skills:{
        type:[
            {
                type : Schema.Types.ObjectId,
                ref : 'Skill',
            }
        ],
        default : []
    },
    location:{
        city : String,
        address:String,
        coords:Object
    },
    experience : { type: Number},
    documents: {
        type: [
            {
                pathName: { type: String, required: true },
                type: { type: String, required: true },
                isVerified: { type: String, default: "pending" }
            }
        ],
        default: []
    },    
    availability:{
        type:[
            {
                date:Date,
                serviceId: { type : Schema.Types.ObjectId, ref : 'ServiceRequest'},
                _id : false
            }
        ],
        default:[]
    },
    isPremium: {
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    }
}, {timestamps: true})

const Expert = model('Expert', epxertSchema)
export default Expert