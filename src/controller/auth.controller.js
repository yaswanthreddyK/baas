import makeDBCalls from "../db/connectToDatabase.js";
import User from "../models/user.model.js";
import { Apiresponse, asyncWrapper, generateQueries, generateUserToken, verifyJWT } from "../utils.js";

export const loginUser = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) res.status(401).json(new Apiresponse('email does not exist'))
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) return res.status(400).json(new Apiresponse('incorrect password'))
    const authToken =  user.generateToken()
    const apiKey = authToken
    return res
        .status(200)
        .cookie('auth-token', authToken)
        .json(new Apiresponse('login successful',false, {apiKey: apiKey}))
})

export const signupUser = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body
    const user = await User.create({
        email,
        password
    })

    if(user){
        return res.status(201).json(new Apiresponse('account created',false))
    }else{
        return res.status(500).json(new Apiresponse('account creation failed'))
    }
})


export const authorizedUser = asyncWrapper((req, res, next) => {
    const token = req.cookies['authorized_token'];
    if(!token){
        return false
    }
    const payload = verifyJWT(token);
    if(!payload){
       return false
    }
    req.projectUser = payload;
    return true
})