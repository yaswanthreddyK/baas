import nodemailer from 'nodemailer';
import {google} from 'googleapis';
import { asyncWrapper } from '../utils.js';



export const sendEmail = asyncWrapper(async (req, res, next) => {
    const {to, subject, body, passkey} = req.body
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
         port: 465,
         secure: true,
         logger: true,
         debug: true,
         secureConnection :false,
         auth: {
           user: process.env.EMAIL,
           pass: passkey,
         },
         tls:{ rejectUnAuthorized: true}
       });

    const result = await transporter.sendMail({
        from: process.env.MAIL_SENDER_ID, 
        to: to, 
        subject: subject, 
       html: `<h1>${body}</h1>`,   
       })

       console.log(result)
    
})