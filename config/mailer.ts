import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.MAIL_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.MAIL_PORT || '587');
const secure = port === 465;
const smtpUser = process.env.MAIL_USER || process.env.MAIL || '';
const rawSmtpPass = process.env.MAIL_PASS || process.env.MAIL_PASSWORD || '';
// Gmail App Passwords are shown with spaces (e.g., "abcd efgh ijkl mnop"). Remove spaces if present.
const smtpPass = rawSmtpPass.replace(/\s+/g, '');

export const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
