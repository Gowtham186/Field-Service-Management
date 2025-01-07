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
● Requested services - [serviceIds],
● Feedbacks - [ReviewId] 

Skills
* name 
 
Expert:  
● User Id : ref :user model
● Skills : [SkillId],
● Location : {city, state, country}
● Experience
● documents - [{ pathName: '', type: '', isVerified}]
● Availability : [ { date : } ],
● MyServices : [ServiceId]
● Feedbacks : [ReviewId],
● isPremium,
● isVerified

Service:
● serviceType - [ {categoryId, serviceTypes:[serviceTypeId]}],
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
● review : ref : 'review model'
● createdAt,
● Completion Date,
* finalBill

 
Budget Model :
● serviceId,
● customerId,
● suggestedPrice,
● finalPrice
 
Payment Model :
● paymentId,
● customerId,
● serviceId,
● Amount,
● Status,
● datePaid

Review Model :
● customerId
● expertId
● serviceId
● rating
● comment
● date

Category :
● category : String
● serviceTypes : [ {name, price, primarySkill} ]

Otp : 
● identifier
● otpCode
● createdAt
● purpose