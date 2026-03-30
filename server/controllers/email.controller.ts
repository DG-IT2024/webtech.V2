import { Resend } from "resend";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailNotification = async (req: Request, res: Response) => {
    const { emails, subject, message } = req.body;
    console.log("I am being accessed! The message is: ", message);

    // Respond immediately — email is sent in the background to avoid blocking
    res.status(200).json({ success: true, message: "Email notification sent!" });

    resend.emails.send({
        from: "Records Section <noreply@raisesystemph.com>",
        to: emails,
        subject: subject,
        text: message,
    }).then((result) => {
        console.log("Email sent to:", emails, result);
    }).catch((error) => {
        console.error("Background email sending failed: ", error);
    });
};
