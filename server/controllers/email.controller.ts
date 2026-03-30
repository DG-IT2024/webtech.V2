import { Resend } from "resend";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RESEND_API_KEY) {
    console.warn("[EMAIL] WARNING: RESEND_API_KEY is missing. Email notifications will not be sent.");
} else {
    console.log("[EMAIL] Resend configured successfully.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailNotification = async (req: Request, res: Response) => {
    const { emails, subject, message } = req.body;
    console.log("[EMAIL] Sending notification. Subject:", subject);

    // Respond immediately — email is sent in the background to avoid blocking
    res.status(200).json({ success: true, message: "Email notification sent!" });

    resend.emails.send({
        from: "Records Section <noreply@raisesystemph.com>",
        to: emails,
        subject: subject,
        text: message
    }).then(() => {
        console.log("[EMAIL] Email sent to:", emails);
    }).catch((error) => {
        console.error("[EMAIL] Failed to send email:", error);
    });
};
