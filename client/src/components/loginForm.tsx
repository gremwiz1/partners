import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { loginUser } from "../api/api";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      localStorage.setItem("token", response.token);
      if (auth) {
        auth.login(response.token);
      }
      message.success("Вы успешно вошли в систему");
      navigate("/account");
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
      <h2 style={{ textAlign: "center" }}>Вход в Систему</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Введите email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        Ещё не зарегистрированы? <Link to="/register">Регистрация</Link>
      </div>
    </Spin>
  );
};

export default LoginForm;
