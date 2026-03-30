import nodemailer from "nodemailer";
import { Request, Response, RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EMAIL] WARNING: SMTP environment variables are missing. Email notifications will not be sent.");
} else {
    console.log(`[EMAIL] SMTP configured — host: ${process.env.SMTP_HOST}, user: ${process.env.SMTP_USER}`);
}

const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
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

transporter.verify().then(() => {
    console.log("[EMAIL] SMTP connection verified successfully.");
}).catch((err) => {
    console.error("[EMAIL] SMTP connection failed:", err.message);
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