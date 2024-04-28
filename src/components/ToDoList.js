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
    axios.patch(`http://localhost:5000/todo/${id}/done`).then((res) => {
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
  const handleClick = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/todo", { task, description })
      .then((res) => {
        if (res.status === 200) {
          setTodos([...todos, res.data]);
          toast.success("Task created");
        }
      });
  };
  useEffect(() => {
    axios.get("http://localhost:5000/todo").then((res) => {
      setTodos(res.data);
    });
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
