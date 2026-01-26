import React, { useState } from "react";
import { Form, message, Input, Button, Divider, Alert } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      setErrors({});

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data?.status === 200 && data?.accessToken) {
        message.success("✓ Login successful! Redirecting...", 2);
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        message.error(data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Login failed";
      message.error(errorMsg);
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0F4C81" }}>Welcome Back</h2>
        <p className="text-sm" style={{ color: "#1F2933" }}>Sign in to your health account</p>
      </div>

      {errors.general && (
        <Alert
          message={errors.general}
          type="error"
          showIcon
          className="mb-4 rounded-lg"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)" }}
        />
      )}

      <Form 
        layout="vertical" 
        form={form} 
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="font-semibold" style={{ color: "#1F2933" }}>Email Address</span>}
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input
            type="email"
            prefix={<MailOutlined style={{ color: "#2EC4B6" }} />}
            placeholder="you@example.com"
            size="large"
            className="rounded-lg"
            style={{
              backgroundColor: "#F7F9FC",
              borderColor: "#2EC4B6",
              color: "#1F2933"
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold" style={{ color: "#1F2933" }}>Password</span>}
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#2EC4B6" }} />}
            placeholder="••••••••"
            size="large"
            className="rounded-lg"
            style={{
              backgroundColor: "#F7F9FC",
              borderColor: "#2EC4B6",
              color: "#1F2933"
            }}
            iconRender={(visible) => (
              <span  style={{ color: visible ? "#2EC4B6" : "#1F2933", cursor:"pointer" }}>
                {visible ? "👁️" : "👁️‍🗨️"}
              </span>
            )}
          />
        </Form.Item>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium transition-colors"
            style={{ color: "#0F4C81" }}
          >
            Forgot Password?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            icon={<LoginOutlined />}
            className="w-full h-12 border-0 text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6)" }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Form.Item>
      </Form>

      <Divider className="my-6" style={{ borderColor: "#E0E7FF" }}>
        <span style={{ color: "#1F2933" }} className="text-sm">New to HealthPro?</span>
      </Divider>

      <Link to="/">
        <Button
          size="large"
          className="w-full h-12 text-base font-bold rounded-lg transition-all"
          style={{ color: "#0F4C81", borderColor: "#0F4C81" }}
        >
          Create an Account
        </Button>
      </Link>
    </>
  );
};

export default SignIn;
