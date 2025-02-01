import { model, Schema } from "mongoose";

const skillSchema = new Schema({
    name: String,
})
const Skill = model('Skill', skillSchema)
export default Skill