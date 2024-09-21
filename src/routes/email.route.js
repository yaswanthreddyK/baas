import { sendEmail } from "../controller/email.controller.js";
import express from "express";

const router = express.Router();

router.post('/', sendEmail);

const emailRouter = router;
export default emailRouter;