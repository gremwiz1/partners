import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import AccountPage from "./pages/accountPage";
import PeoplePage from "./pages/peoplePage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="centered-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/people" element={<PeoplePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
