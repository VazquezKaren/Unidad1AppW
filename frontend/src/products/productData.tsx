import React, { useEffect, useState } from "react";
import { Table, Input, Button, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import ModalForm from "../components/common/ModalForm";

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  qty: number;
  status: string;
  price: number;
  createDate: string;
  deleteDate: string | null;
}

export default function ProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"crear" | "editar" | "eliminar">("crear");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchProducts = () => {
    axios.get("http://localhost:3000/api/v1/auth/getAllProducts").then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fields = [
    {
      name: "id",
      label: "ID único",
      type: "text",
      required: true,
      rules: [
        { required: true, message: "El ID es obligatorio" },
        {
          pattern: /^[a-zA-Z0-9_-]{4,20}$/,
          message: "Debe tener entre 4 y 20 caracteres: letras, números, guiones o guiones bajos",
        },
      ],
    },
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
      rules: [
        { required: true, message: "El nombre es obligatorio" },
        {
          pattern: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,50}$/,
          message: "Solo letras y espacios (mínimo 3 caracteres)",
        },
      ],
    },
    {
      name: "description",
      label: "Descripción",
      type: "text",
      required: true,
      rules: [
        { required: true, message: "La descripción es obligatoria" },
        { min: 10, message: "Debe tener al menos 10 caracteres" },
        { max: 200, message: "Máximo 200 caracteres" },
      ],
    },
    {
      name: "qty",
      label: "Cantidad",
      type: "number",
      required: true,
      rules: [
        { required: true, message: "La cantidad es obligatoria" },
        {
          type: "number",
          min: 1,
          message: "Debe ser al menos 1 unidad",
          transform: (value: any) => Number(value),
        },
        {
          type: "integer",
          message: "Debe ser un número entero",
          transform: (value: any) => Number(value),
        },
      ],
    },
    {
      name: "price",
      label: "Precio",
      type: "number",
      required: true,
      rules: [
        { required: true, message: "El precio es obligatorio" },
        {
          type: "number",
          min: 0.01,
          message: "Debe ser mayor a 0",
          transform: (value: any) => Number(value),
        },
        {
          validator: (_: any, value: any) =>
            /^\d+(\.\d{1,2})?$/.test(value)
              ? Promise.resolve()
              : Promise.reject("Máximo 2 decimales"),
        },
      ],
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { label: "disponible", value: "disponible" },
        { label: "no disponible", value: "no disponible" },
      ],
      rules: [
        { required: true, message: "Selecciona un estado" },
        {
          validator: (_: any, value: string) =>
            ["disponible", "no disponible"].includes(value)
              ? Promise.resolve()
              : Promise.reject("Estado inválido"),
        },
      ],
    },
  ];

  const openModal = (mode: "crear" | "editar" | "eliminar", product?: Product) => {
    setModalMode(mode);
    setEditingProduct(product || null);
    setModalVisible(true);
  };

  const handleOk = async (values?: any) => {
    setConfirmLoading(true);
    try {
      if (modalMode === "crear") {
        await axios.post("http://localhost:3000/api/v1/auth/createProduct", values);
        message.success("Producto creado correctamente");
      } else if (modalMode === "editar" && editingProduct) {
        await axios.patch(`http://localhost:3000/api/v1/auth/updateProduct/${editingProduct._id}`, values);
        message.success("Producto actualizado correctamente");
      } else if (modalMode === "eliminar" && editingProduct) {
        await axios.delete(`http://localhost:3000/api/v1/auth/deleteProduct/${editingProduct.id}`);
        message.success("Producto eliminado correctamente");
      }
      fetchProducts();
    } catch (err) {
      message.error("Ocurrió un error");
    } finally {
      setConfirmLoading(false);
      setModalVisible(false);
    }
  };

  const columns: ColumnsType<Product> = [
    { title: "ID Mongo", dataIndex: "_id", key: "_id" },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Cantidad", dataIndex: "qty", key: "qty" },
    { title: "Precio", dataIndex: "price", key: "price" },
    { title: "Estado", dataIndex: "status", key: "status" },
    {
      title: "Fecha de Creación",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) => new Date(date).toLocaleDateString("es-MX"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" onClick={() => openModal("editar", record)}>
            Editar
          </Button>
          <Button danger type="link" onClick={() => openModal("eliminar", record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const filteredProducts = products
    .filter((product) => product.status !== "eliminado")
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Productos</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={() => openModal("crear")}>
          Agregar Producto
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredProducts} rowKey="_id" />

      <ModalForm
        visible={modalVisible}
        mode={modalMode}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        initialValues={editingProduct || {}}
        fields={fields}
        confirmLoading={confirmLoading}
      />
    </div>
  );
}
