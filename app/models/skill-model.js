import { Schema, model } from "mongoose";

const skillSchema = new Schema({
    name:{
        type:String
    }
}, {timestamps : true})
const Skill = model('Skill', skillSchema)
export default Skill