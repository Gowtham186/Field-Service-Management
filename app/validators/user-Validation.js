import User from "../models/user-model.js"

export const customerLoginValidation = {
    phone_number : {
        in:['body'],
        exists:{errorMessage : 'phone number is required'},
        notEmpty:{errorMessage : 'phone number should not be empty'},
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

export const expertRegisterValidation = {
    name:{
        in:['body'],
        trim:true,
        exists:{errorMessage: 'name is required'},
        notEmpty:{errorMessage: 'name should not be empty'},
        matches:{
            options:[/^[^\d].*/],
            errorMessage:'name should not start with number'
        },
        custom: {
            options : async function(value){
                const user = await User.findOne({name:value})
                if(user){
                    throw new Error('name is already taken')
                }
            }
        }
    },
    email:{
        in:['body'],
        trim:true,
        exists:{errorMessage: 'email is required'},
        notEmpty: {errorMessage: 'email should not be empty'},
        isEmail: {errorMessage: 'invalid email format'},
        custom:{
            options: async function(value) {
                const user = await User.findOne({email : value})
                if(user){
                    throw new Error('email already exists')
                }
                return true
            }
        }
    },
    phone_number:{
        in:['body'],
        trim:true,
        exists:{errorMessage: 'phone number is required'},
        notEmpty: {errorMessage: 'phone number should not be empty'},
        isLength:{
            options:{ min : 10, max : 10},
            errorMessage : 'phone number should have 10 digits'
       },
       custom:{
        options: async function(value) {
            const user = await User.findOne({phone_number : value})
            if(user){
                throw new Error('phone number is already in use')
            }
        }
       }
    },
    password:{
        in:['body'],
        trim:true,
        exists:{errorMessage: 'password is required'},
        notEmpty: {errorMessage: 'password should not be empty'},
        isStrongPassword:{
            options:{
                minLength : 8,
                minLowercase : 1,
                minUppercase : 1,
                minSymbol : 1,
                minNumber : 1
            },
            errorMessage: 'password contain atleast 1 uppercase, 1 lowercase, 1 number, 1 symbol and must be minimum 8 characters'
        },
    }
}