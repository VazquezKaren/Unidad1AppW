// src/components/MenuDynamic.tsx
import { useAuth } from "@/auth/authContext";
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  ProfileOutlined,
  SettingOutlined,
};

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  roles: string[];
}

function MenuDynamic() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!user || !user._id) return;

      try {
        const res = await fetch(`http://localhost:3000/api/v1/auth/menu/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener el menú");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error cargando menú dinámico:", error);
      }
    };

    fetchMenu();
  }, [user, token]);

  const renderMenu = () => {
    return menuItems.map((item) => {
      const IconComponent = Icons[item.icon as keyof typeof Icons];
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });
  };

  return (
    <>
      {/* Encabezado superior */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "white" }}>
          Mi Aplicación
        </h1>
      </div>

      {/* Menú lateral */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={renderMenu()}
        theme="dark"
        style={{
          borderRight: 0,
          backgroundColor: "#001529",
        }}
      />

      {/* Estilos adicionales */}
      <style>
        {`
          .ant-menu-dark.ant-menu-inline {
            background: transparent;
          }
          .ant-menu-dark.ant-menu-inline .ant-menu-item {
            height: 48px;
            line-height: 48px;
            margin: 4px 8px;
            border-radius: 4px;
            transition: all 0.3s;
            padding-left: 16px !important;
          }
          .ant-menu-dark.ant-menu-inline .ant-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
            background-color: #1890ff !important;
          }
          .ant-menu-dark .ant-menu-item .ant-menu-item-icon {
            font-size: 18px;
            margin-right: 12px;
          }
          .ant-menu-dark .ant-menu-item {
            font-size: 14px;
            font-weight: bold !important;
            color: white !important;
          }
          .ant-menu-dark .ant-menu-item-selected {
            font-weight: bold !important;
          }
        `}
      </style>
    </>
  );
}

export default MenuDynamic;
