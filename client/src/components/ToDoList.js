import React, { useEffect } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { useNavigate } from "react-router-dom";


const ToDoList = () => {
  const navigate = useNavigate();
  const [date, Datechange] = useState(
    new Date().toISOString().slice(0, 10) +
      "T" +
      new Date().toISOString().slice(11, 16)
  );
  const base_url = "https://todo-1-5ip8.onrender.com";
  const dev_url = "http://localhost:5000";
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState();
  const [description, setDescription] = useState();
  const authStateValue = useRecoilValue(authState);

  const markDone = async (id) => {
    var temp = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method : "PATCH",
      url : `${base_url}/todos/todo/${id}/done`,
    }
    await axios(temp).then(() => {
      setTodos(
        todos.map((todo) => {
          if (id === todo._id) {
            return { ...todo, done: true };
          }
          return todo;
        })
      );
    });
  };
  var configTodo = {
    method: "POST",
    url: `${base_url}/todos/todo`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      task,
      description,
      date,
    },
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await axios(configTodo).then((res) => {
      if (res.status === 200) {
        setTodos([...todos, res.data]);
        toast.success("Task created");
      }
    });
  };
  useEffect(() => {
    const temp = async () => {
      var config = {
        url: `${base_url}/todos/todo`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await axios(config).then((res) => {
        setTodos(res.data);
      });
    };
    temp();
  }, [authState.value]);
  return (
    <>
      <div>
        <h2 className="h2name">Welcome {authStateValue.username}</h2>
        <div>
          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
        <form>
          <label>Task</label>
          <input
            type="text"
            placeholder="Enter the task"
            className="input"
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter description"
            className="input"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <div className="date">
            <label>Date and Time</label>
            <input
              aria-label="Date and time"
              type="datetime-local"
              value={date}
              onChange={(e) => {
                Datechange(e.target.value);
              }}
            />
          </div>
          <button onClick={handleClick}>Add</button>
        </form>
        {todos.map((todo) => (
          <div className="idd" key={todo._id}>
            <h3>Task : {todo.task}</h3>
            <p>Description : {todo.description}</p>
            <p>Scheduled Date : {todo.date.slice(0, 10)}</p>
            <p>Scheduled Time : {todo.date.slice(11, 16)}</p>

            <button onClick={() => markDone(todo._id)}>
              {todo.done ? "Done" : "Mark as Done"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToDoList;
