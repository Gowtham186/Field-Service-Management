import Category from "../models/category-model.js"

const categoryValidation = {
    name:{
        in:['body'],
        trim:true,
        exists: { errorMessage : 'category is required'},
        notEmpty : { errorMessage : 'category should not be empty'},
        custom : {
            options : async function(value){
                const category = await Category.findOne({name : value})
                if(category){
                    throw new Error('this category is already exists!')
                }
                return true
            }
        }
    }
}
export default categoryValidation