import React, { useState } from "react";
import { Form, Input, Button, Divider, Alert, Upload, Avatar as AvatarComponent } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, CameraOutlined, LockFilled } from "@ant-design/icons";
import { showError, showSuccess } from "../../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const beforeAvatarUpload = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return Upload.LIST_IGNORE;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return Upload.LIST_IGNORE;
    }
    
    // Set the file for form submission
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Prevent automatic upload
    return false;
  };

  const validatePassword = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    return hasUpper && hasLower && hasNumber && pwd.length >= 8;
  };

  const onFinish = async (value) => {
    try {
      if (!validatePassword(value.password)) {
        setErrors({ password: "Password must be at least 8 characters with uppercase, lowercase, and number" });
        return;
      }

      if (value.password !== value.confirmPassword) {
        setErrors({ confirmPassword: "Passwords don't match" });
        return;
      }

      setLoading(true);
      setErrors({});

      const formData = new FormData();
      formData.append("userName", value.name);
      formData.append("email", value.email);
      formData.append("password", value.password);
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.post(
        `${apiUrl}/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.status === 201) {
        form.resetFields();
        setAvatarFile(null);
        setAvatarPreview(null);
        showSuccess(res.data.message || "✓ Registration successful! Check your email to verify.");
        setTimeout(() => {
          navigate("/auth/email-verification");
        }, 2000);
      } else {
        showError(res.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.message || "Registration failed";
      showError(errorMsg);
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0F4C81" }}>Create Account</h2>
        <p className="text-sm" style={{ color: "#1F2933" }}>Join HealthPro and start managing your health</p>
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
        autoComplete="off"
        className="space-y-4"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <AvatarComponent
              size={80}
              src={avatarPreview}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#0F4C81" }}
            />
            <Upload
              maxCount={1}
              accept="image/*"
              beforeUpload={beforeAvatarUpload}
              showUploadList={false}
            >
              <div className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer hover:opacity-80 transition-opacity shadow-lg" style={{ backgroundColor: "#2EC4B6" }}>
                <CameraOutlined className="text-white text-lg" />
              </div>
            </Upload>
          </div>
          <p className="text-xs mt-2" style={{ color: "#1F2933" }}>Upload your photo (optional)</p>
        </div>

        {/* Full Name */}
        <Form.Item
          label={<span className="font-semibold" style={{ color: "#1F2933" }}>Full Name</span>}
          name="name"
          rules={[
            { required: true, message: "Please enter your full name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#2EC4B6" }} />}
            placeholder="John Doe"
            size="large"
            className="rounded-lg"
            style={{
              backgroundColor: "#F7F9FC",
              borderColor: "#2EC4B6",
              color: "#1F2933"
            }}
          />
        </Form.Item>

        {/* Email */}
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

        {/* Password */}
        <Form.Item
          label={<span className="font-semibold" style={{ color: "#1F2933" }}>Password</span>}
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (validatePassword(value)) return Promise.resolve();
                return Promise.reject(new Error("8+ chars, 1 uppercase, 1 lowercase, 1 number"));
              },
            },
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
              <span style={{ color: visible ? "#2EC4B6" : "#1F2933", cursor:"pointer" }}>
                {visible ? "👁️" : "👁️‍🗨️"}
              </span>
            )}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label={<span className="font-semibold" style={{ color: "#1F2933" }}>Confirm Password</span>}
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords don't match"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockFilled style={{ color: "#2EC4B6" }} />}
            placeholder="••••••••"
            size="large"
            className="rounded-lg"
            style={{
              backgroundColor: "#F7F9FC",
              borderColor: "#2EC4B6",
              color: "#1F2933"
            }}
            iconRender={(visible) => (
              <span style={{ color: visible ? "#2EC4B6" : "#1F2933", cursor:"pointer" }}>
                {visible ? "👁️" : "👁️‍🗨️"}
              </span>
            )}
          />
        </Form.Item>

        {/* Terms & Conditions */}
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            { 
              validator: (_, value) => 
                value ? Promise.resolve() : Promise.reject(new Error("Please accept terms and conditions"))
            },
          ]}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <Input 
              type="checkbox" 
              className="w-4 h-4 rounded cursor-pointer" 
              style={{ width: "16px", height: "16px" }}
            />
            <span className="text-sm" style={{ color: "#1F2933" }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#0F4C81" }} onClick={(e) => e.stopPropagation()}>
                Terms & Conditions
              </a>
            </span>
          </label>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="w-full h-12 border-0 text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6)" }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form.Item>
      </Form>

      <Divider className="my-6" style={{ borderColor: "#E0E7FF" }}>
        <span className="text-sm" style={{ color: "#1F2933" }}>Already have an account?</span>
      </Divider>

      <Link to="/signin">
        <Button
          size="large"
          className="w-full h-12 text-base font-bold rounded-lg transition-all"
          style={{ color: "#0F4C81", borderColor: "#0F4C81" }}
        >
          Sign In
        </Button>
      </Link>
    </>
  );
};

export default SignUp;
