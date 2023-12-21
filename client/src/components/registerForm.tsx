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
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import axios, { AxiosError } from "axios";
import "dayjs/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const userData = {
      name: values.name,
      email: values.email,
      birthdate: values.birthdate.format("YYYY-MM-DD"),
      gender: values.gender,
      password: values.password,
    };

    const profilePhotoFile =
      values.profilePhoto && values.profilePhoto.file
        ? values.profilePhoto.file.originFileObj
        : undefined;
    try {
      await registerUser(userData, profilePhotoFile);
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

  const handleFileChange = ({
    fileList,
  }: UploadChangeParam<UploadFile<any>>) => {
    setFileList(fileList);
  };

  const beforeUpload = (file: File) => {
    const isAlreadyOneFile = fileList.length >= 1;
    if (isAlreadyOneFile) {
      message.error("Вы можете загрузить только одно изображение!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <Spin spinning={loading}>
      <h2 style={{ textAlign: "center" }}>Регистрация</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: "Введите ваше имя" }]}
          className="form-item"
        >
          <Input placeholder="Имя" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Введите ваш email", type: "email" },
          ]}
          className="form-item"
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
          className="form-item"
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>

        <Form.Item
          name="birthdate"
          label="Дата рождения"
          rules={[{ required: true, message: "Выберите дату рождения" }]}
          className="form-item"
        >
          <DatePicker style={{ width: "100%" }} locale={locale} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Пол"
          rules={[{ required: true, message: "Выберите пол" }]}
          className="form-item"
        >
          <Radio.Group>
            <Radio value="male">Мужской</Radio>
            <Radio value="female">Женский</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="profilePhoto"
          label="Фото профиля"
          className="form-item"
        >
          <Upload
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Загрузить фото</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        Уже зарегистрированы? <Link to="/login">Войти</Link>
      </div>
    </Spin>
  );
};

export default RegisterForm;
