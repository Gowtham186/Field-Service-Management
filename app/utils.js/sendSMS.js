import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSMS = async (phone_number, otp) => {
    try {
        const phoneNumber = `+91${phone_number}`;
        console.log(phoneNumber)

        const message = await client.messages.create({
            body: `Your login OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, 
            to: phoneNumber
        });

        console.log(`✅ OTP sent successfully to ${phoneNumber}: ${message.sid}`);
        return message; // Return message object for debugging if needed
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        throw new Error("Failed to send OTP. Please try again.");
    }
};
