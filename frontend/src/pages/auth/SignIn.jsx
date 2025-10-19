import React, { useState } from "react";
import { Form, message } from "antd";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const SignIn = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data) {
        message.success("Login successful");
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/dashboard");
      } else {
        message.error(data?.message || "Invalid credentials");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Sign In
      </h1>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <InputField
          label="Email"
          name="email"
          type="email"
          prefix={<MailOutlined />}
          placeholder="Enter your email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          prefix={<LockOutlined />}
          placeholder="Enter your password"
          rules={[{ required: true, message: "Please enter your password" }]}
        />

        <Form.Item>
          <PrimaryButton
            isLoading={isLoading}
            htmlType="submit"
            text="Sign In"
          />
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Don’t have an account?
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium ml-1"
          >
            Sign Up
          </Link>
        </p>
        <p className="mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </>

    


  );
};

export default SignIn;
