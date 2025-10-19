import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { generateExpiryTime } from "../utils/generateExpiryTime.js";
import bcrypt from 'bcrypt'
import { sendOtpToEmail, sendVerificationToEmail } from "../utils/sendEmailVerification.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"
import { sendResponse } from "../utils/sendResponse.js";
import "dotenv/config"
import { uploadFileToCloudinary } from "../utils/uploadToCloudniary.js";
import { AISummery } from "../utils/aiSummery.js";

const registerUser = async (req, res) => {
    try {
        const { userName, email } = req.body;

        const avatarPath = req.file?.path;

        console.log(avatarPath);


        const user = await User.findOne({
            $or: [{ email }, { userName }]
        });

        if (user) {
            const field = user.email === email ? "Email" : "User name";
            return res.status(409).send({
                status: 409,
                message: `${field} already exists`
            });
        }

        // const publicPath = await uploadFileToCloudinary(avatarPath);

        const publicPath = avatarPath ? await uploadFileToCloudinary(avatarPath) : { secure_url: "" };

        // Always generates a 6-digit number (000000 - 999999)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashOtp = bcrypt.hashSync(otp, 10);

        // Set expiry time (current time + 5 minutes)
        const otpExpiry = generateExpiryTime("5m");

        await sendVerificationToEmail(otp, email, userName);

        await User.create({ ...req.body, otp: hashOtp, otpExpiry, avatar: publicPath.secure_url });

        res.status(201).send({ status: 201, message: "Register successfully" })
    } catch (error) {
        console.log("Register Error", error);
        res.status(500).send({ status: 500, message: "Internal Server Error", error: error.message })
    }
}

const verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.query; // ✅ No change, correct extraction

    const user = await User.findOne({ email });

    if (!user) {
      // ✅ Added clear response format
      return res.status(404).send({ status: 404, message: "User not found" });
    }

    if (user.isVerified) {
      // ✅ Added early return for already verified user
      return res.status(200).send({ status: 200, message: "Email already verified" });
    }

    // ✅ Fixed OTP comparison
    // Your original code was fine, just made it clearer
    const isValidOtp = bcrypt.compareSync(otp, user.otp);
    if (!isValidOtp) {
      return res.status(400).send({ status: 400, message: "Invalid OTP" });
    }

    // ✅ Added proper OTP expiry check
    if (user.otpExpiry < new Date()) {
      return res.status(400).send({ status: 400, message: "OTP expired" });
    }

    // ✅ Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;           // ⚠️ Changed from undefined to null (more explicit)
    user.otpExpiry = null;     // ⚠️ Changed from undefined to null
    await user.save();

    // ✅ Send success response
    return res.status(200).send({ status: 200, message: "Email verified successfully" });
  } catch (error) {
    // ✅ Added proper logging
    console.error("Verify Email Error:", error);
    return res.status(500).send({ status: 500, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // Find user by email OR username
        const user = await User.findOne({
            $or: [{ email }, { userName }]
        }).select("+password");

        // 404 — Not Found
        if (!user) {
            return sendResponse(res, 404, "User not found")
        }

        // 403 — Forbidden (account exists but not verified)
        // if (!user.isVerified) {
        //     return sendResponse(res, 403, "Email not verified")
        // }

        // Compare password (make sure to call the instance method)
        const isValidPass = await user.comparePassword(password);

        // 401 — Unauthorized (wrong credentials)
        if (!isValidPass) {
            return sendResponse(res, 401, "Invalid password")
        }

        // Generate tokens
        const accessToken = generateAccessToken("15m", user._id);
        const refreshToken = generateRefreshToken("1h", user._id);

        user.refreshToken = refreshToken;
        await user.save();

        // 200 — OK 
        sendResponse(res, 200, "Login successful", { accessToken, refreshToken })
    } catch (error) {
        console.error("Login Error:", error);
        // 500 — Internal Server Error
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
};

const logoutUser = (req, res) => {
    res.status(200).send({ status: 200, message: "Logout successfully" });
}

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            sendResponse(res, 404, "User not found")
            return
        }

        const newAccessToken = generateAccessToken("15m", user._id);

        sendResponse(res, 200, "Token refreshed", { accessToken: newAccessToken })
    } catch (error) {
        console.log("Token Refresh Error", error);
        if (error.message.includes("jwt expired")) {
            sendResponse(res, 401, "Sign In again")
            return
        }
        sendResponse(res, 500, "Internal server error", { error: error.message });
    }
};

const userNewPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const email = req.params.email;

        const user = await User.findOne({ email });

        if (!user) {
            sendResponse(res, 404, "User not found")
            return
        }

        if (!newPassword) {
            sendResponse(res, 401, "New password required")
            return
        }

        user.password = newPassword;

        await user.save();

        sendResponse(res, 200, "Password Updated Successfully")
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendResponse(res, 401, "Email is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        // Always generates a 6-digit number (000000 - 999999)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashOtp = bcrypt.hashSync(otp, 10);

        // Set expiry time (current time + 5 minutes)
        const otpExpiry = generateExpiryTime("5m");

        await sendOtpToEmail(otp, email, user.userName);

        user.otp = hashOtp;
        user.otpExpiry = otpExpiry;

        await user.save();

        sendResponse(res, 200, "OTP Send to email");
    } catch (error) {
        console.log("Send Otp Error", error);
        sendResponse(res, 500, "Internal Server Error", { error: error.message })
    }
}

const verifyOtp = async (req, res) => {
    try {

        const { otp } = req.body;

        const email = req.params.email;

        if (!otp) {
            return sendResponse(res, 401, "OTP is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        const isValidOtp = await user.compareOtp(otp);

        if (!isValidOtp) {
            return sendResponse(res, 401, "Invalid OTP")
        }

        if (user.otpExpiry < Date.now()) {
            return sendResponse(res, 401, "OTP Expired")
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        sendResponse(res, 200, "OTP verified successfully")
    } catch (error) {
        console.log("Verify Otp Error", error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

const userProfile = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.user.id });

        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        sendResponse(res, 200, "User profile successfully", { user });
    } catch (error) {
        console.log("User Profile", error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

const aiSummery = async (req, res) => {
    try {

        const { question } = req.body;

        const answer = await AISummery(question);

        sendResponse(res, 200, "Successfully answer generated", { respone: answer })
    } catch (error) {
        console.log("AI summery Error", error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

export { loginUser, registerUser, refreshAccessToken, logoutUser, userNewPassword, verifyEmail, verifyOtp, forgetPassword, userProfile, aiSummery }
