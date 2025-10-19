import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout"
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmailVerification from "./pages/auth/EmailVerification";
import UploadReport from "./pages/Dashboard/UploadReport";
import TrackVitals from "./pages/Dashboard/TrackVitals";
import Profile from "./pages/Dashboard/Profile";
import Reports from "./pages/Dashboard/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route></Route>

        <Route element={<AuthLayout />}>
          <Route index element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔹 Admin Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload-reports" element={<UploadReport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/vitals" element={<TrackVitals />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;