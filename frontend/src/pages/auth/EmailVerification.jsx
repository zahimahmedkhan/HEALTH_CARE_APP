import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import verifiedImg from "./../../assets/images/verified.gif";
import verificationFailedImg from "./../../assets/images/verification-failed.gif";
import api from "../../utils/axiosSetup";

const EmailVerification = () => {
  const { email } = useParams();
  const [isVerified, setIsVerified] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyEmail = useCallback(async (signal) => {
    if (!email) {
      setErrorMessage("No email provided");
      setIsVerified(false);
      return;
    }
    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-email/${email}`,
        { otp },
        { signal }
      );
      if (data.success || data.status === 200) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
        setErrorMessage(data.message || "Verification failed");
      }
    } catch (error) {
      if (error.name === 'CanceledError') return;
      
      console.error("Verification error:", error);
      const message = error.response?.data?.message || "Verification failed. The OTP may have expired.";
      setErrorMessage(message);
      setIsVerified(false);
    }
  }, [email, otp]);

  useEffect(() => {
    const controller = new AbortController();
    verifyEmail(controller.signal);
    return () => controller.abort();
  }, [verifyEmail]);

  if (isVerified === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">Verifying your email...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
  {isVerified ? (
    <div className="text-center">
      {/* Success Animation Container */}
      <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
        <img src={verifiedImg} alt="Verified" className="w-20 h-20" />
        {/* Animated Success Rings */}
        <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-4 border-green-300 rounded-full animate-pulse"></div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Email Verified Successfully!</h1>
      <p className="text-gray-500 mb-8 text-lg">Your account has been verified and is ready to use</p>
      
      <Link 
        to="/login" 
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <span>Continue to Sign In</span>
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  ) : (
    <div className="text-center">
      {/* Failed Animation Container */}
      <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
        <img src={verificationFailedImg} alt="Failed" className="w-20 h-20" />
        {/* Error X Mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-1 bg-white rotate-45 rounded-full absolute"></div>
          <div className="w-16 h-1 bg-white -rotate-45 rounded-full absolute"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Verification Failed</h1>
      <p className="text-gray-500 mb-2 text-lg">We couldn't verify your email address</p>
      <p className="text-red-600 mb-8 text-sm font-medium">{errorMessage}</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter OTP sent to your email
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
        />
      </div>
      
      <button
        onClick={verifyEmail}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Verify OTP
      </button>
      
      {/* Additional Help Text */}
      <p className="text-gray-400 text-sm mt-6">
        Need help? <a href="#" className="text-red-500 hover:text-red-600 font-medium">Contact Support</a>
      </p>
    </div>
  )}
</div>
  );
};

export default EmailVerification;