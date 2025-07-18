import type { JSX } from "react";
import UserData from "../users/userData";
import ProductData from "../products/productData";
import OrderData from "../orders/orderData";
import ReportData from "../reports/reportData";


export interface AppRoute {
  path: string;
  element: JSX.Element;
  label: string;
  icon?: string;
}

const routes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <UserData />,
    label: "Inicio",
    icon: "HomeOutlined",
  },
  {
    path: "/users",
    element: <UserData />,
    label: "Usuarios",
    icon: "UserOutlined",
  },
  {
    path: "/products",
    element: <ProductData />,
    label: "Productos",
    icon: "ShoppingOutlined",
  },
  {
    path: "/orders",
    element: <OrderData />,
    label: "Pedidos",
    icon: "ProfileOutlined",
  },
  {
    path: "/reports",
    element: <ReportData />,
    label: "Reportes",
    icon: "BarChartOutlined",
  },
  

];

export default routes;