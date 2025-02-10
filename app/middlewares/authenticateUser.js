import jwt from 'jsonwebtoken'

export default function authenticateUser(req,res,next){
    let token = req.headers['authorization']

    if(!token){
        return res.status(401).json({errors: 'token not provided'})
    }

    token = token.split(' ')[1]

    try{
        const tokenData = jwt.verify(token, process.env.SECRET_KEY)
        req.currentUser = { userId: tokenData.userId, role : tokenData.role}
        // console.log('tokenData',tokenData)
        next()
    }catch(err){
        return res.status(401).json({errors: err.message})
    }
}