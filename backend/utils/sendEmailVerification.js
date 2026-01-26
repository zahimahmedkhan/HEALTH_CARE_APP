import fs from "fs";
import path from "path";
import transporter from "../config/nodeMailer.js";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendVerificationToEmail = async (otp, userEmail, userName, frontendBaseUrl) => {
    try {
        const jwtSecret =
            process.env.JWT_EMAIL_SECRET ||
            process.env.JWT_SECRET ||
            process.env.JWT_ACCESS_SECRET;

        if (!jwtSecret) {
            throw new Error(
                "Missing JWT secret for email verification. Set JWT_EMAIL_SECRET (recommended) or JWT_SECRET (legacy) or JWT_ACCESS_SECRET."
            );
        }

        // Generate JWT token for email verification (valid for 24 hours)
        const verificationToken = jwt.sign(
            { email: userEmail, otp },
            jwtSecret,
            { expiresIn: '24h' }
        );
        
        // Read HTML template and inject data
        const templatePath = path.join(__dirname, "../templates/verificationEmail.html");
        
        let htmlTemplate = "";
        try {
            htmlTemplate = fs.readFileSync(templatePath, "utf-8");
        } catch (fileError) {
            console.warn("⚠️ Template file not found, using simple HTML");
            htmlTemplate = `
                <h2>Verify Your Email</h2>
                <p>Hi {{userName}},</p>
                <p>Please verify your email by clicking the link below:</p>
                <a href="{{verificationLink}}">Verify Email</a>
                <p>Or copy this OTP: {{otp}}</p>
            `;
        }

        const baseUrl =
            (typeof frontendBaseUrl === "string" && frontendBaseUrl.trim().length > 0
                ? frontendBaseUrl.trim()
                : process.env.FRONTEND_URL) || "http://localhost:5173";

        const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
        const verificationLink = `${normalizedBaseUrl}/verify-email/${verificationToken}`;

        htmlTemplate = htmlTemplate
            .replace("{{userName}}", userName || "User")
            .replace("{{verificationLink}}", verificationLink)
            .replace("{{otp}}", otp);

        const subject = `Verify your account - ${userName || "User"}`;

        const mailOptions = {
            from: process.env.USER_EMAIL || process.env.EMAIL_USER,
            to: userEmail,
            subject: subject,
            html: htmlTemplate,
            headers: {
                'X-Priority': '3',
                'Importance': 'normal',
                'X-MSMail-Priority': 'Normal',
                'X-Mailer': 'HealthDashboard/1.0',
                'MIME-Version': '1.0',
                'Content-Type': 'text/html; charset=UTF-8'
            }
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Error sending verification email:", error.message);
        throw error;
    }
};

const sendOtpToEmail = async (otp, email, userName) => {
    try {
        // Read HTML template and inject data
        const templatePath = path.join(__dirname, "../templates/otpEmail.html");
        
        let htmlTemplate = "";
        try {
            htmlTemplate = fs.readFileSync(templatePath, "utf-8");
        } catch (fileError) {
            console.warn("⚠️ Template file not found, using simple HTML");
            htmlTemplate = `
                <h2>Your OTP</h2>
                <p>Hi {{userName}},</p>
                <p>Your OTP is: <strong>{{otp}}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
            `;
        }

        htmlTemplate = htmlTemplate
            .replace("{{userName}}", userName || "User")
            .replace("{{otp}}", otp);

        const mailOptions = {
            from: process.env.USER_EMAIL || process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Verification Code",
            html: htmlTemplate
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error.message);
        throw error;
    }
}

export { sendVerificationToEmail, sendOtpToEmail };