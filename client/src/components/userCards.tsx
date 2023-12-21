import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios, { AxiosError } from "axios";
import { listUsers } from "../api/api";
import { UserProfile } from "../utils/type";
import moment from "moment";

const UserCards = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const authContext = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthdate: string) => {
    return moment().diff(moment(birthdate), "years");
  };

  useEffect(() => {
    if (!authContext || !authContext.isAuthenticated) {
      navigate("/login");
    } else {
      listUsers()
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 401) {
              if (authContext) {
                authContext.logout();
              }
              navigate("/login");
            } else {
              message.error("Ошибка при загрузке данных пользователей");
            }
          } else {
            message.error("Произошла ошибка");
          }
        });
    }
  }, [authContext, navigate]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {users.map((user) => (
        <Card key={user.id} title={user.name}>
          {user.birthdate && (
            <p>
              Возраст:{" "}
              {calculateAge(
                typeof user.birthdate === "string"
                  ? user.birthdate
                  : user.birthdate.toISOString()
              )}
            </p>
          )}
          {user.profilePhoto && (
            <img
              src={user.profilePhoto}
              alt="Profile"
              style={{ width: 100, height: 100 }}
            />
          )}
        </Card>
      ))}
    </div>
  );
};

export default UserCards;
