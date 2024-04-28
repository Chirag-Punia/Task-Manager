import React from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState();
  const [description, setDescription] = useState();
  const handleClick = (e) => {
    e.preventDefault();
    setTodos([...todos, { task, description }]);
    console.log(todos.forEach((todo) => console.log(todo)));
    axios
      .post("http://localhost:5000/todo", { task, description })
      .then((res) => {
        if (res.data === "Task created") {
          toast.success("Task created");
        }
      });
  };
  return (
    <div>
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
        <label>description</label>
        <input
          type="text"
          placeholder="Enter description"
          className="input"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button onClick={handleClick}>Add</button>
      </form>
    </div>
  );
};

export default ToDoList;
