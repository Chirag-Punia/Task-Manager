import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import {  toast } from 'react-toastify';

const Login = () => {
  const dev_url = "http://localhost:5000";
  const base_url = "https://todo-1-5ip8.onrender.com";
  const reactNavigator = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    await axios
      .post(`${dev_url}/auth/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.msg === "Wrong password") {
          toast.error("Wrong password");
        }
        else if(res.data.msg === "Login successfully"){
          if(res.data.token){
            localStorage.setItem("token", res.data.token);
            window.location = "/dashboard";
          }
          toast.success("Login successfully");

        } else {
          toast.error("User does not exist");
          reactNavigator("/signup");
        }
      });
  };
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <>
      <div className={"wrapper signin"}>
        <div className="form">
          <div className="heading">Login Page</div>
          <form>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </form>
          <button onClick={handleClick}>Login</button>
          <p>
            Don't have an account ? <Link to="/signup"> Sign up </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
