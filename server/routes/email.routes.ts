import express from "express";;
import { sendEmailNotification } from "../controllers/email.controller"


// POST endpoint to trigger the email sending functionality
const router = express.Router();
router.post("/sendEmail", sendEmailNotification);

export default router;