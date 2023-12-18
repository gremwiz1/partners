import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, DatePicker, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { updateProfile, getUserProfile } from "../api/api";
import axios, { AxiosError } from "axios";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

const ProfileEditForm = () => {
  const [form] = Form.useForm();
  const [id, setId] = React.useState("");
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const authContext = useAuth();
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<string>();

  useEffect(() => {
    if (!authContext || !authContext.isAuthenticated) {
      navigate("/login");
    } else {
      getUserProfile()
        .then((profileData) => {
          if (profileData) {
            form.setFieldsValue({
              name: profileData.name,
              email: profileData.email,
              birthdate: moment(profileData.birthdate),
              gender: profileData.gender,
            });
            setId(profileData.id);
            if (profileData.profilePhoto) {
              setProfilePhoto(profileData.profilePhoto);
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            authContext.logout();
            navigate("/login");
          } else {
            message.error("Ошибка при загрузке данных профиля");
          }
        });
    }
  }, [authContext, navigate, form]);

  const handleSubmit = async (values: any) => {
    const userData = {
      name: values.name,
      email: values.email,
      birthdate: values.birthdate.format("YYYY-MM-DD"),
      gender: values.gender,
      id,
    };

    const profilePhotoFile =
      values.profilePhoto && values.profilePhoto.file
        ? values.profilePhoto.file.originFileObj
        : undefined;

    try {
      await updateProfile(userData, profilePhotoFile);
      message.success("Профиль успешно обновлен");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          if (authContext) {
            authContext.logout();
          }
          navigate("/login");
        } else {
          message.error("Ошибка обновления профиля");
        }
      } else {
        message.error("Произошла ошибка");
      }
    }
  };

  const handleFileChange = ({ fileList }: UploadChangeParam) => {
    setFileList(fileList);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Имя"
        rules={[{ required: true, message: "Введите ваше имя" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, type: "email", message: "Введите ваш email" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Новый пароль"
        rules={[{ required: true, message: "Введите новый пароль" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="birthdate"
        label="Дата рождения"
        rules={[{ required: true, message: "Выберите дату рождения" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="gender" label="Пол">
        <Radio.Group>
          <Radio value="male">Мужской</Radio>
          <Radio value="female">Женский</Radio>
          <Radio value="other">Другой</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="profilePhoto" label="Фото профиля">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false}
        >
          {fileList.length < 1 && profilePhoto ? (
            <img src={profilePhoto} alt="Profile" style={{ width: "100px" }} />
          ) : (
            <Button icon={<UploadOutlined />}>Загрузить фото</Button>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Обновить профиль
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileEditForm;
