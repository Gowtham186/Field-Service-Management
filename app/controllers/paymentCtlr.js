import Stripe from "stripe"
import Payment from "../models/payment-model.js"
import Expert from "../models/expert-model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const paymentCtlr = {}

paymentCtlr.payBookingFee = async(req,res)=>{
    const body = req.body
    console.log(body)
    try{    
        const customer = await stripe.customers.create({
            name : 'Testing',
            address : {
                line1 : 'India',
                postal_code : '639006',
                city : 'Karur',
                state : 'TN',
                country : 'US'
            }
        })
        // console.log(customer)

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            line_items : [{
                price_data:{
                    currency : 'inr',
                    product_data : {
                        name : 'booking-fee'
                    },
                    unit_amount : body.amount * 100
                },
                quantity : 1
            }],
            mode : 'payment',
            success_url : 'http://localhost:3000/payment/success',
            cancel_url : 'http://localhost:3000/paymentfailed',
            customer : customer.id
        })
        console.log(session.id)
        console.log(session.url)

        const payment = new Payment(body)
        payment.serviceRequestId = body.serviceRequestId,
        payment.transactionId = session.id,
        payment.paymentReason = 'booking',
        payment.paymentType = 'card',
        payment.amount = body.amount

        await payment.save()
        console.log(payment)
        res.json({id: session.id, url : session.url})
    }catch(err){
        console.log(err)
    }
}

// paymentCtlr.payServiceFee = async (req, res) => {
//     const { serviceRequestId, expertId, amount } = req.body;
//     try {
//         const expert = await Expert.findById(expertId);
//         if (!expert || !expert.stripeAccountId) {
//             return res.status(400).json({ errors: "Expert Stripe account not found" });
//         }

//         // Split amounts
//         const systemShare = Math.round(amount * 0.10); // 10%
//         const expertShare = Math.round(amount * 0.90); // 90%

//         // Create Stripe Checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [{
//                 price_data: {
//                     currency: "inr",
//                     product_data: { name: "Service Fee" },
//                     unit_amount: amount * 100
//                 },
//                 quantity: 1
//             }],
//             mode: "payment",
//             success_url: "http://localhost:3000/success",
//             cancel_url: "http://localhost:3000/failed",
//         });

//         console.log("Session ID:", session.id);
//         console.log("Session URL:", session.url);

//         // Save payment details
//         const payment = new Payment({
//             serviceRequestId,
//             expertId,
//             transactionId: session.id,
//             paymentReason: "service",
//             paymentType: "card",
//             amount,
//             systemAmount: systemShare,
//             expertAmount: expertShare
//         });

//         await payment.save();
//         console.log(payment);

//         res.json({ id: session.id, url: session.url });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ errors: "Something went wrong" });
//     }
// };

// paymentCtlr.payServiceFee = async (req, res) => {
//     const { serviceRequestId, expertId, amount } = req.body;
//     console.log({serviceRequestId, expertId, amount})
//     try {
//         const expert = await Expert.findOne({ userId : expertId})
//         console.log(expert)
//         if (!expert || !expert.stripeAccountId) {
//             return res.status(400).json({ errors: "Expert Stripe account not found" });
//         }

//         // Split amounts
//         const systemShare = Math.round(amount * 0.10); // 10%
//         const expertShare = Math.round(amount * 0.90); // 90%

//         // Define success and failed URLs dynamically
//         const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

//         // Create Stripe Checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [{
//                 price_data: {
//                     currency: "inr",
//                     product_data: { name: "Service Fee" },
//                     unit_amount: amount * 100
//                 },
//                 quantity: 1
//             }],
//             mode: "payment",
//             success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,  
//             cancel_url: `${BASE_URL}/payment/failed`,
//         });
        

//         console.log("Session ID:", session.id);
//         console.log("Session URL:", session.url);

//         // Save payment details
//         const payment = new Payment({
//             serviceRequestId,
//             expertId,
//             transactionId: session.id,
//             paymentReason: "service",
//             paymentType: "card",
//             amount,
//             systemAmount: systemShare,
//             expertAmount: expertShare
//         });

//         await payment.save();
//         console.log(payment);

//         res.json({ id: session.id, url: session.url });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ errors: "Something went wrong" });
//     }
// };
paymentCtlr.payServiceFee = async (req, res) => {
    const { serviceRequestId, expertId, amount } = req.body;
    console.log({ serviceRequestId, expertId, amount });

    try {
        // Fetch the expert's Stripe account
        const expert = await Expert.findOne({ userId: expertId });
        console.log(expert);

        if (!expert || !expert.stripeAccountId) {
            return res.status(400).json({ errors: "Expert Stripe account not found" });
        }

        // Split amounts
        const systemShare = Math.round(amount * 0.10); // 10% Platform fee
        const expertShare = Math.round(amount * 0.90); // 90% Expert earnings

        // Define success and failed URLs dynamically
        const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

        // Create Stripe Checkout session with automatic revenue sharing
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/payment/failed`,
            line_items: [{
                price_data: {
                    currency: "inr", // Ensure payment is in INR
                    product_data: { name: "Service Fee" },
                    unit_amount: amount * 100 // Convert to paise
                },
                quantity: 1
            }],
            payment_intent_data: {  
                // application_fee_amount: systemShare * 100, // 10% platform fee
                transfer_data: {
                    destination: expert.stripeAccountId,
                    amount : expertShare * 100
                }
            }
        });

        console.log("Session ID:", session.id);
        console.log("Session URL:", session.url);

        // Save payment details in the database
        const payment = new Payment({
            serviceRequestId,
            expertId,
            transactionId: session.id,
            paymentReason: "service",
            paymentType: "card",
            amount,
            systemAmount: systemShare,
            expertAmount: expertShare,
            status: "pending"
        });

        await payment.save();
        console.log(payment);

        res.json({ id: session.id, url: session.url });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ errors: "Something went wrong" });
    }
};



paymentCtlr.getPaymentDetails = async (req, res) => {
    const { session_id } = req.query;

    try {
        if (!session_id) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        // Retrieve session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session) {
            return res.status(404).json({ error: "Payment session not found" });
        }

        // Return relevant payment details
        res.json({
            transactionId: session.id,
            amount: session.amount_total,
            currency: session.currency,
            status: session.payment_status,
        });
    } catch (err) {
        console.error("Error fetching session:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


export default paymentCtlr