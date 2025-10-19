import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/80 backdrop-blur-sm overflow-hidden">
    <div className="p-8">
      <Outlet />
    </div>
  </div>
</div>
  );
};

export default AuthLayout;