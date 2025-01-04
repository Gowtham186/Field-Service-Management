import mongoose from "mongoose";

const configureDb = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
    }catch(err){
        console.log(err)
    }
}
export default configureDb