import {Schema,model} from 'mongoose'

const epxertSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    categories:{
        type:[Schema.Types.ObjectId],
        ref : 'Category'
    },
    location:{
        city:String,
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