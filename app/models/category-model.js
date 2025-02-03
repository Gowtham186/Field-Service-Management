import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name:{type:String},
    skill : { 
        type : Schema.Types.ObjectId, 
        ref : 'Skill'
    }
}, {timestamps : true})
const Category = model('Category', categorySchema)
export default Category