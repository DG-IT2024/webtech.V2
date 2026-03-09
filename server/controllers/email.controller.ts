import nodemailer from "nodemailer";
import { Request, Response } from "express";

export const sendEmail = async (req: Request, res: Response) => {
  const { emails, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your_app_password"
      }
    });

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: emails.join(","), // multiple emails
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Email sending failed", error });
  }
};