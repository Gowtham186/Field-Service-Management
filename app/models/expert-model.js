import {Schema,model} from 'mongoose'

const epxertSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        //ref:'User'
    },
    skills:{
        type:[Schema.Types.ObjectId],
        //ref : 'Skills'
    },
    location:{
        city:String,
        state:String,
        country:String
    },
    experience : { type: Number},
    documents:{
        type:[
            {
                pathName:String,
                type:String,
                isVerified:String
            }
        ],
        default:[]
    },
    availability:{
        type:[
            {
                date:Date,
                isAvailable:Boolean,
            }
        ],
        default:[]
    },
    myServices:{
        type:[Schema.Types.ObjectId],
        //ref:'Service'
        default:[]
    },
    feedbacks:{
        type:[Schema.Types.ObjectId],
        //ref:'Service',
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