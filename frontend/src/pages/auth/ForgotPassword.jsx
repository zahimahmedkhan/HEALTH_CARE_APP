import React from "react";
import { Form, message } from "antd";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router";

const ForgotPassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Reset link sent to:", values.email);
    message.success("Password reset link sent to your email!");
  };

  return (
 <>
  <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative">
        <MailOutlined className="text-white text-2xl" />
        {/* Animated envelope effect */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Reset Your Password</h1>
      <p className="text-gray-500 text-lg leading-relaxed">
        Enter your email and we'll send you a secure link to reset your password
      </p>
    </div>

    <Form layout="vertical" form={form} onFinish={onFinish} className="space-y-6">
      {/* Email Field */}
      <Form.Item
        label="Email Address"
        name="email"
        rules={[
          { required: true, message: "Please enter your email address!" },
          { type: "email", message: "Please enter a valid email address!" },
        ]}
        className="font-semibold"
      >
        <Input 
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="Enter your registered email address"
          className="h-12 rounded-lg border-gray-300 hover:border-orange-400 focus:border-orange-500 transition-colors duration-300"
          size="large"
        />
      </Form.Item>

      {/* Security Note */}
      <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
        <div className="flex items-start space-x-3">
          <ShieldCheckOutlined className="text-orange-500 text-lg mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-800 mb-1">Secure Process</h4>
            <p className="text-orange-700 text-sm">
              The reset link will expire in 1 hour for your security. Check your spam folder if you don't see it.
            </p>
          </div>
        </div>
      </div>

      {/* Send Reset Link Button */}
      <Form.Item className="mb-0">
        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-0 text-lg flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            <PaperPlaneOutlined className="group-hover:translate-x-1 transition-transform duration-300" />
            Send Reset Link
          </span>
        </button>
      </Form.Item>
    </Form>

    {/* Success Message Placeholder */}
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl hidden" id="successMessage">
      <div className="flex items-center space-x-3">
        <CheckCircleOutlined className="text-green-500 text-xl" />
        <div>
          <p className="font-semibold text-green-800">Reset link sent!</p>
          <p className="text-green-700 text-sm">Check your email for further instructions</p>
        </div>
      </div>
    </div>

    {/* Back to Sign In */}
    <div className="text-center mt-8 pt-6 border-t border-gray-200">
      <p className="text-gray-600">
        Remember your password?{" "}
        <Link
          to="/signin"
          className="text-orange-600 hover:text-orange-700 font-semibold underline hover:no-underline transition-all duration-300"
        >
          Back to Sign In
        </Link>
      </p>
    </div>
  </div>
</>
  );
};

export default ForgotPassword;
