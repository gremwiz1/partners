import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  DatePicker,
  Radio,
  Avatar,
} from "antd";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(
    undefined
  );

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    console.log(authContext);
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
            if (profileData.id) {
              setId(profileData.id);
            }
            if (profileData.profilePhoto) {
              setFileList([
                {
                  uid: "0",
                  name: "profilePhoto.png",
                  status: "done",
                  url: profileData.profilePhoto,
                  thumbUrl: profileData.profilePhoto,
                },
              ]);
              setProfilePhotoUrl(profileData.profilePhoto);
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
      const response = await updateProfile(userData, profilePhotoFile);
      message.success("Профиль успешно обновлен");
      if (response && response.user) {
        form.setFieldsValue({
          name: response.user.name,
          email: response.user.email,
          birthdate: moment(response.user.birthdate),
          gender: response.user.gender,
        });

        setId(response.user._id);

        if (response.user.profilePhoto) {
          setProfilePhotoUrl(response.user.profilePhoto);
          setFileList([
            {
              uid: "-1",
              name: "profilePhoto.png",
              status: "done",
              url: response.user.profilePhoto,
            },
          ]);
        }
      }
      setIsEditMode(false);
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

  const handleFileChange = ({
    fileList: newFileList,
  }: UploadChangeParam<UploadFile<any>>) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    setFileList([]);
    return true;
  };

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    }
    navigate("/login");
  };

  const handleGoToPeople = () => {
    navigate("/people");
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="name"
        label="Имя"
        rules={[{ required: true, message: "Введите ваше имя" }]}
        className="form-item"
      >
        <Input disabled={!isEditMode} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, type: "email", message: "Введите ваш email" },
        ]}
        className="form-item"
      >
        <Input disabled={!isEditMode} />
      </Form.Item>

      {isEditMode && (
        <Form.Item
          name="password"
          label="Новый пароль"
          rules={[{ required: false, message: "Введите новый пароль" }]}
          className="form-item"
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item
        name="birthdate"
        label="Дата рождения"
        rules={[{ required: true, message: "Выберите дату рождения" }]}
        className="form-item"
      >
        <DatePicker style={{ width: "100%" }} disabled={!isEditMode} />
      </Form.Item>

      <Form.Item name="gender" label="Пол" className="form-item">
        <Radio.Group disabled={!isEditMode}>
          <Radio value="male">Мужской</Radio>
          <Radio value="female">Женский</Radio>
        </Radio.Group>
      </Form.Item>
      {!isEditMode && profilePhotoUrl && (
        <Avatar size={64} src={profilePhotoUrl} />
      )}

      {isEditMode && (
        <Form.Item
          name="profilePhoto"
          label="Фото профиля"
          className="form-item"
        >
          <Upload
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Загрузить новое фото</Button>
          </Upload>
        </Form.Item>
      )}

      <Form.Item>
        <Button onClick={toggleEditMode}>
          {isEditMode ? "Отменить редактирование" : "Редактировать профиль"}
        </Button>
      </Form.Item>
      {isEditMode && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Обновить профиль
          </Button>
        </Form.Item>
      )}
      <Form.Item>
        <Button type="default" onClick={handleLogout}>
          Выход
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="default" onClick={handleGoToPeople}>
          Люди
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileEditForm;
