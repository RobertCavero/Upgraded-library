import React from "react";
import AuthTabs from "./AuthTabs";
import "./LoginPage.css"

const LoginPage = () => {
  return (
     <div className="login-page d-flex align-items-center justify-content-center">
      <AuthTabs />
    </div>
  );
};

export default LoginPage;
