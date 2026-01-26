import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Button, Spin, Empty, Tag, message } from "antd";
import {
  FileTextOutlined,
  HeartOutlined,
  RobotOutlined,
  LineChartOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  AreaChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../utils/axiosSetup";

const Dashboard = () => {
  const [vitals, setVitals] = useState([]);
  const [recentReport, setRecentReport] = useState(null);
  const [loadingVitals, setLoadingVitals] = useState(true);
  const [loadingReport, setLoadingReport] = useState(true);

  const fetchVitals = useCallback(async (signal) => {
    try {
      setLoadingVitals(true);
      const response = await api.get("/vital/vitals", { signal });
      if (response.data?.vitals) {
        // Get the 3 most recent vitals
        const sortedVitals = response.data.vitals
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setVitals(sortedVitals);
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error("Error fetching vitals:", error);
      }
    } finally {
      setLoadingVitals(false);
    }
  }, []);

  const fetchRecentReport = useCallback(async (signal) => {
    try {
      setLoadingReport(true);
      const response = await api.get("/ai/insights", { signal });
      if (response.data?.insights?.length > 0) {
        // Get the most recent insight/report
        const sortedInsights = response.data.insights.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentReport(sortedInsights[0]);
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error("Error fetching report:", error);
      }
    } finally {
      setLoadingReport(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchVitals(controller.signal);
    fetchRecentReport(controller.signal);
    
    return () => controller.abort();
  }, [fetchVitals, fetchRecentReport]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:p-6" style={{ backgroundColor: "#F7F9FC" }}>
      {/* Header */}
      <div className="mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3" style={{ color: "#0F4C81" }}>
          Health Dashboard
        </h1>
        <p className="text-base sm:text-lg font-medium" style={{ color: "#1F2933" }}>Comprehensive overview of your wellness journey</p>
      </div>

      {/* Top Summary Cards - Enhanced */}
      <Row gutter={[24, 24]} className="mb-16">
        <Col xs={24} sm={12} md={6}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, #0F4C81, #2EC4B6)` }}></div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#1F2933" }}>Health Records</span>
              <div className="p-2 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#F7F9FC" }}>
                <FileTextOutlined className="text-xl" style={{ color: "#0F4C81" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "#1F2933" }}>12</h2>
            <p className="text-sm font-medium" style={{ color: "#1F2933" }}>Recent reports</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300" style={{ backgroundColor: "#2EC4B6" }}></div>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#1F2933" }}>Vital Signs</span>
              <div className="p-2 bg-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <HeartOutlined className="text-green-500 text-xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-1">Normal</h2>
            <p className="text-sm font-medium" style={{ color: "#1F2933" }}>All within range</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, #2EC4B6, #0F4C81)` }}></div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#1F2933" }}>AI Insights</span>
              <div className="p-2 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#F7F9FC" }}>
                <RobotOutlined className="text-xl" style={{ color: "#2EC4B6" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent mb-1" style={{ backgroundImage: `linear-gradient(to right, #2EC4B6, #0F4C81)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3</h2>
            <p className="text-sm font-medium" style={{ color: "#1F2933" }}>New recommendations</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300" style={{ backgroundColor: "#2EC4B6" }}></div>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/80 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, #0F4C81, #2EC4B6)` }}></div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#1F2933" }}>Activity</span>
              <div className="p-2 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#F7F9FC" }}>
                <LineChartOutlined className="text-xl" style={{ color: "#0F4C81" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent mb-1" style={{ backgroundImage: `linear-gradient(to right, #0F4C81, #2EC4B6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Active</h2>
            <p className="text-sm font-medium" style={{ color: "#1F2933" }}>Last updated today</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300" style={{ backgroundColor: "#0F4C81" }}></div>
          </div>
        </Col>
      </Row>

      {/* Recent Vitals and Reports Section */}
      <Row gutter={[24, 24]} className="mb-16">
        {/* Recent Vitals */}
        <Col xs={24} md={12}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "#1F2933" }}>Recent Vitals</h3>
                <p className="text-sm mt-1" style={{ color: "#1F2933" }}>Your latest health measurements</p>
              </div>
              <Link to="/vitals">
                <Button type="primary" size="small" style={{ backgroundColor: "#0F4C81", borderColor: "#0F4C81" }}>
                  View All
                </Button>
              </Link>
            </div>

            {loadingVitals ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : vitals.length > 0 ? (
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <div key={vital._id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold bg-purple-100 px-3 py-1 rounded-full" style={{ color: "#0F4C81" }}>
                        {formatDate(vital.createdAt)}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Recorded</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-purple-100">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1F2933" }}>BP</p>
                        <p className="text-lg font-bold" style={{ color: "#1F2933" }}>{vital.bloodPressure}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-red-100">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1F2933" }}>HR</p>
                        <p className="text-lg font-bold text-red-600">{vital.heartRate} bpm</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-orange-100">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1F2933" }}>Temp</p>
                        <p className="text-lg font-bold text-orange-600">{vital.temperature}°C</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-blue-100">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#1F2933" }}>O2 Sat</p>
                        <p className="text-lg font-bold" style={{ color: "#2EC4B6" }}>{vital.oxygenSaturation}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No vitals recorded yet" className="py-8" />
            )}
          </div>
        </Col>

        {/* Recent Report */}
        <Col xs={24} md={12}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: `linear-gradient(to right, #0F4C81, #2EC4B6)` }}></div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "#1F2933" }}>Recent Report</h3>
                <p className="text-sm mt-1" style={{ color: "#1F2933" }}>Your latest uploaded document</p>
              </div>
              <Link to="/reports">
                <Button type="primary" size="small" style={{ backgroundColor: "#2EC4B6", borderColor: "#2EC4B6" }}>
                  View All
                </Button>
              </Link>
            </div>

            {loadingReport ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : recentReport ? (
              <div className="rounded-2xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: "#F7F9FC" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundImage: `linear-gradient(135deg, #0F4C81, #2EC4B6)` }}>
                        <FileTextOutlined className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold truncate" style={{ color: "#1F2933" }}>
                          {recentReport.reportName || "Medical Report"}
                        </h4>
                        <p className="text-xs" style={{ color: "#1F2933" }}>{formatDate(recentReport.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <Tag style={{ backgroundColor: "#2EC4B6", color: "white" }} className="font-semibold border-0">NEW</Tag>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4 border border-blue-100">
                  <p className="text-sm" style={{ color: "#1F2933" }}>
                    <span className="font-semibold">Type: </span>
                    <span className="font-semibold capitalize" style={{ color: "#0F4C81" }}>{recentReport.reportType}</span>
                  </p>
                  <p className="text-xs mt-2" style={{ color: "#1F2933" }}>
                    AI analysis completed and ready for review
                  </p>
                </div>

                <Link to={`/reports`}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    className="w-full font-semibold border-0"
                    style={{ backgroundImage: `linear-gradient(to right, #0F4C81, #2EC4B6)` }}
                  >
                    View Analysis
                  </Button>
                </Link>
              </div>
            ) : (
              <Empty description="No reports uploaded yet" className="py-8" />
            )}
          </div>
        </Col>
      </Row>

      {/* Bottom Action Cards - Enhanced */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div className="rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border text-center group relative overflow-hidden" style={{ backgroundColor: "white", borderColor: "#2EC4B6" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6)" }}>
              <UploadOutlined className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#1F2933" }}>Upload Report</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "#1F2933" }}>
              Add new medical reports or test results for analysis
            </p>
            <Link to="/upload-reports">
              <button className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0" style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6)" }}>
                Upload Now
              </button>
            </Link>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border text-center group relative overflow-hidden" style={{ backgroundColor: "white", borderColor: "#0F4C81" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg bg-green-500">
              <FolderOpenOutlined className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#1F2933" }}>View Reports</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "#1F2933" }}>
              Access and manage all your medical documents securely
            </p>
            <Link to="/reports">
              <button className="w-full bg-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2" style={{ color: "#0F4C81", borderColor: "#0F4C81" }}>
                View All
              </button>
            </Link>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border text-center group relative overflow-hidden" style={{ backgroundColor: "white", borderColor: "#2EC4B6" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ backgroundImage: "linear-gradient(to right, #2EC4B6, #0F4C81)" }}>
              <AreaChartOutlined className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#1F2933" }}>Track Vitals</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "#1F2933" }}>
              Monitor and record your daily health measurements
            </p>
            <Link to="/vitals">
              <button className="w-full bg-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2" style={{ color: "#2EC4B6", borderColor: "#2EC4B6" }}>
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