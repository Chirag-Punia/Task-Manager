import React, { useEffect } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState();
  const [description, setDescription] = useState();
  const markDone = (id) => {
    axios.patch(`http://localhost:5000/todos/todo/${id}/done`).then(() => {
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
  var config = {
    method: "post",
    url: "http://localhost:5000/todos/todo",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: {
      task,
      description,
    },
  };
  const handleClick = (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/todos/todo").then((res) => {
      setTodos(res.data);
    });
    axios(config).then((res) => {
      console.log(2);
      if (res.status === 200) {
        console.log(3);
        setTodos([...todos, res.data]);
        toast.success("Task created");
      }
    });
  };
  useEffect(() => {

  }, []);
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
      {todos.map((todo) => (
        <div className="idd" key={todo._id}>
          <h3>{todo.task}</h3>
          <p>{todo.description}</p>

          <button onClick={() => markDone(todo._id)}>
            {todo.done ? "Done" : "Mark as Done"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToDoList;
