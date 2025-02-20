import Stripe from "stripe"
import Payment from "../models/payment-model.js"
import Expert from "../models/expert-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import { io } from "../../index.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const paymentCtlr = {}

paymentCtlr.payServiceFee = async (req, res) => {
    const { serviceRequestId, expertId, amount } = req.body;
    console.log({ serviceRequestId, expertId, amount });

    try {
        // Fetch the expert's Stripe account
        const expert = await Expert.findOne({ userId: expertId });
        if (!expert || !expert.stripeAccountId) {
            return res.status(400).json({ errors: "Expert Stripe account not found" });
        }

        // Split the amount
        const systemShare = Math.round(amount * 0.10); // 10% for platform
        const expertShare = Math.round(amount * 0.90); // 90% for expert

        const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

        // Create a Stripe customer
        let customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: "India",
                postal_code: "639006",
                city: "Karur",
                state: "TN",
                country: "US",
            },
        });

        console.log("Customer Created:", customer.id);

        // Create a Checkout Session with correct split
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/payment/failed`,
            customer: customer.id,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: { name: "Service Fee" },
                        unit_amount: amount * 100, // Convert to paise
                    },
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                application_fee_amount: systemShare * 100, // Platform's 10%
                transfer_data: {
                    destination: expert.stripeAccountId, // Only set destination
                },
            },
            metadata: {
                serviceRequestId,
                expertId,
                paymentReason: "service",
            },            
        });

        console.log("Session ID:", session.id);
        console.log("Session URL:", session.url);

        // Save Payment Details to DB
        const payment = new Payment({
            serviceRequestId,
            expertId,
            // customerId : req.currentUser.userId,
            transactionId: session.id,
            paymentReason: "service",
            paymentType: "card",
            amount,
            systemAmount: systemShare,
            expertAmount: expertShare,
            status: "pending",
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

paymentCtlr.payBookingFee = async (req, res) => {
    const body = req.body;
    console.log(body);

    try {
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: "India",
                postal_code: "639006",
                city: "Karur",
                state: "TN",
                country: "US",
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "booking-fee",
                        },
                        unit_amount: body.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/my-bookings",
            cancel_url: "http://localhost:3000/payment/failed",
            customer: customer.id,
            payment_intent_data: {
                capture_method: "automatic",
            },
            metadata: {
                serviceRequestId: body.serviceRequestId,
                paymentReason: "booking",
            },            
        });

        console.log("Session ID:", session.id);
        console.log("Session URL:", session.url);

        const serviceRequest = await ServiceRequest.findById(body.serviceRequestId);
        console.log("Service Request:", serviceRequest);

        if (serviceRequest.expertId) {
            io.to(`expert-${serviceRequest.expertId}`).emit("bookingStatusUpdated", {
                userType: "expert",
                booking: serviceRequest,
            });
        }

        const payment = new Payment({
            serviceRequestId: body.serviceRequestId,
            transactionId: session.id, // Store session ID (not payment_intent)
            paymentReason: "booking",
            paymentType: "card",
            amount: body.amount,
            customerId: serviceRequest.customerId,
            paymentStatus: "pending", // Set default status to pending
        });

        await payment.save();

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error("Error in payBookingFee:", err);
        res.status(500).json({ error: "Payment processing failed" });
    }
};

// paymentCtlr.webhooks = async (req, res) => {
//     const signature = req.headers["stripe-signature"];
//     console.log("Stripe Signature:", signature);

//     try {
//         const event = stripe.webhooks.constructEvent(
//             req.body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );

//         const session = event.data.object;
//         console.log("Webhook Session Object:", session);

//         const sessionId = session.id; // Initially stored session ID
//         const paymentIntentId = session.payment_intent || session.id; // Get actual transaction ID

//         console.log(`Received event: ${event.type}, Session ID: ${sessionId}, Payment Intent: ${paymentIntentId}`);

//         // Find the payment record using session ID (fallback to paymentIntentId)
//         let payment = await Payment.findOne({
//             $or: [{ transactionId: sessionId }, { transactionId: paymentIntentId }],
//         });

//         if (!payment) {
//             console.log("Payment record not found");
//             return res.status(404).send("Payment record not found");
//         }

//         if (!payment.transactionId && paymentIntentId) {
//             // If transactionId is missing, update it
//             payment.transactionId = paymentIntentId;
//         }

//         const serviceRequest = await ServiceRequest.findById(payment.serviceRequestId);
//         if (!serviceRequest) {
//             console.log("Service request not found");
//             return res.status(404).send("Service request not found");
//         }

//         if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
//             payment.paymentStatus = "success";
//             await payment.save();
//             console.log("Payment successful, updated record");

//             serviceRequest.status = "assigned"
//             await serviceRequest.save()
//             console.log('updated status', serviceRequest)

//             io.to(`customer-${payment.customerId}`).emit("paymentStatusUpdated", {
//                 userType: "customer",
//                 payment: payment,
//             });
//             console.log('emitting...')

//             io.to(`customer-${serviceRequest.customerId}`).emit("bookingStatusUpdated", {
//                 userType: "customer",
//                 booking: serviceRequest, // Send the full updated booking object
//             });
            
//             if (serviceRequest.expertId) {
//                 io.to(`expert-${serviceRequest.expertId}`).emit("bookingStatusUpdated", {
//                     userType: "expert",
//                     booking: serviceRequest, // Send the full updated booking object
//                 });
//             } 

//             return res.status(200).send("Payment processed successfully");
//         } else if (event.type === "payment_intent.payment_failed" || event.type === "checkout.session.expired") {
//             payment.paymentStatus = "failed";
//             payment.failure_reason = session.last_payment_error?.message || "Payment failed";
//             await payment.save();
//             console.log("Payment failed, updated record");

//             io.to(`customer-${payment.customerId}`).emit("paymentStatusUpdated", {
//                 userType: "customer",
//                 payment: payment,
//             });

//             return res.status(400).send("Payment failed");
//         } else {
//             return res.status(400).send("Unhandled event type");
//         }
//     } catch (err) {
//         console.error("Webhook error:", err);
//         return res.status(400).send(`Webhook error: ${err.message}`);
//     }
// };

paymentCtlr.webhooks = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    console.log("Stripe Signature:", signature);

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        const session = event.data.object;
        console.log("Webhook Session Object:", session);

        const sessionId = session.id; // Initially stored session ID
        const paymentIntentId = session.payment_intent || session.id; // Get actual transaction ID

        console.log(`Received event: ${event.type}, Session ID: ${sessionId}, Payment Intent: ${paymentIntentId}`);

        // Extract payment reason from metadata
        const paymentReason = session.metadata?.paymentReason || "service"; // Default to "service" if not provided
        console.log("Payment Reason:", paymentReason);

        // Find the payment record using session ID (fallback to paymentIntentId)
        let payment = await Payment.findOne({
            $or: [{ transactionId: sessionId }, { transactionId: paymentIntentId }],
        });

        if (!payment) {
            console.log("Payment record not found");
            return res.status(404).send("Payment record not found");
        }

        if (!payment.transactionId && paymentIntentId) {
            // If transactionId is missing, update it
            payment.transactionId = paymentIntentId;
        }

        const serviceRequest = await ServiceRequest.findById(payment.serviceRequestId);
        if (!serviceRequest) {
            console.log("Service request not found");
            return res.status(404).send("Service request not found");
        }

        if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
            payment.paymentStatus = "success";
            await payment.save();
            console.log("Payment successful, updated record");

            // Update the service request status based on payment reason
            if (paymentReason === "service") {
                serviceRequest.status = "paid"; // Full service payment
            } else if (paymentReason === "bookingFee") {
                serviceRequest.status = "assigned"; // Only booking fee paid
            }

            await serviceRequest.save();
            console.log("Updated service request status:", serviceRequest.status);

            io.to(`customer-${payment.customerId}`).emit("paymentStatusUpdated", {
                userType: "customer",
                payment: payment,
            });

            io.to(`customer-${serviceRequest.customerId}`).emit("bookingStatusUpdated", {
                userType: "customer",
                booking: serviceRequest, // Send the full updated booking object
            });

            if (serviceRequest.expertId) {
                io.to(`expert-${serviceRequest.expertId}`).emit("bookingStatusUpdated", {
                    userType: "expert",
                    booking: serviceRequest, // Send the full updated booking object
                });
            }

            return res.status(200).send("Payment processed successfully");
        } else if (event.type === "payment_intent.payment_failed" || event.type === "checkout.session.expired") {
            payment.paymentStatus = "failed";
            payment.failure_reason = session.last_payment_error?.message || "Payment failed";
            await payment.save();
            console.log("Payment failed, updated record");

            io.to(`customer-${payment.customerId}`).emit("paymentStatusUpdated", {
                userType: "customer",
                payment: payment,
            });

            return res.status(400).send("Payment failed");
        } else {
            return res.status(400).send("Unhandled event type");
        }
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }
};

export default paymentCtlr