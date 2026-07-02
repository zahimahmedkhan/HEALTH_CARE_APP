import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, Spin, Empty, Tag, message } from "antd";
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
import PrimaryButton from "../../components/PrimaryButton";

const Dashboard = () => {
  const [vitals, setVitals] = useState([]);
  const [recentReport, setRecentReport] = useState(null);
  const [loadingVitals, setLoadingVitals] = useState(true);
  const [loadingReport, setLoadingReport] = useState(true);

  const fetchVitals = useCallback(async (signal) => {
    try {
      setLoadingVitals(true);
      const response = await api.get("/vitals", { signal });
      if (response.data?.vitals) {
        // Get the 3 most recent vitals
        const sortedVitals = response.data.vitals
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
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
    <div className="min-h-screen px-3 py-4 sm:p-6" style={{ backgroundColor: "var(--bg)" }}>
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
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>Health Records</span>
              <div className="p-2 rounded" style={{ backgroundColor: "transparent" }}>
                <FileTextOutlined style={{ fontSize: 18, color: "var(--primary)" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>12</h2>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Recent reports</p>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>Vital Signs</span>
              <div className="p-2 rounded" style={{ backgroundColor: "transparent" }}>
                <HeartOutlined style={{ fontSize: 18, color: "var(--success)" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>Normal</h2>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>All within range</p>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>AI Insights</span>
              <div className="p-2 rounded" style={{ backgroundColor: "transparent" }}>
                <RobotOutlined style={{ fontSize: 18, color: "var(--primary)" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>3</h2>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>New recommendations</p>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>Activity</span>
              <div className="p-2 rounded" style={{ backgroundColor: "transparent" }}>
                <LineChartOutlined style={{ fontSize: 18, color: "var(--primary)" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>Active</h2>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Last updated today</p>
          </div>
        </Col>
      </Row>

      {/* Recent Vitals and Reports Section */}
      <Row gutter={[24, 24]} className="mb-16">
        {/* Recent Vitals */}
        <Col xs={24} md={12}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Recent Vitals</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Your latest health measurements</p>
              </div>
              <Link to="/vitals">
                <Button type="primary" size="small" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}>View All</Button>
              </Link>
            </div>

            {loadingVitals ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : vitals.length > 0 ? (
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <div key={vital._id} className="p-4 rounded-lg border" style={{ background: 'transparent', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: "var(--primary)", background: 'rgba(37,99,235,0.06)' }}>{formatDate(vital.createdAt)}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--success)", background: 'rgba(34,197,94,0.06)', padding: '4px 8px', borderRadius: 8 }}>Recorded</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>BP</p>
                        <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{vital.bloodPressure}</p>
                      </div>
                      <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>HR</p>
                        <p className="text-lg font-bold" style={{ color: "var(--danger)" }}>{vital.heartRate} bpm</p>
                      </div>
                      <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>Temp</p>
                        <p className="text-lg font-bold" style={{ color: "var(--warning)" }}>{vital.temperature}°C</p>
                      </div>
                      <div className="p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>O2 Sat</p>
                        <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>{vital.oxygenSaturation}%</p>
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
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Recent Report</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Your latest uploaded document</p>
              </div>
              <Link to="/reports">
                <Button type="primary" size="small" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}>View All</Button>
              </Link>
            </div>

            {loadingReport ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : recentReport ? (
              <div className="p-6 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                        <FileTextOutlined style={{ color: 'white' }} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold truncate" style={{ color: "var(--text)" }}>{recentReport.reportName || "Medical Report"}</h4>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{formatDate(recentReport.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <Tag style={{ backgroundColor: "var(--primary)", color: "white" }} className="font-semibold border-0">NEW</Tag>
                </div>

                <div className="p-4 mb-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'transparent' }}>
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    <span className="font-semibold">Type: </span>
                    <span className="font-semibold capitalize" style={{ color: "var(--primary)" }}>{recentReport.reportType}</span>
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>AI analysis completed and ready for review</p>
                </div>

                <Link to={`/reports`}>
                  <PrimaryButton htmlType="button" text="View Analysis" onClick={() => {}} />
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
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <UploadOutlined />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Upload Report</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>Add new medical reports or test results for analysis</p>
            <Link to="/upload-reports"><PrimaryButton htmlType="button" text="Upload Now" onClick={() => {}} /></Link>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--success)', color: 'white' }}>
              <FolderOpenOutlined />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>View Reports</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>Access and manage all your medical documents securely</p>
            <Link to="/reports"><Button className="w-full" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>View All</Button></Link>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <AreaChartOutlined />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Track Vitals</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>Monitor and record your daily health measurements</p>
            <Link to="/vitals"><Button className="w-full" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>Track Now</Button></Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;