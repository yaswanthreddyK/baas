
import User from "../models/user.model.js";
import {  verifyJWT } from "../utils.js";

 export const checkAuthToken = async (req, res, next) => {
    const token = req.cookies['auth-token'];
    const apiKey = req.body.apiKey
    if(!token && !apiKey){
        return res.status(401).send('where is the token bro')
    }

    let payload = verifyJWT(token)
    if(!payload){
        const payloadFromApiKey  = verifyJWT(apiKey)
        if(!payloadFromApiKey) return res.status(401).send('where is the token bro 2')
        payload  = payloadFromApiKey 
    }
    const userId = payload._id
    const user = await User.findById(userId)
    req.user = user
    next()
}


