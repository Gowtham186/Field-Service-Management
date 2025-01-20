import Service from "../models/service-model.js"

const serviceValidation = {
    serviceName:{
        in:['body'],
        trim:true,
        exists: { errorMessage : 'serviceName is required'},
        notEmpty: { errorMessage : 'serviceName should not be empty'},
        custom :{
            options : async function(value){
                const service = await Service.findOne({serviceName : value})
                if(service){
                    throw new Error('service is already exists')
                }
                return true
            }
        }
    },
    price : {
        in:['body'],
        trim:true,
        exists : {errorMessage : 'price is required'},
        notEmpty : {errorMessage : 'price should not be empty'},
        isFloat:{
            options: { min : 0},
            errorMessage :  'price should be greater than 1'
        }
    }   
}
export default serviceValidation