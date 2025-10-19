import React from "react";
import { Form, message } from "antd";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { LockOutlined } from "@ant-design/icons";
import { Link } from "react-router";

const ResetPassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Password Reset Data:", values);
    message.success("Your password has been successfully reset!");
    form.resetFields();
  };

  return (
<>
  <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
    {/* Header Section */}
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <LockOutlined className="text-white text-2xl" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
      <p className="text-gray-500 text-lg">Create a new secure password for your account</p>
    </div>

    <Form layout="vertical" form={form} onFinish={onFinish} className="space-y-6">
      {/* New Password Field */}
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: "Please enter your new password!" }]}
        className="font-semibold"
      >
        <Input.Password 
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Enter your new password"
          className="h-12 rounded-lg border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
          size="large"
        />
      </Form.Item>

      {/* Confirm Password Field */}
      <Form.Item
        label="Confirm New Password"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
        className="font-semibold"
      >
        <Input.Password 
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Confirm your new password"
          className="h-12 rounded-lg border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
          size="large"
        />
      </Form.Item>

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-2">Password Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            At least 8 characters long
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            Include uppercase and lowercase letters
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            Include at least one number
          </li>
        </ul>
      </div>

      {/* Reset Password Button */}
      <Form.Item className="mb-0">
        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-0 text-lg flex items-center justify-center gap-2"
        >
          <LockOutlined />
          Reset Password
        </button>
      </Form.Item>
    </Form>

    {/* Back to Sign In */}
    <div className="text-center mt-6 pt-6 border-t border-gray-200">
      <p className="text-gray-600">
        Remember your password?{" "}
        <Link
          to="/signin"
          className="text-green-600 hover:text-green-700 font-semibold underline hover:no-underline transition-all"
        >
          Back to Sign In
        </Link>
      </p>
    </div>
  </div>
</>
  );
};

export default ResetPassword;
