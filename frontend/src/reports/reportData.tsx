import React, { useEffect, useState } from "react";
import { Table, Input, Modal, Form, Select, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Option } = Select;

interface Report {
  _id: string;
  title: string;
  description: string;
  status: string;
  createDate: string;
}

export default function ReportData() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  const fetchReports = () => {
    axios.get("http://localhost:3000/api/v1/auth/getReports").then((res) => {
      const activos = res.data.filter((r: Report) => !("deleteDate" in r && r.deleteDate));
      setReports(activos);
      setFilteredReports(activos);
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(value) ||
        report.description.toLowerCase().includes(value)
    );
    setFilteredReports(filtered);
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    form.setFieldsValue(report);
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (!editingReport) return;
      axios
        .put(`http://localhost:3000/api/v1/auth/actualizarReporte/${editingReport._id}`, values)
        .then(() => {
          message.success("Reporte actualizado");
          setModalVisible(false);
          setEditingReport(null);
          fetchReports();
        })
        .catch(() => {
          message.error("Error al actualizar reporte");
        });
    });
  };

  const columns: ColumnsType<Report> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Título", dataIndex: "title", key: "title" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Estado", dataIndex: "status", key: "status" },
    {
      title: "Fecha de creación",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Report) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Reportes</h2>
      <Input
        placeholder="Buscar reporte..."
        value={search}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredReports} rowKey="_id" />

      <Modal
        title="Editar Reporte"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Título" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
            <Select>
              <Option value="pendiente">Pendiente</Option>
              <Option value="completado">Completado</Option>
              <Option value="cancelado">Cancelado</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
