const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRETKEY; 

const authenticate = (req, res, next)=> {

    const token = req.cookies.token;

    if(!token){
        const error = new Error('No token provided, authorization denied.')
        error.name = 'INVALID_TOKEN'
        return next(error)
    }

    jwt.verify(token, secretKey,(err, decoded) => {
        if(err){
            const error = new Error('Invalid token, authorization denied.')
            error.name = 'INVALID_TOKEN'
            return next(error)
        }
        req.user = decoded
        next()
    })
}

module.exports = authenticate;
