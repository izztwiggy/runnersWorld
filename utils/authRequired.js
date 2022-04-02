const authRequired = async(req,res,next) => {
    const { TokenExpiredError } = jwt
    let token
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try{
                let decodedData
                // get token from header : headers.authroization, split into array, [0] is bearer, [1] is actual token
                token = req.headers.authorization.split(' ')[1]
                // is GoogleAuth = token.length > 500
                if(!token) return res.status(401).json({error: error.message})
                if(token.length < 500){
                    decodedData = jwt.verify(token, process.env.JWT_SECRET)
                    decodedData ?
                    req.user = await User.findById(decodedData.id).select('-password') :
                    res.status(403).json({message: "Invalid Request"})
                }else {
                    decodedData= jwt.decode(token)
                    req.userId = decodedData?.sub
                }
                next()    
            }catch(err){
                console.error(err)
                if(err instanceof TokenExpiredError) return res.status(401).json({message: "Unauthorized, expired Token, please re-authenitcate"})
                res.status(401).json({message: "Not Authorized"})
            }
        }
        if(!token) res.status(401).json({message: "Not Authorized, no token"})
    }catch(err){
        next(err)
    }

}

module.exports = authRequired