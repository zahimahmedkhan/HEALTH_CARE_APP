import express from 'express'
import { loginUser, logoutUser, refreshAccessToken, registerUser, forgetPassword, verifyEmail, verifyOtp, userNewPassword, userProfile, updateUserProfile, aiSummery } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/protectedRoute.js';
import upload from '../config/multer.js'

const userRoute = express.Router();

userRoute.post("/register", upload.single('avatar'), registerUser);

userRoute.get("/verify-email/:token", verifyEmail);

userRoute.post("/login", loginUser);

userRoute.post("/refresh-token", refreshAccessToken);

userRoute.post("/forget-password", forgetPassword);

userRoute.post("/verify-otp/:email", verifyOtp);

userRoute.post("/new-password/:email", userNewPassword);

userRoute.post("/logout", logoutUser);

userRoute.get("/user-profile", protectedRoute, userProfile);

userRoute.put("/update-profile", protectedRoute, upload.single('avatar'), (err, req, res, next) => {
    if (err) {
        console.error("❌ Multer Error:", err.message);
        return res.status(400).send({
            status: 400,
            message: "File upload error: " + err.message
        });
    }
    next();
}, updateUserProfile);

export default userRoute;