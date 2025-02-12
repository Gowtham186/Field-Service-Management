import Stripe from "stripe"
import Payment from "../models/payment-model.js"

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
            success_url : 'http://localhost:3000/success',
            cancel_url : 'http://localhost:3000/failed',
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

export default paymentCtlr