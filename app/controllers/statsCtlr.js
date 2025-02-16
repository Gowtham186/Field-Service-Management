import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const statsCtlr = {}

statsCtlr.totalRevenue = async(req,res)=>{
    try{
        const payments = await stripe.paymentIntents.list()

        const totalRevenue = payments.data
            .filter(payment => payment.status === 'succeeded')
            .reduce((sum, payment) => sum + payment.amount, 0)
        console.log(totalRevenue / 100)

        res.json({totalRevenue : totalRevenue / 100})
        
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default statsCtlr