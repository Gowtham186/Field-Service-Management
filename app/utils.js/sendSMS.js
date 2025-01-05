import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export const sendSMS = (phone_number, otp) => {
    const phoneNumber = `+91${phone_number}`
    return client.messages.create({
        body : `Your login otp is ${otp}`, 
        from : process.env.TWILIO_PHONE_NUMBER,
        to : phoneNumber
    })
}
console.log(accountSid)
console.log(authToken)
console.log(process.env.TWILIO_PHONE_NUMBER)