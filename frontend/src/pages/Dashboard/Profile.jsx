import React from "react";
import { Layout, Menu, Avatar, Button, Form, Input, DatePicker } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UploadOutlined,
  HeartOutlined,
  SettingOutlined,
  SaveOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

// Single-file React component using Ant Design components + Tailwind CSS classes
// File name: Profile.jsx

export default function Profile() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Saved values:", values);
    // replace with API call / state update as needed
  };

  return (
   <div className="max-w-4xl mx-auto p-6">
  <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-2xl border border-white/80 backdrop-blur-sm overflow-hidden">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
      <h2 className="text-3xl font-bold text-white mb-3">Personal Information</h2>
      <p className="text-blue-100 text-lg">
        Manage your account details and preferences
      </p>
    </div>

    <div className="p-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-8 mb-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="relative">
          <Avatar
            size={80}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xl border-4 border-white"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Picture</h3>
          <p className="text-gray-500 text-sm mb-4">Update your avatar and profile image</p>
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Change Avatar
            </button>
            <button className="border-2 border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ fullName: "zahim", email: "zahimkhan@gmail.com" }}
        onFinish={onFinish}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Form.Item
            name="fullName"
            label={<span className="font-semibold text-gray-700 text-lg">Full Name</span>}
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input 
              placeholder="Enter your full name" 
              size="large"
              className="h-14 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300 shadow-sm"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="font-semibold text-gray-700 text-lg">Email Address</span>}
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
              className="h-14 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300 shadow-sm"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Form.Item 
            name="phone" 
            label={<span className="font-semibold text-gray-700 text-lg">Phone Number</span>}
          >
            <Input 
              placeholder="+1 (555) 123-4567" 
              size="large"
              className="h-14 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300 shadow-sm"
              prefix={<PhoneOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item 
            name="dob" 
            label={<span className="font-semibold text-gray-700 text-lg">Date of Birth</span>}
          >
            <DatePicker 
              className="w-full h-14 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300 shadow-sm"
              size="large"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl text-lg flex items-center gap-3 group"
          >
            <SaveOutlined className="group-hover:scale-110 transition-transform duration-300" />
            Save Changes
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </Form>
    </div>
  </div>
</div>
  );
}
