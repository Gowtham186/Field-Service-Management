import { Schema, model} from 'mongoose'

const locationSchema = new Schema({
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});
const Location = model("Location", locationSchema)
export default Location
    