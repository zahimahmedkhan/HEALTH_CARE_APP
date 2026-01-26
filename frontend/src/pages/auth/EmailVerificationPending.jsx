import React from "react";
import { Button } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function EmailVerificationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        {/* Email Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MailOutlined className="text-white text-5xl" />
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Check Your Email
        </h1>
        
        <p className="text-center text-gray-600 mb-6 text-lg leading-relaxed">
          We've sent a verification link to your email address. Please click the link to verify your account and complete the registration process.
        </p>

        {/* Steps */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-3 text-center">
            What to do next:
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Check your email inbox</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Click the verification link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Sign in to your account</span>
            </li>
          </ol>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-500 mb-8">
          💡 If you don't see the email, check your spam folder or try registering again with a different email address.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link to="/signin" className="block">
            <Button 
              type="primary" 
              size="large" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
            >
              Go to Sign In
            </Button>
          </Link>
          
          <Link to="/" className="block">
            <Button 
              size="large" 
              className="w-full h-12 text-base font-semibold"
              icon={<ArrowLeftOutlined />}
            >
              Back to Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
