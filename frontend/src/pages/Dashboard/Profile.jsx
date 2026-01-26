import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Form, Input, DatePicker, message, Spin } from "antd";
import {
  UserOutlined,
  SaveOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosSetup";

export default function Profile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (signal) => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      message.error("Authentication token missing. Please login again.");
      navigate("/signin");
      return;
    }
    
    try {
      setFetching(true);
      const res = await api.get("/auth/user-profile", { signal });

      if (res.data?.user) {
        setUserData(res.data.user);
        setAvatarPreview(res.data.user.avatar);
        form.setFieldsValue({
          fullName: res.data.user.userName,
          email: res.data.user.email,
          phone: res.data.user.phone || "",
          dob: res.data.user.dob ? dayjs(res.data.user.dob) : null,
        });
      }
    } catch (error) {
      if (error.name === 'CanceledError') return;
      
      console.error("Profile fetch error:", error);
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
      } else {
        message.error(error.response?.data?.message || "Failed to fetch profile");
      }
    } finally {
      setFetching(false);
    }
  }, [form, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("Please login first");
      navigate("/signin");
      return;
    }
    
    const controller = new AbortController();
    fetchUserProfile(controller.signal);
    return () => controller.abort();
  }, [fetchUserProfile, navigate]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        message.error("Please upload an image file");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        message.error("File size must be less than 5MB");
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("userName", values.fullName);
      formData.append("phone", values.phone || "");
      formData.append("dob", values.dob ? values.dob.toISOString() : "");
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Use api instance with proper headers for multipart form data
      const res = await api.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.status === 200) {
        message.success(res.data?.message || "Profile updated successfully");
        setAvatarFile(null);
        await fetchUserProfile();
      } else {
        message.error(res.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:p-6" style={{ backgroundColor: "#F7F9FC" }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl shadow-2xl border border-white/80 backdrop-blur-sm overflow-hidden" style={{ backgroundColor: "white" }}>
          {/* Header Section */}
          <div className="p-5 sm:p-8" style={{ backgroundImage: "linear-gradient(135deg, #0F4C81 0%, #2EC4B6 100%)" }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Personal Information</h2>
            <p className="text-white/80 text-base sm:text-lg">
              Manage your account details and preferences
            </p>
          </div>

          <div className="p-4 sm:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8 sm:mb-12 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border" style={{ borderColor: "#2EC4B6", backgroundColor: "#F7F9FC" }}>
            <div className="relative">
              <Avatar
                size={100}
                src={avatarPreview}
                icon={!avatarPreview && <UserOutlined />}
                className="text-white shadow-xl border-4 border-white"
                style={{ backgroundColor: "#0F4C81" }}
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1F2933" }}>Profile Picture</h3>
              <p className="text-sm mb-4" style={{ color: "#1F2933" }}>Update your avatar and profile image</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label className="text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer text-center" style={{ backgroundImage: "linear-gradient(135deg, #0F4C81, #2EC4B6)" }}>
                  Change Avatar
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(userData?.avatar || null);
                  }}
                  className="border-2 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md text-center"
                  style={{ borderColor: "#0F4C81", color: "#0F4C81", backgroundColor: "white" }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Form.Item
                name="fullName"
                label={<span className="font-semibold text-lg" style={{ color: "#1F2933" }}>Full Name</span>}
                rules={[{ required: true, message: "Please enter your full name" }]}
              >
                <Input 
                  placeholder="Enter your full name" 
                  size="large"
                  className="h-14 rounded-xl border-2 transition-colors duration-300 shadow-sm"
                  style={{ borderColor: "#2EC4B6", color: "#1F2933" }}
                  prefix={<UserOutlined style={{ color: "#0F4C81" }} />}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="font-semibold text-lg" style={{ color: "#1F2933" }}>Email Address</span>}
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input 
                  placeholder="your.email@example.com" 
                  size="large"
                  disabled
                  className="h-14 rounded-xl border-2 transition-colors duration-300 shadow-sm"
                  style={{ borderColor: "#2EC4B6", color: "#1F2933", backgroundColor: "#F7F9FC" }}
                  prefix={<MailOutlined style={{ color: "#0F4C81" }} />}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Form.Item 
                name="phone" 
                label={<span className="font-semibold text-lg" style={{ color: "#1F2933" }}>Phone Number</span>}
              >
                <Input 
                  placeholder="+1 (555) 123-4567" 
                  size="large"
                  className="h-14 rounded-xl border-2 transition-colors duration-300 shadow-sm"
                  style={{ borderColor: "#2EC4B6", color: "#1F2933" }}
                  prefix={<PhoneOutlined style={{ color: "#0F4C81" }} />}
                />
              </Form.Item>

              <Form.Item 
                name="dob" 
                label={<span className="font-semibold text-lg" style={{ color: "#1F2933" }}>Date of Birth</span>}
              >
                <DatePicker 
                  className="w-full h-14 rounded-xl border-2 transition-colors duration-300 shadow-sm"
                  style={{ borderColor: "#2EC4B6", color: "#1F2933" }}
                  size="large"
                  suffixIcon={<CalendarOutlined style={{ color: "#0F4C81" }} />}
                />
              </Form.Item>
            </div>

            {/* Save Button */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-6 gap-3 sm:gap-4" style={{ borderTopColor: "#E0E7FF", borderTopWidth: "1px" }}>
              <Button
                size="large"
                style={{ color: "#0F4C81", borderColor: "#0F4C81" }}
                className="font-semibold rounded-lg w-full sm:w-auto"
              >
                Cancel
              </Button>
              <button
                type="submit"
                className="text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                style={{ backgroundImage: "linear-gradient(135deg, #0F4C81, #2EC4B6)" }}
                disabled={loading}
              >
                <SaveOutlined className="group-hover:scale-110 transition-transform duration-300" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
