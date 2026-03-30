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
    try {
      const {emails, subject, message} = req.body;  
      console.log("I am being access! The message is: ", message);
        const info = await transporter.sendMail({
            from: "Records Section <"+ process.env.SMTP_USER +">" ,
            to: emails,
            subject: subject,
            text: message
        });

        console.log("Email sent to:", emails);
        return res.status(200).json({ success: true, message: "Email successfully sent!" });
    } catch (error) {
        console.error("Email sending failed: ", error);
        return res.status(500).json({ success: false, message: "Failed to send email." });
    }
};