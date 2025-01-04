Field Service Management - FixItNow
Model Creation  
 
User :
● Name,
● Email,
● Phone number,
● Password,
● Role
 
 
Customer :
● User Id : ref : user model
● Address,
● Location - {city, state, country},
● Requested services - [serviceIds ],
● Feedbacks - [ ServiceId] 

Skills
* name 
 
Expert:  
● User Id : ref :user model
● Skills : [SkillId],
● Location : {city, state, country}
● Experience
● documents - [{ pathName: '', type: '', isVerified}]
● Availability : [ { date : , isAvailable: } ],
● MyServices : [ServiceId]
● Feedbacks : [ServiceId],
● isPremium,
● isVerified

Service:
● serviceType - [],
● Description,
● address,
● Location,
● scheduleDate,
● Budget: { suggestedRange: }, ref : budget model
● Photo & video
● Booking fee - fixed for all services
● customerId,
● expertId,
● Status : [ requested, proposed, assigned, in-progress, completed, cancelled ]
● Is Approved,
● Feedback : { customer : { expertId, rating, review }, expert: { customerid, rating, review } } ,
● createdAt,
● Completion Date,
* finalBill

 
Budget Model :
● serviceId,
● customerId,
● suggestedRange,
● finalPrice
 
 
Payment Model :
● paymentId,
● customerId,
● serviceId,
● Amount,
● Status,
● datePaid