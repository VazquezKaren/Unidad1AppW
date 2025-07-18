import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";

const { Title, Text } = Typography;

type FieldType = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: FieldType) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      login(data.accessToken, data.user);
      navigate("/", { replace: true });
      form.resetFields();
    } catch (error) {
      message.error("Error en el servidor o credenciales inválidas");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Title level={3} style={styles.title}>
          Bienvenido de nuevo
        </Title>
        <Text style={styles.subtitle}>
          Ingresa tus datos para continuar
        </Text>

        <Form
          form={form}
          layout="vertical"
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              size="large"
              placeholder="correo@ejemplo.com"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
            <Checkbox style={styles.checkbox}>Recuérdame</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" block style={styles.button}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>

        <Text style={styles.footer}>
          ¿Necesitas ayuda? <a href="#" style={styles.link}>Contáctanos</a>
        </Text>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
 page: {
  height: "100vh",                       // ✅ alto exacto del viewport
  width: "100vw",                        // ✅ ancho exacto
  background: "linear-gradient(to right, #1e3c72, #2a5298)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  margin: 0,
  overflow: "hidden",                    // ❌ oculta scroll vertical y horizontal
  position: "fixed",                     // ✅ bloquea todo el scroll
  top: 0,
  left: 0,
  zIndex: 9999,
},
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "40px 32px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    color: "#6b7280",
    fontSize: 14,
  },
  input: {
    padding: "10px 14px",
    fontSize: 15,
    background: "#f9fafb",
  },
  button: {
    background: "linear-gradient(to right, #1e3c72, #2563eb)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 16,
    height: 44,
    borderRadius: 10,
    border: "none",
  },
  checkbox: {
    color: "#374151",
  },
  footer: {
    textAlign: "center",
    marginTop: 16,
    color: "#6b7280",
    fontSize: 14,
  },
  link: {
    color: "#3b82f6",
  },
};
