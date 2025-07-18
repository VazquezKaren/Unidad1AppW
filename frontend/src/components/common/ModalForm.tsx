import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

interface ModalFormProps {
  visible: boolean;
  mode: "crear" | "editar" | "eliminar";
  confirmLoading?: boolean;
  onCancel: () => void;
  onOk: (values?: any) => void;
  initialValues?: any;
  fields: {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "textarea";
    options?: { label: string; value: string }[]; // solo para select
    required?: boolean;
    rules?: any[]; // <--- agregamos esto
  }[];
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  mode,
  onCancel,
  onOk,
  initialValues = {},
  fields,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  const isDelete = mode === "eliminar";

  const handleOk = () => {
    if (isDelete) {
      Modal.confirm({
        title: "¿Estás seguro?",
        content: "Esta acción no se puede deshacer.",
        okText: "Sí, eliminar",
        cancelText: "Cancelar",
        onOk: () => onOk(initialValues),
      });
    } else {
      form
        .validateFields()
        .then((values) => onOk(values))
        .catch((err) => console.log("Errores:", err));
    }
  };

  return (
    <Modal
      title={
        mode === "crear"
          ? "Crear"
          : mode === "editar"
          ? "Editar"
          : "Confirmar eliminación"
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "eliminar" ? "Eliminar" : "Guardar"}
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
    >
      {!isDelete ? (
        <Form form={form} layout="vertical" initialValues={initialValues}>
          {fields.map((field) => {
            const rules = field.rules || (field.required ? [{ required: true, message: `${field.label} es requerido` }] : []);

            if (field.type === "number") {
              return (
                <Form.Item key={field.name} label={field.label} name={field.name} rules={rules}>
<InputNumber
  style={{ width: "100%" }}
  onKeyPress={(e) => {
    const allowedChars = /[0-9.]/
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  }}
/>
                </Form.Item>
              );
            }

            if (field.type === "select") {
              return (
                <Form.Item key={field.name} label={field.label} name={field.name} rules={rules}>
                  <Select options={field.options} />
                </Form.Item>
              );
            }

            return (
              <Form.Item key={field.name} label={field.label} name={field.name} rules={rules}>
                <Input />
              </Form.Item>
            );
          })}
        </Form>
      ) : (
        <p>¿Deseas eliminar este elemento?</p>
      )}
    </Modal>
  );
};

export default ModalForm;
