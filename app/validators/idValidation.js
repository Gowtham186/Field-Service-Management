const idValidation = {
    id:{
        in:['params'],
        isMongoId:{ 
            errorMessage : 'Invalid id format'
        },
        optional : { options : { nullable : true}}
    },
    categoryId:{
        in:['params'],
        isMongoId:{ 
            errorMessage : 'Invalid categoryId format'
        },
        optional : { options : { nullable : true}}
    },
    serviceId:{
        in:['params'],
        isMongoId:{ 
            errorMessage : 'Invalid serviceid format'
        },
        optional : { options : { nullable : true}}
    },
    
}
export default idValidation