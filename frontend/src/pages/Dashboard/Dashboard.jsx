import React from "react";
import { Card, Row, Col, Button } from "antd";
import {
  FileTextOutlined,
  HeartOutlined,
  RobotOutlined,
  LineChartOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
  {/* Header */}
  <div className="mb-12">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-3">
      Health Dashboard
    </h1>
    <p className="text-gray-500 text-lg font-medium">Comprehensive overview of your wellness journey</p>
  </div>

  {/* Top Summary Cards - Enhanced */}
  <Row gutter={[24, 24]} className="mb-16">
    <Col xs={24} sm={12} md={6}>
      <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Health Records</span>
          <div className="p-2 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <FileTextOutlined className="text-blue-600 text-xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-1">12</h2>
        <p className="text-sm text-gray-500 font-medium">Recent reports</p>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>
    </Col>

    <Col xs={24} sm={12} md={6}>
      <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Vital Signs</span>
          <div className="p-2 bg-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <HeartOutlined className="text-green-500 text-xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-1">Normal</h2>
        <p className="text-sm text-gray-500 font-medium">All within range</p>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>
    </Col>

    <Col xs={24} sm={12} md={6}>
      <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">AI Insights</span>
          <div className="p-2 bg-teal-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <RobotOutlined className="text-teal-500 text-xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent mb-1">3</h2>
        <p className="text-sm text-gray-500 font-medium">New recommendations</p>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-teal-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>
    </Col>

    <Col xs={24} sm={12} md={6}>
      <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Activity</span>
          <div className="p-2 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <LineChartOutlined className="text-blue-500 text-xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-1">Active</h2>
        <p className="text-sm text-gray-500 font-medium">Last updated today</p>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>
    </Col>
  </Row>

  {/* Bottom Action Cards - Enhanced */}
  <Row gutter={[24, 24]}>
    <Col xs={24} md={8}>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-blue-100 text-center group relative overflow-hidden">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <UploadOutlined className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Upload Report</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Add new medical reports or test results for analysis
        </p>
        <Link to="/upload">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0">
            Upload Now
          </button>
        </Link>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-green-100 text-center group relative overflow-hidden">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <FolderOpenOutlined className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">View Reports</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Access and manage all your medical documents securely
        </p>
        <Link to="/reports">
          <button className="w-full bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View All
          </button>
        </Link>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-purple-100 text-center group relative overflow-hidden">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <AreaChartOutlined className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Track Vitals</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Monitor and record your daily health measurements
        </p>
        <Link to="/vitals">
          <button className="w-full bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Track Now
          </button>
        </Link>
      </div>
    </Col>
  </Row>
</div>
  );
};

export default Dashboard;