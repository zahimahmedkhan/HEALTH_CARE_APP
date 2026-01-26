import React, { useState } from "react";
import { Form, Input, Select, Button, message, Card, Modal, Progress, Steps, Row, Col, Tag, Alert, Divider } from "antd";
import { CloudUploadOutlined, FileOutlined, CheckCircleOutlined, LoadingOutlined, RobotOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";
import PDFUploader from "../../components/PDFUploader";
import { extractPDFText } from "../../utils/pdfUtils";
import api from "../../utils/axiosSetup";

const { TextArea } = Input;
const { Option } = Select;

const UploadReportForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [extractionProgress, setExtractionProgress] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");

  const reportTypes = [
    { value: "blood-test", label: "Blood Test", icon: "🩸", color: "red" },
    { value: "x-ray", label: "X-Ray", icon: "🔍", color: "orange" },
    { value: "ultrasound", label: "Ultrasound", icon: "📡", color: "cyan" },
    { value: "prescription", label: "Prescription", icon: "💊", color: "green" },
    { value: "other", label: "Other", icon: "📄", color: "purple" },
  ];

  const getTypeInfo = (value) => {
    return reportTypes.find((t) => t.value === value);
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload a PDF file.");
      return;
    }

    if (!values.reportName || !values.reportType) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setCurrentStep(1);

      // Extract PDF text
      let pdfText = "";
      try {
        const progressCallback = (progress) => {
          setExtractionProgress(progress);
        };
        pdfText = await extractPDFText(fileList[0], progressCallback);
        setExtractionProgress("");
      } catch (extractErr) {
        console.error("PDF extraction error:", extractErr);
        setExtractionProgress("");
        message.error("Failed to extract text from PDF: " + extractErr.message);
        setCurrentStep(0);
        return;
      }

      if (!pdfText || pdfText.trim().length === 0) {
        message.error("Failed to extract text from PDF. The PDF might be encrypted or corrupted.");
        setCurrentStep(0);
        return;
      }

      setCurrentStep(2);

      const payload = {
        reportName: values.reportName,
        reportType: values.reportType,
        notes: values.notes || "",
        pdfText,
      };

      const res = await api.post("/ai/analyze", payload);

      if (res.data?.status === 200) {
        setCurrentStep(3);
        message.success("✓ Report submitted and analyzed successfully!");
        setAiSummary(res.data.summery);
        setModalVisible(true);
        setFileList([]);
        form.resetFields();
        setReportName("");
        setReportType("");
        setCurrentStep(0);
      } else {
        message.error(res.data?.message || "Submission failed.");
        setCurrentStep(0);
      }
    } catch (err) {
      console.error("Full error object:", err);
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else if (err.response?.status === 401) {
        message.error("Unauthorized. Please login again.");
      } else if (err.response?.status === 500) {
        message.error("Server error. Please try again later.");
      } else {
        message.error(err.message || "Submission failed. Try again.");
      }
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4" style={{ backgroundColor: "#F7F9FC" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ color: "#0F4C81" }}>
            Upload Medical Report
          </h1>
          <p className="text-base sm:text-lg" style={{ color: "#1F2933" }}>
            Upload your medical documents and get instant AI-powered analysis
          </p>
        </div>

        {/* Process Steps */}
        {loading && (
          <Card className="rounded-xl shadow-md border-0 mb-6 bg-white">
            <Steps
              current={currentStep}
              items={[
                {
                  title: "Extract",
                  description: "Extracting text from PDF",
                  icon: currentStep > 0 ? <CheckCircleOutlined /> : <LoadingOutlined />,
                },
                {
                  title: "Process",
                  description: "Processing with AI",
                  icon: currentStep > 1 ? <CheckCircleOutlined /> : currentStep === 1 ? <LoadingOutlined /> : undefined,
                },
                {
                  title: "Analyze",
                  description: "Generating insights",
                  icon: currentStep > 2 ? <CheckCircleOutlined /> : currentStep === 2 ? <LoadingOutlined /> : undefined,
                },
              ]}
              status={loading ? "process" : "finish"}
            />
            {extractionProgress && currentStep === 1 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">{extractionProgress}</p>
              </div>
            )}
          </Card>
        )}

        {/* Main Form */}
        <Card className="rounded-xl shadow-lg border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <div className="p-6 mb-6 rounded-lg border-l-4 flex items-center gap-4" style={{ backgroundColor: "#F7F9FC", borderLeftColor: "#0F4C81" }}>
            <CloudUploadOutlined className="text-4xl" style={{ color: "#0F4C81" }} />
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F2933" }}>Add New Report</h2>
              <p style={{ color: "#1F2933" }}>Fill in the details and upload your medical document</p>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>
            {/* Report Name & Type Row */}
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-base font-semibold flex items-center gap-2">
                      <FileOutlined />
                      Report Name
                    </span>
                  }
                  name="reportName"
                  rules={[
                    { required: true, message: "Please enter report name" },
                    { min: 3, message: "Report name must be at least 3 characters" },
                  ]}
                >
                  <Input
                    placeholder="e.g., Monthly Blood Test"
                    size="large"
                    className="rounded-lg"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-base font-semibold flex items-center gap-2">
                      <Tag>TYPE</Tag>
                      Report Type
                    </span>
                  }
                  name="reportType"
                  rules={[{ required: true, message: "Please select report type" }]}
                >
                  <Select
                    placeholder="Select report type"
                    size="large"
                    className="rounded-lg"
                    value={reportType}
                    onChange={setReportType}
                    optionLabelProp="label"
                  >
                    {reportTypes.map((type) => (
                      <Option key={type.value} value={type.value} label={
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      }>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Type Preview */}
            {reportType && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: getTypeInfo(reportType)?.color + "15", borderLeft: `4px solid var(--antd-color-${getTypeInfo(reportType)?.color})` }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeInfo(reportType)?.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {getTypeInfo(reportType)?.label} Report Selected
                    </p>
                    <p className="text-sm text-gray-600">
                      Your report will be analyzed as a {getTypeInfo(reportType)?.label.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <Form.Item label={<span className="text-base font-semibold">Additional Notes (Optional)</span>} name="notes">
              <TextArea
                rows={3}
                placeholder="Add any notes about this report (allergies, medications, symptoms, etc.)"
                maxLength={500}
                showCount
                className="rounded-lg"
              />
            </Form.Item>

            <Divider />

            {/* File Upload */}
            <Form.Item label={<span className="text-base font-semibold flex items-center gap-2"><CloudUploadOutlined /> Upload PDF Document</span>}>
              <PDFUploader fileList={fileList} setFileList={setFileList} />
            </Form.Item>

            {fileList.length > 0 && (
              <Alert
                message={`✓ ${fileList[0].name} ready to upload (${(fileList[0].size / 1024 / 1024).toFixed(2)} MB)`}
                type="success"
                showIcon
                className="mb-6 rounded-lg"
              />
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="flex-1 h-12 text-base font-bold rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-md hover:shadow-lg transition-all"
                loading={loading}
                disabled={fileList.length === 0}
              >
                {loading ? (
                  <>
                    <LoadingOutlined style={{ marginRight: "8px" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <RobotOutlined style={{ marginRight: "8px" }} />
                    Analyze with AI
                  </>
                )}
              </Button>
              <Button
                size="large"
                className="h-12 text-base font-semibold rounded-lg"
                onClick={() => {
                  form.resetFields();
                  setFileList([]);
                  setReportName("");
                  setReportType("");
                }}
                disabled={loading}
              >
                Clear
              </Button>
            </div>
          </Form>
        </Card>

        {/* Info Cards */}
        <Row gutter={[16, 16]} className="mt-8">
          <Col xs={24} sm={12}>
            <Card className="rounded-xl shadow-md border-0 h-full hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircleOutlined className="text-green-500" />
                Supported Formats
              </h3>
              <p className="text-sm text-gray-600">PDF documents (up to 10MB)</p>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="rounded-xl shadow-md border-0 h-full hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <RobotOutlined className="text-blue-500" />
                AI Analysis
              </h3>
              <p className="text-sm text-gray-600">Get instant insights, findings & recommendations</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* AI Summary Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <RobotOutlined className="text-blue-600" />
            <span>AI Analysis Results</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={typeof window !== "undefined" && window.innerWidth < 768 ? "95vw" : 800}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalVisible(false)} size="large" className="rounded-lg">
            Close
          </Button>,
        ]}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        className="rounded-xl"
      >
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aiSummary || "") }} />
        </div>
      </Modal>
    </div>
  );
};

export default UploadReportForm;
