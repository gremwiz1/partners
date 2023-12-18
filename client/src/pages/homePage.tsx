import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Добро пожаловать в наше приложение!</h1>
      <p>Выберите действие:</p>
      <Link to="/register">Регистрация</Link>
      <br />
      <Link to="/login">Вход</Link>
    </div>
  );
};

export default HomePage;
