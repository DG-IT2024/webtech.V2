import nodemailer from "nodemailer";
import { Request, Response, RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // your SMTP host
            port: Number(process.env.SMTP_PORT),
            secure: false, // true if port 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
              rejectUnauthorized: false, // allow self-signed certificates
            },
});

export const sendEmailNotification = async (req: Request, res: Response) => {
    const {emails, subject, message} = req.body;
    console.log("I am being access! The message is: ", message);

    // Respond immediately — email is sent in the background to avoid blocking
    res.status(200).json({ success: true, message: "Email notification sent!" });

    transporter.sendMail({
        from: "Records Section <" + process.env.SMTP_USER + ">",
        to: emails,
        subject: subject,
        text: message
    }).then(() => {
        console.log("Email sent to:", emails);
    }).catch((error) => {
        console.error("Background email sending failed: ", error);
    });
};