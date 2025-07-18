 import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Select } from 'antd';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
}

export default function UserData() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filtrados, setFiltrados] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = () => {
    fetch("http://localhost:3000/api/v1/auth/getUsers")
      .then((res) => res.json())
      .then((data) => {
        const activos = (data.userList || []).filter((u: User) => u.status !== "Eliminado");
        setUsuarios(activos);
        setFiltrados(activos);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios", err);
        setUsuarios([]); // evitar que se quede en blanco si hay error
        setFiltrados([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = usuarios.filter((u) =>
      u.email?.toLowerCase().includes(value)
    );
    setFiltrados(filtered);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (isEditing && editingUser) {
        fetch(`http://localhost:3000/api/v1/auth/updateUser?userEmail=${editingUser.email}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
          .then(res => res.json())
          .then(() => {
            message.success("Usuario actualizado");
            setModalVisible(false);
            setEditingUser(null);
            fetchUsers();
          })
          .catch(() => message.error("Error al actualizar usuario"));
      } else {
        // Crear usuario
        fetch(`http://localhost:3000/api/v1/auth/newUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
          .then(async res => {
            const data = await res.json();
            if (res.status === 201) {
              message.success("Usuario creado");
              setModalVisible(false);
              fetchUsers();
            } else {
              message.error(data.message || "Error al crear usuario");
            }
          })
          .catch(() => message.error("Error en la solicitud"));
      }
    });
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: "¿Estás seguro?",
      content: `¿Eliminar a ${user.name}?`,
      okText: "Sí",
      okButtonProps: { danger: true },
      cancelText: "No",
      onOk: () => {
        fetch(`http://localhost:3000/api/v1/auth/deleteUser?userEmail=${user.email}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Eliminado" }),
        })
          .then(res => res.json())
          .then(() => {
            message.success("Usuario eliminado");
            fetchUsers();
          })
          .catch(() => message.error("Error al eliminar usuario"));
      }
    });
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Correo", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "phone", key: "phone" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: User) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
          <Button danger type="link" onClick={() => handleDelete(record)}>Eliminar</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Usuarios Registrados</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por correo"
          value={search}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar Usuario</Button>
      </div>

      <Table columns={columns} dataSource={filtrados} rowKey="_id" />

      <Modal
        title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: "El correo es obligatorio" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|net|org)$/,
                message: "Correo no válido (usa gmail, hotmail, etc.)",
              },
            ]}
          >
            <Input disabled={isEditing} />
          </Form.Item>

          {!isEditing && (
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                { required: true, message: "La contraseña es obligatoria" },
                {
                  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Debe tener al menos 6 caracteres, una mayúscula, un número y un símbolo",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[
              { required: true, message: "El teléfono es obligatorio" },
              {
                pattern: /^\d{10}$/,
                message: "Debe tener exactamente 10 dígitos",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {!isEditing && (
            <Form.Item
              label="Rol"
              name="role"
              rules={[{ required: true, message: "Selecciona un rol" }]}
            >
              <Select placeholder="Selecciona un rol">
                <Select.Option value="admin">Administrador</Select.Option>
                <Select.Option value="usuario">Usuario</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
