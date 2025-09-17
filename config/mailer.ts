import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,   // e.g. smtp.gmail.com
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // your password / app password
    },
});
