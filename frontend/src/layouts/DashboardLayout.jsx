import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HeartOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Dropdown, Drawer, Typography } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import api from "../utils/axiosSetup";
import { generateAvatar } from "../utils/helper";

// Professional sidebar and menu styles
const sidebarMenuStyles = `
  .custom-sidebar-menu .ant-menu-item {
    color: white !important;
    background-color: #0F4C81 !important;
    border-left: 3px solid transparent !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-sidebar-menu .ant-menu-item:hover {
    background-color: #0D3E64 !important;
    border-left-color: #2EC4B6 !important;
    padding-left: 14px !important;
  }
  
  .custom-sidebar-menu .ant-menu-item-selected {
    background-color: #0D3E64 !important;
    color: #2EC4B6 !important;
    border-left-color: #2EC4B6 !important;
  }
  
  .custom-sidebar-menu .ant-menu-title-content {
    font-weight: 500 !important;
  }

  .user-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(15, 76, 129, 0.12);
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    transition: background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
    max-width: 220px;
    cursor: pointer;
  }

  .user-chip:hover {
    background: #F7F9FC;
    border-color: rgba(46, 196, 182, 0.35);
    box-shadow: 0 4px 14px rgba(15, 76, 129, 0.08);
  }

  .user-chip-name {
    font-weight: 600;
    font-size: 13px;
    color: #1F2933;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 140px;
  }
`;

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 1024);
      setIsCompact(w < 480);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Inject sidebar menu styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = sidebarMenuStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUserProfile(null);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get("/auth/user-profile", { signal: controller.signal });
        if (res?.data?.user) {
          setUserProfile(res.data.user);
        }
      } catch (err) {
        if (err?.name === "CanceledError") return;
        // If profile fetch fails, keep UI usable with fallbacks
        setUserProfile(null);
      }
    })();

    return () => controller.abort();
  }, []);

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/reports", icon: <FileTextOutlined />, label: "My Reports" },
    {
      key: "/upload-reports",
      icon: <UploadOutlined />,
      label: "Upload Report",
    },
    { key: "/vitals", icon: <HeartOutlined />, label: "Track Vitals" },
    { key: "/profile", icon: <UserOutlined />, label: "Profile" },
  ];

  const handleToggle = () => {
    if (isMobile) setMobileVisible(true);
    else setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) setMobileVisible(false);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      // Clear authentication tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUserProfile(null);
      navigate("/signin");
    }
  };

  const displayName =
    userProfile?.userName?.trim() ||
    userProfile?.email?.trim() ||
    "Account";

  const avatarLetter = generateAvatar(displayName);
  const avatarUrl = userProfile?.avatar?.trim();

  const headerPadding = isMobile ? "0 12px" : "0 24px";
  const headerHeight = isMobile ? 64 : 70;
  const contentHeight = isMobile
    ? `calc(100vh - ${headerHeight}px)`
    : `calc(100vh - ${headerHeight}px - 48px)`; // desktop Content margin top+bottom = 24*2

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar (Desktop) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsedWidth={80}
        width={230}
        trigger={null}
        theme="light"
        className="hidden lg:block"
        style={{
          backgroundColor: "#0F4C81",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-center h-16 mx-4 my-4 font-bold uppercase text-white" style={{ color: "white" }}>
          {!collapsed ?(
            <>
            <img src="/health-icon.png" alt="Health Icon" className="w-8 h-8 mr-2 brightness-0 invert" />  HealthPro
            </>
          )  : ( "HP")}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: "#0F4C81" }}
          className="custom-sidebar-menu"
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        width={230}
      >
        <div className="flex items-center justify-center h-16 mx-4 my-4 font-bold uppercase">
          HealthPro
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Drawer>

      {/* Main Layout */}
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <Header
          style={{
            padding: headerPadding,
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: headerHeight,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderBottomWidth: "2px",
            borderBottomColor: "#2EC4B6",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggle}
              style={{ fontSize: "18px", color: "#0F4C81" }}
            />
            {!isMobile && (
              <h3 style={{ marginLeft: 4, marginBottom: 0, color: "#0F4C81", fontSize: "18px", fontWeight: "600" }}>
                Health Dashboard
              </h3>
            )}
          </div>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            arrow
          >
            <div
              className="user-chip"
              title={displayName}
              style={{
                maxWidth: isCompact ? 120 : isMobile ? 170 : 220,
                padding: isCompact ? "6px 8px" : undefined,
                gap: isCompact ? 8 : undefined,
              }}
            >
              <Avatar
                src={avatarUrl || undefined}
                size={isMobile ? 32 : 34}
                style={{ backgroundColor: "#0F4C81", flexShrink: 0 }}
                icon={!avatarUrl && !avatarLetter ? <UserOutlined /> : undefined}
              >
                {!avatarUrl && avatarLetter ? avatarLetter : null}
              </Avatar>

              {!isCompact && (
                <Typography.Text className="user-chip-name">
                  {displayName}
                </Typography.Text>
              )}

              <CaretDownOutlined style={{ color: "#0F4C81", fontSize: 12, flexShrink: 0 }} />
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: isMobile ? 0 : "24px 16px",
            padding: isMobile ? 0 : 24,
            height: contentHeight,
            background: "#F7F9FC",
            borderRadius: isMobile ? 0 : 8,
            overflowX: "hidden",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 👇 React Router will inject page content here */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
