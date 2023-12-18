import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Radio,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import axios, { AxiosError } from "axios";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Регистрация прошла успешно");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<{ message: string }>;
        if (serverError.response) {
          message.error("Ошибка: " + serverError.response.data.message);
        } else {
          message.error("Произошла ошибка при выполнении запроса");
        }
      } else {
        message.error("Произошла ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Введите ваше имя" }]}
        >
          <Input placeholder="Имя" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Введите ваш email", type: "email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>

        <Form.Item
          name="birthdate"
          label="Дата рождения"
          rules={[{ required: true, message: "Выберите дату рождения" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: "Выберите пол" }]}
        >
          <Radio.Group>
            <Radio value="male">Мужской</Radio>
            <Radio value="female">Женский</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="profilePhoto" label="Фото профиля">
          <Upload listType="picture">
            <Button icon={<UploadOutlined />}>Загрузить фото</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default RegisterForm;
