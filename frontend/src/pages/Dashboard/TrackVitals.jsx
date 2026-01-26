import React, { useState, useEffect, useCallback } from "react";
import { Card, Input, Button, message, Table, Empty, Progress, Tag, Tooltip, Popconfirm, Statistic, Row, Col } from "antd";
import { HeartOutlined, FireOutlined, DownOutlined, DashboardOutlined, DeleteOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../../utils/axiosSetup";

// Pre-define color classes for Tailwind to include them in the build
const colorClasses = {
  green: { text: "text-green-600", border: "border-green-300", borderFocus: "border-green-500" },
  orange: { text: "text-orange-600", border: "border-orange-300", borderFocus: "border-orange-500" },
  red: { text: "text-red-600", border: "border-red-300", borderFocus: "border-red-500" },
};

const TrackVitals = () => {
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper function to determine vital status
  const getVitalStatus = (vital, value) => {
    const num = parseFloat(value);
    if (!num) return null;

    const ranges = {
      heartRate: { normal: [60, 100], warning: [50, 120], critical: [0, 150] },
      temperature: { normal: [36.5, 37.5], warning: [36, 38.5], critical: [-100, 100] },
      oxygenSaturation: { normal: [95, 100], warning: [90, 94], critical: [0, 100] },
    };

    const range = ranges[vital];
    if (!range) return null;

    if (num >= range.normal[0] && num <= range.normal[1]) return { status: "normal", color: "green", icon: CheckCircleOutlined };
    if (num >= range.warning[0] && num <= range.warning[1]) return { status: "warning", color: "orange", icon: WarningOutlined };
    return { status: "critical", color: "red", icon: CloseCircleOutlined };
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!bloodPressure.trim()) newErrors.bloodPressure = "Required";
    if (!heartRate.trim()) newErrors.heartRate = "Required";
    if (!temperature.trim()) newErrors.temperature = "Required";
    if (!oxygenSaturation.trim()) newErrors.oxygenSaturation = "Required";

    const hrNum = parseFloat(heartRate);
    if (hrNum && (hrNum < 30 || hrNum > 200)) newErrors.heartRate = "Invalid range (30-200)";

    const tempNum = parseFloat(temperature);
    if (tempNum && (tempNum < 35 || tempNum > 42)) newErrors.temperature = "Invalid range (35-42°C)";

    const o2Num = parseFloat(oxygenSaturation);
    if (o2Num && (o2Num < 50 || o2Num > 100)) newErrors.oxygenSaturation = "Invalid range (50-100%)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all vitals
  const fetchVitals = useCallback(async (signal) => {
    try {
      setRefreshing(true);
      const res = await api.get("/vital/vitals", { signal });
      if (res.data?.vitals) {
        setVitals(res.data.vitals);
      }
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error(error);
        message.error("Failed to fetch vitals");
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchVitals(controller.signal);
    return () => controller.abort();
  }, [fetchVitals]);

  const handleSave = async () => {
    if (!validateInputs()) {
      message.error("Please check all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/vital/add-vital", {
        bloodPressure,
        heartRate,
        temperature,
        oxygenSaturation,
      });

      if (res.data?.status === 201) {
        message.success("Vital saved successfully ✓");
        setBloodPressure("");
        setHeartRate("");
        setTemperature("");
        setOxygenSaturation("");
        setErrors({});
        fetchVitals();
      } else {
        message.error(res.data?.message || "Failed to save vital");
      }
    } catch (error) {
      console.error(error);
      message.error("Error saving vital");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/vital/vitals/${id}`);

      if (res.data?.status === 200) {
        message.success("Vital deleted successfully");
        fetchVitals();
      } else {
        message.error(res.data?.message || "Failed to delete vital");
      }
    } catch (error) {
      console.error(error);
      message.error("Error deleting vital");
    }
  };

  // Calculate stats safely with array length checks
  const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  const avgHeartRate = vitals.length > 0 
    ? Math.round(vitals.reduce((sum, v) => sum + parseFloat(v.heartRate || 0), 0) / vitals.length)
    : 0;
  const lastRecordedDate = latestVital 
    ? new Date(latestVital.createdAt).toLocaleDateString() 
    : "N/A";

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (date) => {
        const d = new Date(date);
        return <span className="font-medium">{d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
      },
    },
    {
      title: "Blood Pressure",
      dataIndex: "bloodPressure",
      key: "bloodPressure",
      width: "15%",
      render: (text) => <span className="font-semibold text-blue-600">{text} mmHg</span>,
    },
    {
      title: "Heart Rate",
      dataIndex: "heartRate",
      key: "heartRate",
      width: "15%",
      render: (text) => {
        const status = getVitalStatus("heartRate", text);
        const IconComponent = status?.icon;
        const textClass = status ? colorClasses[status.color]?.text : "";
        return (
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent style={{ color: status.color }} />}
            <span className={`font-semibold ${textClass}`}>{text} bpm</span>
          </div>
        );
      },
    },
    {
      title: "Temperature",
      dataIndex: "temperature",
      key: "temperature",
      width: "15%",
      render: (text) => {
        const status = getVitalStatus("temperature", text);
        const IconComponent = status?.icon;
        const textClass = status ? colorClasses[status.color]?.text : "";
        return (
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent style={{ color: status.color }} />}
            <span className={`font-semibold ${textClass}`}>{text}°C</span>
          </div>
        );
      },
    },
    {
      title: "O₂ Saturation",
      dataIndex: "oxygenSaturation",
      key: "oxygenSaturation",
      width: "15%",
      render: (text) => {
        const status = getVitalStatus("oxygenSaturation", text);
        const IconComponent = status?.icon;
        const textClass = status ? colorClasses[status.color]?.text : "";
        return (
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent style={{ color: status.color }} />}
            <span className={`font-semibold ${textClass}`}>{text}%</span>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          title="Delete Vital"
          description="Are you sure you want to delete this record?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const VitalInputField = ({ label, icon: Icon, placeholder, value, onChange, error, hint, unit }) => {
    const status = getVitalStatus(label.toLowerCase().replace(/\s+/g, ""), value);
    const StatusIcon = status?.icon;
    const borderClass = status ? colorClasses[status.color]?.border : "";
    const borderFocusClass = status ? colorClasses[status.color]?.borderFocus : "";

    return (
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Icon className="text-lg" style={{ color: status?.color || "#6B7280" }} />
          {label}
          {unit && <span className="text-xs text-gray-500">({unit})</span>}
        </label>
        <div className="relative">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`rounded-lg h-12 text-base font-medium ${
              error 
                ? "border-red-500 focus:border-red-500" 
                : status 
                ? `${borderClass} focus:${borderFocusClass}`
                : ""
            }`}
            status={error ? "error" : ""}
          />
          {value && StatusIcon && (
            <div className="absolute right-3 top-3">
              <StatusIcon style={{ color: status.color, fontSize: "20px" }} />
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {error}</p>}
        {hint && !error && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4" style={{ backgroundColor: "#F7F9FC" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: "#0F4C81" }}>
            Track Vitals
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "#1F2933" }}>Monitor your daily health measurements and track trends</p>
        </div>

        {/* Stats Row */}
        {vitals.length > 0 && (
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={8}>
              <Card className="rounded-2xl shadow-md border-0 bg-white hover:shadow-lg transition-shadow">
                <Statistic
                  title="Total Recordings"
                  value={vitals.length}
                  prefix={<DashboardOutlined style={{ color: "#0F4C81" }} />}
                  valueStyle={{ color: "#0F4C81", fontSize: "28px", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="rounded-2xl shadow-md border-0 bg-white hover:shadow-lg transition-shadow">
                <Statistic
                  title="Average Heart Rate"
                  value={avgHeartRate}
                  suffix="bpm"
                  prefix={<HeartOutlined className="text-red-500" />}
                  valueStyle={{ color: "#EF4444", fontSize: "28px", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="rounded-2xl shadow-md border-0 bg-white hover:shadow-lg transition-shadow">
                <Statistic
                  title="Last Recorded"
                  value={lastRecordedDate}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  valueStyle={{ color: "#10B981", fontSize: "20px", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Input Form */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 mb-6 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <DashboardOutlined className="text-blue-600" />
              Add New Vital Signs
            </h2>
            <p className="text-gray-600">Record your health measurements now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <VitalInputField
              label="Blood Pressure"
              icon={HeartOutlined}
              placeholder="e.g., 120/80"
              value={bloodPressure}
              onChange={(e) => { setBloodPressure(e.target.value); setErrors({ ...errors, bloodPressure: "" }); }}
              error={errors.bloodPressure}
              unit="mmHg"
              hint="Systolic/Diastolic"
            />

            <VitalInputField
              label="Heart Rate"
              icon={FireOutlined}
              placeholder="e.g., 72"
              value={heartRate}
              onChange={(e) => { setHeartRate(e.target.value); setErrors({ ...errors, heartRate: "" }); }}
              error={errors.heartRate}
              unit="bpm"
              hint="Normal: 60-100 bpm"
            />

            <VitalInputField
              label="Temperature"
              icon={FireOutlined}
              placeholder="e.g., 37"
              value={temperature}
              onChange={(e) => { setTemperature(e.target.value); setErrors({ ...errors, temperature: "" }); }}
              error={errors.temperature}
              unit="°C"
              hint="Normal: 36.5-37.5°C"
            />

            <VitalInputField
              label="Oxygen Saturation"
              icon={DownOutlined}
              placeholder="e.g., 98"
              value={oxygenSaturation}
              onChange={(e) => { setOxygenSaturation(e.target.value); setErrors({ ...errors, oxygenSaturation: "" }); }}
              error={errors.oxygenSaturation}
              unit="%"
              hint="Normal: 95-100%"
            />
          </div>

          <Button 
            type="primary" 
            size="large"
            className="w-full h-12 text-base font-bold rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-md hover:shadow-lg transition-all" 
            onClick={handleSave} 
            loading={loading}
          >
            {loading ? "Saving..." : "💾 Save Vitals"}
          </Button>
        </Card>

        {/* Vitals History */}
        <Card className="rounded-2xl shadow-lg border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 mb-6 rounded-xl border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <DownOutlined className="text-purple-600" />
              Vital Records History
            </h2>
            <p className="text-gray-600 mt-1">{vitals.length} measurements recorded</p>
          </div>

          {vitals.length === 0 ? (
            <Empty 
              description={
                <div className="text-center py-8">
                  <DashboardOutlined style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px" }} />
                  <p className="text-gray-600 text-lg">No vitals recorded yet</p>
                  <p className="text-gray-500 text-sm">Start by adding your first vital signs above</p>
                </div>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={vitals.map((v, i) => ({ ...v, key: v._id || i }))}
                loading={refreshing}
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} records`,
                  style: { marginTop: "16px" }
                }}
                rowClassName={(record, index) => index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrackVitals;