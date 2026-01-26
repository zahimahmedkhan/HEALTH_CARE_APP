import { Outlet, useLocation } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";

const AuthLayout = () => {
  const location = useLocation();
  const isSignUp = location.pathname.includes("signup");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: "#F7F9FC" }}>
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ backgroundColor: "rgba(15, 76, 129, 0.2)" }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" style={{ backgroundColor: "rgba(46, 196, 182, 0.2)" }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="rounded-2xl flex items-center justify-center shadow-xl" style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6)", width: "64px", height: "64px" }}>
              <HeartOutlined className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#0F4C81" }}>
            HealthPro
          </h1>
          <p className="text-sm mt-2" style={{ color: "#1F2933" }}>Your Personal Health Companion</p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border shadow-2xl overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", borderColor: "#2EC4B6", borderWidth: "1px" }}>
          {/* Header Gradient */}
          <div className="h-1" style={{ backgroundImage: "linear-gradient(to right, #0F4C81, #2EC4B6, #0F4C81)" }}></div>

          {/* Content */}
          <div className="p-8">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "#1F2933" }}>
          Secure • Private • AI-Powered
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;