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

        const systemShare = Math.round(amount * 0.10); 
        const expertShare = Math.round(amount * 0.90); 

        const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

        // Create a Stripe customer (if not already created)
        const customer = await stripe.customers.create({
            name : 'Testing',
            address : {
                line1 : 'India',
                postal_code : '639006',
                city : 'Karur',
                state : 'TN',
                country : 'US'
            }
        });
        console.log("Customer Created:", customer.id);

        // Create a PaymentIntent with revenue sharing
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, 
            currency: "inr",
            payment_method_types: ["card"],
            customer: customer.id, 
            application_fee_amount: systemShare * 100,
            transfer_data: {
                destination: expert.stripeAccountId 
            },
            metadata: {
                serviceRequestId,
                expertId
            }
        });

        console.log("Payment Intent ID:", paymentIntent.id);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/payment/failed`,
            customer: customer.id, 
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: { name: "Service Fee" },
                    unit_amount: amount * 100
                },
                quantity: 1
            }],
            payment_intent_data: {
                metadata: {
                    serviceRequestId,
                    expertId
                }
            },
            client_reference_id: paymentIntent.id 
        });

        console.log("Session ID:", session.id);
        console.log("Session URL:", session.url);

        const payment = new Payment({
            serviceRequestId,
            expertId,
            customerId: customer.id,
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

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["payment_intent", "line_items"], 
        });

        if (!session) {
            return res.status(404).json({ error: "Payment session not found" });
        }

        const amount = session.amount_total || (session.line_items?.data[0]?.amount_total ?? 0);
        const status = session.payment_status || session.payment_intent?.status || "unknown";

        const paymentRecord = await Payment.findOneAndUpdate(
            { transactionId : session_id},
            { paymentStatus : status === 'paid' ? 'success' : 'failed'},
            { new : true }
        )
        console.log(paymentRecord)

        console.log({
            transactionId: session.id,
            amount: amount,
            currency: session.currency,
            status: status,
            serviceRequestId : paymentRecord.serviceRequestId
        })
        
        res.json({
            transactionId: session.id,
            amount: amount,
            currency: session.currency,
            status: status,
            serviceRequestId : paymentRecord.serviceRequestId
        });
    } catch (err) {
        console.error("Error fetching session:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export default paymentCtlr