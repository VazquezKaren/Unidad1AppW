import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Modal,
  Select,
  Button,
  message,
  Form,
  Space,
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Product {
  _id: string;
  name: string;
  price: number;
  status: string;
}

interface OrderProduct {
  productId: Product;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  status: boolean | string;
  subtotal: number;
  total: number;
  products: OrderProduct[];
  createDate: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function OrderData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("Pendiente");
  const [formVisible, setFormVisible] = useState(false);
  const [form] = Form.useForm();
  const [productList, setProductList] = useState<Product[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  const fetchOrders = () => {
    axios.get("http://localhost:3000/api/v1/auth/getOrders").then((res) => {
      const activos = res.data.filter(
        (o: Order) =>
          o.status === true || o.status === "Pendiente" || o.status === "Pagado"
      );
      setOrders(activos);
      setFilteredOrders(activos);
    });
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/api/v1/auth/getAllProducts")
      .then((res) => {
        const disponibles = res.data.filter(
          (p: Product) => p.status === "disponible"
        );
        setProductList(disponibles);
      });
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/v1/auth/getUsers")
      .then((res) => setUserList(res.data.userList || []));
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = orders.filter((order) =>
      order.products.some((p) =>
        p.productId?.name?.toLowerCase().includes(value)
      )
    );
    setFilteredOrders(filtered);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(typeof order.status === "string" ? order.status : "Pendiente");
    setModalVisible(true);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;

    axios
      .patch(
        `http://localhost:3000/api/v1/auth/updateOrder/${selectedOrder._id}`,
        { status: newStatus }
      )
      .then(() => {
        message.success("Estado actualizado correctamente");
        setModalVisible(false);
        setSelectedOrder(null);
        fetchOrders();
      })
      .catch(() => message.error("Error al actualizar"));
  };

  const handleCreateOrder = async (values: any) => {
    try {
      await axios.post("http://localhost:3000/api/v1/auth/crearOrder", {
        userId: values.userId,
        status: values.status,
        products: values.products,
      });
      message.success("Orden creada correctamente");
      setFormVisible(false);
      form.resetFields();
      fetchOrders();
    } catch (error) {
      console.error("Error al crear orden", error);
      message.error("Error al crear orden");
    }
  };

  const columns: ColumnsType<Order> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    {
      title: "Producto",
      dataIndex: "products",
      key: "products",
      render: (products: OrderProduct[]) =>
        products.map((p) => p.productId?.name).join(", "),
    },
    {
      title: "Cantidad",
      dataIndex: "products",
      key: "qty",
      render: (products: OrderProduct[]) =>
        products.map((p) => p.qty).join(", "),
    },
    { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: any) =>
        typeof status === "string"
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : status === true
          ? "Pendiente"
          : "Cancelado",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Order) => (
        <Button type="link" onClick={() => handleEditStatus(record)}>
          Cambiar Estado
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Órdenes</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
       <Button
  type="primary"
  onClick={() => {
    fetchProducts();         // <--- Actualiza lista de productos antes de mostrar modal
    setFormVisible(true);    // <--- Abre el modal
  }}
>
  Crear Orden
</Button>

      </div>

      <Table columns={columns} dataSource={filteredOrders} rowKey="_id" />

      {/* Modal para cambiar estado */}
      <Modal
        title="Actualizar Estado de Orden"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveStatus}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <p>Selecciona el nuevo estado:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Option value="Pendiente">Pendiente</Option>
          <Option value="Pagado">Pagado</Option>
        </Select>
      </Modal>

      {/* Modal interactivo para crear orden */}
<Modal
  title="Crear Orden"
  open={formVisible}
  onCancel={() => setFormVisible(false)}
  onOk={() => {
    form.validateFields().then((values) => {
      handleCreateOrder(values);
    });
  }}
  okText="Crear"
  cancelText="Cancelar"
>
  <Form form={form} layout="vertical">
    <Form.Item
      name="userId"
      label="Usuario"
      rules={[{ required: true, message: "Usuario requerido" }]}
    >
      <Select placeholder="Selecciona un usuario">
        {userList.map((user) => (
          <Option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name="status"
      label="Estado"
      rules={[{ required: true, message: "Estado requerido" }]}
    >
      <Select>
        <Option value="Pendiente">Pendiente</Option>
        <Option value="Pagado">Pagado</Option>
      </Select>
    </Form.Item>

    <Form.List name="products">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              align="baseline"
              style={{ display: "flex", marginBottom: 8 }}
            >
              {/* Campo de producto con búsqueda y autocompletado */}
              <Form.Item
                {...restField}
                name={[name, "productId"]}
                rules={[{ required: true, message: "Producto requerido" }]}
              >
                <Select
                  showSearch
                  placeholder="Producto"
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  notFoundContent="Producto no encontrado"
                  onChange={(productId) => {
                    const product = productList.find(
                      (p) => p._id === productId
                    );
                    const current = form.getFieldValue("products") || [];
                    const updated = [...current];
                    updated[name] = {
                      ...updated[name],
                      qty: 1,
                      price: product?.price || 0,
                    };
                    form.setFieldsValue({ products: updated });
                  }}
                >
                  {productList.map((p) => (
                    <Option key={p._id} value={p._id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "qty"]}
                rules={[{ required: true, message: "Cantidad requerida" }]}
              >
                <InputNumber min={1} />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "price"]}
                rules={[{ required: true, message: "Precio requerido" }]}
              >
                <InputNumber disabled />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              Agregar producto
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  </Form>
</Modal>

    </div>
  );
}
