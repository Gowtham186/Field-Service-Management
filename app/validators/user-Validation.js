import User from "../models/user-model.js"

export const registerValidation = {
    phone_number : {
        in:['body'],
        exists:{errorMessage : 'phone number is required'},
        notEmpty:{errorMessage : 'phone number should not be empty'},
        custom :{
            options : async function (value) {
                const user = await User.findOne({phone_number: value})
                if(user){
                    throw new Error('phone number is already in use')
                }
                return true
            }
        }
    }
}
export const adminLoginValidation = {
    email:{
        in:['body'],
        trim:true,
        exists: {errorMessage: 'email is required'},
        notEmpty : {errorMessage : 'email should not be empty'},
    },
    password:{
        in:['body'],
        trim:true,
        exists:{errorMessage : 'password is required'},
        notEmpty:{errorMessage : 'password should not be empty'},
        isStrongPassword:{
            options:{
                minLength:8,
                minUppercase:1,
                minLowercase:1,
                minSymbol : 1,
                maxLength : 20
            },errorMessage : 'passwored should contain 1 uppercase 1 lowercase 1 symbol and 8 to 20 characters long'
        }
    }
}