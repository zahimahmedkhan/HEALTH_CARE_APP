import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { generateExpiryTime } from "../utils/generateExpiryTime.js";
import bcrypt from 'bcrypt'
import { sendOtpToEmail, sendVerificationToEmail } from "../utils/sendEmailVerification.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"
import { sendResponse } from "../utils/sendResponse.js";
import "dotenv/config"
import { uploadFileToCloudinary } from "../utils/uploadToCloudniary.js";
// Note: AISummery is used in aiSummery function below
import { AISummery } from "../utils/aiSummery.js";

const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validate required fields
        if (!userName || !email || !password) {
            return res.status(400).send({
                status: 400,
                message: "Username, email, and password are required"
            });
        }

        const avatarBuffer = req.file?.buffer;


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

        // Upload avatar to Cloudinary if provided
        let avatarUrl = "";
        if (avatarBuffer) {
            try {
                const uploadResult = await uploadFileToCloudinary(avatarBuffer);
                avatarUrl = uploadResult.secure_url || "";
            } catch (uploadError) {
                console.warn("Avatar upload failed (continuing):", uploadError.message);
                // Continue without avatar instead of failing
            }
        }

        // Always generates a 6-digit number (000000 - 999999)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashOtp = await bcrypt.hash(otp, 10);

        // Set expiry time (current time + 5 minutes)
        const otpExpiry = generateExpiryTime("5m");

        // Send verification email with better error handling
        try {
            await sendVerificationToEmail(otp, email, userName, req.headers.origin);
        } catch (emailError) {
            console.warn("Failed to send verification email:", emailError.message);
            // Continue even if email fails - user can still register
        }

        // Create user with all provided data
        await User.create({ 
            userName, 
            email, 
            password,
            otp: hashOtp, 
            otpExpiry, 
            avatar: avatarUrl
        });

        res.status(201).send({ 
            status: 201, 
            message: "Registration successful. Please check your email to verify your account." 
        });

    } catch (error) {
        console.error("âŒ Registration Error:", error.message);
        console.error("Error Details:", error);
        
        // Check if it's a MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).send({
                status: 409,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        res.status(500).send({ 
            status: 500, 
            message: "Registration failed: " + error.message
        });
    }
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send({ status: 400, success: false, message: "Verification token is required" });
    }

    const jwtSecret =
      process.env.JWT_EMAIL_SECRET ||
      process.env.JWT_SECRET ||
      process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
      return res.status(500).send({
        status: 500,
        success: false,
        message:
          "Server misconfigured: missing JWT secret for email verification. Set JWT_EMAIL_SECRET (recommended) or JWT_SECRET (legacy) or JWT_ACCESS_SECRET.",
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).send({ status: 400, success: false, message: "Verification token has expired. Please sign up again." });
      }
      return res.status(400).send({ status: 400, success: false, message: "Invalid verification token" });
    }

    const { email, otp } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ status: 404, success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).send({ status: 200, success: true, message: "Email already verified" });
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) {
      return res.status(400).send({ status: 400, success: false, message: "Invalid verification token" });
    }

    // Check OTP expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).send({ status: 400, success: false, message: "Verification token has expired" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).send({ status: 200, success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("âŒ Verify Email Error:", error);
    return res.status(500).send({ status: 500, success: false, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // Find user by email OR username
        const user = await User.findOne({
            $or: [{ email }, { userName }]
        }).select("+password");

        // 404 â€" Not Found
        if (!user) {
            return sendResponse(res, 404, "User not found")
        }

        // 403 â€" Forbidden (account exists but not verified)
        // if (!user.isVerified) {
        //     return sendResponse(res, 403, "Email not verified")
        // }

        // Compare password (make sure to call the instance method)
        const isValidPass = await user.comparePassword(password);

        // 401 â€" Unauthorized (wrong credentials)
        if (!isValidPass) {
            return sendResponse(res, 401, "Invalid password")
        }

        // Generate tokens
        const accessToken = generateAccessToken("15m", user._id);
        const refreshToken = generateRefreshToken("1h", user._id);

        user.refreshToken = refreshToken;
        await user.save();

        // 200 â€" OK 
        sendResponse(res, 200, "Login successful", { accessToken, refreshToken })
    } catch (error) {
        console.error("Login Error:", error);
        // 500 â€" Internal Server Error
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

        // IMPORTANT:
        // `userModel.js` already hashes `password` in a pre("save") hook.
        // If we hash here too, it becomes double-hashed and login will always fail.
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

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
        const hashOtp = await bcrypt.hash(otp, 10);

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

        if (user.otpExpiry < new Date()) {
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
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        sendResponse(res, 200, "User profile successfully", { user });
    } catch (error) {
        console.error("âŒ User Profile Error:", error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

const updateUserProfile = async (req, res) => {
    try {
        console.log("🔄 Update Profile Called");
        console.log("📦 Body:", req.body);
        console.log("🖼️ File:", req.file ? "File received" : "No file");
        
        const { userName, phone, dob } = req.body;
        const userId = req.user?._id;
        
        // ⚠️ Use .path for disk storage OR .buffer for memory storage
        const avatarData = req.file?.path || req.file?.buffer;

        if (!userId) {
            return sendResponse(res, 401, "Unauthorized - User ID not found");
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return sendResponse(res, 404, "User not found");
        }

        // Update fields if provided
        if (userName) {
            const existingUser = await User.findOne({ userName, _id: { $ne: userId } });
            if (existingUser) {
                return sendResponse(res, 409, "Username already exists");
            }
            user.userName = userName;
        }
        
        if (phone) {
            user.phone = phone;
        }
        
        if (dob) {
            user.dob = dob;
        }

        // Upload and update avatar if provided
        if (avatarData) {
            try {
                console.log("📤 Starting avatar upload...");
                const publicPath = await uploadFileToCloudinary(avatarData);
                if (publicPath?.secure_url) {
                    user.avatar = publicPath.secure_url;
                    console.log("✅ Avatar updated:", publicPath.secure_url);
                }
            } catch (uploadError) {
                console.error("❌ Avatar Upload Error:", uploadError);
                return sendResponse(res, 500, "Failed to upload avatar: " + uploadError.message);
            }
        }

        await user.save();
        sendResponse(res, 200, "Profile updated successfully", { user });
    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        sendResponse(res, 500, "Internal server error", { error: error.message });
    }
}
const aiSummery = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return sendResponse(res, 400, "Question is required");
        }

        const answer = await AISummery(question);

        sendResponse(res, 200, "Successfully answer generated", { response: answer })
    } catch (error) {
        console.log("AI summery Error", error);
        sendResponse(res, 500, "Internal server error", { error: error.message })
    }
}

export { loginUser, registerUser, refreshAccessToken, logoutUser, userNewPassword, verifyEmail, verifyOtp, forgetPassword, userProfile, updateUserProfile, aiSummery }