import React from "react";
import AuthTabs from "./AuthTabs";
import "./LoginPage.css"
import Navbar from "../../Components/Navbar/Navbar";

const LoginPage = () => {
  return (
     <div className="login-page d-flex align-items-center justify-content-center">
      <Navbar />
      <AuthTabs />
    </div>
  );
};

export default LoginPage;
