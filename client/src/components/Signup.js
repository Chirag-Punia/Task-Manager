import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {

  const base_url = "https://todo-1-5ip8.onrender.com";
  const reactNavigator = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${base_url}/auth/signup`, {
        email,
        name,
        password,
        confirmpassword,
      })
      .then((res) => {
        if (res.data === "password does not match") {
          toast.error("password does not match");
          return;
        } else if (res.data === "Enter all required field") {
          toast.error("Enter all required field");
          return;
        } else if (res.data == "Password should be at least 6 characters") {
          toast.error("Password should be at least 6 characters");
          return;
        } else if (res.data == "Email already exist") {
          toast.error("Email already exist");
        } else if (res.data === "User created") {
          window.location = "/dashboard";
        }
      });
  };
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  return (
    <>
      <div className="wrapper Signup">
        <div className="form">
          <div className="heading">Create an Account</div>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => {
                  setconfirmpassword(e.target.value);
                }}
              />
            </div>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
            <p className="pp">
              Have an Account ?<Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
export default Signup;
