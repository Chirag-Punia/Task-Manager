import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToDoList from "./components/ToDoList";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { authState } from "./store/authState";
import axios from "axios";
import { Admin } from "./components/Admin";

export const App = () => {
  return (
    <>
      <RecoilRoot>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <BrowserRouter>
          <InitState />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ToDoList />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
};

const InitState = () => {
  const base_url = "https://todo-1-5ip8.onrender.com";

  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const init = async () => {
    const token = localStorage.getItem("token");
    try {
      var config = {
        method: "GET",
        url: `${base_url}/auth/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(config).then((res) => {
        if (res.data.isAdmin) {
          navigate("/admin");
        } else if (res.data.username) {
          setAuth({ token: res.data.token, username: res.data.username });
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      });
    } catch (e) {
      navigate("/login");
    }
  };
  useEffect(() => {
    init();
  }, []);
  return <></>;
};

export default App;
