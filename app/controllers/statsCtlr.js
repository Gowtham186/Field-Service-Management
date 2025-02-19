import Stripe from "stripe"
import Expert from "../models/expert-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import Payment from "../models/payment-model.js"
import dayjs from 'dayjs'
import Service from "../models/service-model.js"

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


statsCtlr.expertRevenue = async(req,res)=>{
    const { id } = req.params
    try{
        const expertPayments = await Payment.find({ expertId: id })
    
        const expertServiceRequests = await Payment.find({ expertId: id }).select("serviceRequestId");
        console.log(expertServiceRequests.length)
        const serviceRequestIds = expertServiceRequests.map(payment => payment.serviceRequestId);

        // Fetch Service Requests and populate serviceType (Category)
        const serviceRequests = await ServiceRequest.find({ _id: { $in: serviceRequestIds } })
            .populate({
                path: "serviceType.category",
                model: "Category",
                select: "name", // ✅ Get only category name
            })
            .populate({
                path: "serviceType.servicesChoosen",
                model: "Service",
                select: "serviceName price", // ✅ Get service details
            });
        
        // console.log(JSON.stringify(serviceRequests, null, 2)); // ✅ Check structured output

        const revenueByCategory = {};

        serviceRequests.forEach(request => {
            request.serviceType.forEach(service => {
                const categoryName = service.category.name;

                service.servicesChoosen.forEach(serviceItem => {
                    const price = serviceItem.price;

                    if (!revenueByCategory[categoryName]) {
                        revenueByCategory[categoryName] = 0;
                    }
                    revenueByCategory[categoryName] += price;
                });
            });
        });

        console.log(revenueByCategory); 

        const totalRevenue  = expertPayments
            .map(ele => ele.expertAmount)
            .reduce((acc, cv)=> acc + cv ,0)
        console.log("totalRevenue", totalRevenue)

        return res.json({
            totalRevenue,
            totalBookings : expertServiceRequests.length,
            payments : expertPayments,
            categoriesRevenue : revenueByCategory
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

// statsCtlr.expertBookingsAnalytics = async(req,res)=>{
//     const { id } = req.params
//     try{
//         const expertBookings = await ServiceRequest.find({expertId : id})
//         // console.log(expertBookings)
//         res.json({
//             totalBookings : expertBookings.length,
//             bookings : expertBookings
//         })
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({errors : 'something went wrong'})
//     }
// }

// statsCtlr.expertBookingsAnalytics = async (req, res) => {
//     const { id } = req.params;
//     const { period } = req.query; 
  
//     try {
//       const getStartDate = (period, offset = 0) => {
//         switch (period) {
//           case "day":
//             return dayjs().subtract(offset, "day").startOf("day").toDate();
//           case "week":
//             return dayjs().subtract(offset, "week").startOf("week").toDate();
//           case "month":
//             return dayjs().subtract(offset, "month").startOf("month").toDate();
//           case "year":
//             return dayjs().subtract(offset, "year").startOf("year").toDate();
//           default:
//             return dayjs().subtract(offset, "month").startOf("month").toDate();
//         }
//       };
  
//       // Get start dates for current and previous periods
//       const currentStartDate = getStartDate(period);
//       const previousStartDate = getStartDate(period, 1);
  
//       // Fetch expert's total bookings
//       const totalBookings = await ServiceRequest.countDocuments({ expertId: id });
  
//       // Fetch bookings for current and previous period in one query
//       const [currentBookings, previousBookings] = await Promise.all([
//         ServiceRequest.countDocuments({ expertId: id, createdAt: { $gte: currentStartDate } }),
//         ServiceRequest.countDocuments({ expertId: id, createdAt: { $gte: previousStartDate, $lt: currentStartDate } })
//       ]);
  
//       // Calculate growth percentage
//       const growth = previousBookings > 0
//         ? ((currentBookings - previousBookings) / previousBookings) * 100
//         : currentBookings > 0 ? 100 : 0;
  
//       // Fetch bookings with populated category and services
//       const serviceRequests = await ServiceRequest.find({ expertId: id })
//         .populate("serviceType.category", "name")
//         .populate("serviceType.servicesChoosen", "serviceName price");
  
//       // Count bookings per category
//       const categoryCounts = serviceRequests.reduce((acc, service) => {
//         service.serviceType?.forEach((serviceItem) => {
//           const categoryName = serviceItem?.category?.name;
//           if (categoryName) {
//             acc[categoryName] = (acc[categoryName] || 0) + 1;
//           }
//         });
//         return acc;
//       }, {});
  
//       res.json({
//         totalBookings,
//         currentBookings,
//         previousBookings,
//         growth: parseFloat(growth.toFixed(2)),
//         bookingsByCategory: categoryCounts,
//       });
  
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ errors: "Something went wrong" });
//     }
//   };

statsCtlr.expertBookingsAnalytics = async (req, res) => {
    const { id } = req.params;
    const { period } = req.query;
  
    try {
      const getStartDate = (period, offset = 0) => {
        switch (period) {
          case "day":
            return dayjs().subtract(offset, "day").startOf("day").toDate();
          case "week":
            return dayjs().subtract(offset, "week").startOf("week").toDate();
          case "month":
            return dayjs().subtract(offset, "month").startOf("month").toDate();
          case "year":
            return dayjs().subtract(offset, "year").startOf("year").toDate();
          default:
            return dayjs().subtract(offset, "month").startOf("month").toDate();
        }
      };
  
      // Get start dates for current and previous periods
      const currentStartDate = getStartDate(period);
      const previousStartDate = getStartDate(period, 1);
  
      // Fetch expert's total bookings
      const totalBookings = await ServiceRequest.countDocuments({ expertId: id });
      console.log("totalBookings", totalBookings)
  
      // Fetch bookings for current and previous period in one query
      const [currentBookings, previousBookings] = await Promise.all([
        ServiceRequest.countDocuments({ expertId: id, createdAt: { $gte: currentStartDate } }),
        ServiceRequest.countDocuments({ expertId: id, createdAt: { $gte: previousStartDate, $lt: currentStartDate } }),
      ]);
  
      // Calculate growth percentage
      const growth = previousBookings > 0
        ? ((currentBookings - previousBookings) / previousBookings) * 100
        : currentBookings > 0 ? 100 : 0;
  
      // Fetch bookings with populated category and services
      const serviceRequests = await ServiceRequest.find({ expertId: id })
        .populate("serviceType.category", "name")
        .populate("serviceType.servicesChoosen", "serviceName price");
  
      // Count bookings per category
      const categoryCounts = serviceRequests.reduce((acc, service) => {
        service.serviceType?.forEach((serviceItem) => {
          const categoryName = serviceItem?.category?.name;
          if (categoryName) {
            acc[categoryName] = (acc[categoryName] || 0) + 1;
          }
        });
        return acc;
      }, {});
      console.log('category counts : ', categoryCounts)
  
      // Fetch booking timestamps for the line chart
      const bookingTimestamps = await ServiceRequest.find(
        { expertId: id, createdAt: { $gte: currentStartDate } },
        "createdAt"
      ).sort({ createdAt: 1 });
  
      res.json({
        totalBookings,
        currentBookings,
        previousBookings,
        growth: parseFloat(growth.toFixed(2)),
        bookingsByCategory: categoryCounts,
        bookings: bookingTimestamps.map((b) => b.createdAt), // Send only timestamps
      });
  
    } catch (err) {
      console.error("Error fetching expert bookings analytics:", err);
      return res.status(500).json({ errors: "Something went wrong" });
    }
  };

export default statsCtlr