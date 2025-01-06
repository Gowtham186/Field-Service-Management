import Skill from "../models/skill-model.js"

const skillValidation = {
    name:{
        in:['body'],
        trim:true,
        exists: { errorMessage : 'skill is required'},
        notEmpty : { errorMessage : 'skill should not be empty'},
        custom : {
            options : async function(value){
                const skill = await Skill.findOne({name : value})
                if(skill){
                    throw new Error('this skill is already exists!')
                }
                return true
            }
        }
    }
}
export default skillValidation