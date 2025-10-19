import React, { useState } from "react";
import { Form } from "antd";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { showError, showSuccess } from "../../utils/toast";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (value) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/auth/register`,
        {
          userName: value.name,
          email: value.email,
          password: value.password,
        },
        {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (res.data.success === false) {
        return showError(res.data.message);
      }

      form.resetFields();
      showSuccess(res.data.message);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<>
    {/* Animated Header */}
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <UserOutlined className="text-white text-2xl" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Join Us Today
      </h1>
      <p className="text-gray-500 font-medium">Create your account in seconds</p>
    </div>

    <Form layout="vertical" form={form} onFinish={onFinish} className="space-y-5">
      {/* Name Field with Floating Label Effect */}
      <div className="group">
        <InputField
          label="Full Name"
          name="name"
          prefix={<UserOutlined className="text-blue-500 group-focus-within:text-purple-500 transition-colors" />}
          placeholder="John Doe"
          rules={[{ required: true, message: "Please enter your name!" }]}
          className="rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300 py-3 hover:border-blue-300"
        />
      </div>

      {/* Email Field with Floating Label Effect */}
      <div className="group">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          prefix={<MailOutlined className="text-blue-500 group-focus-within:text-purple-500 transition-colors" />}
          placeholder="john@example.com"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Enter a valid email!" },
          ]}
          className="rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300 py-3 hover:border-blue-300"
        />
      </div>

      {/* Password Field with Floating Label Effect */}
      <div className="group">
        <InputField
          label="Password"
          name="password"
          type="password"
          prefix={<LockOutlined className="text-blue-500 group-focus-within:text-purple-500 transition-colors" />}
          placeholder="••••••••"
          rules={[{ required: true, message: "Please enter your password!" }]}
          className="rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-300 py-3 hover:border-blue-300"
        />
      </div>

      {/* Enhanced Button */}
      <Form.Item className="mb-0 mt-8">
        <PrimaryButton 
          isLoading={isLoading} 
          htmlType="submit" 
          text="Create Account"
          className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border-0 text-white"
        />
      </Form.Item>
    </Form>

    {/* Enhanced Footer */}
    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="text-gray-600 font-medium">
        Already part of our community?{" "}
        <Link
          to="/signin"
          className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:underline"
        >
          Sign In Here
        </Link>
      </p>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -z-10 top-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-xl opacity-30"></div>
    <div className="absolute -z-10 bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30"></div>
</>
  );
};

export default SignUp;