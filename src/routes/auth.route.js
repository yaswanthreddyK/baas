import express from 'express'
import { loginUser, signupUser } from '../controller/auth.controller.js';

const router = express.Router()

router.route('/login')
        .post(loginUser);



router.route('/signup')
        .post(signupUser)

const authRouter = router
export default authRouter