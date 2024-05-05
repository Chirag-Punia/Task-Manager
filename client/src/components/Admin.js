import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import axios from "axios";
import { toast } from "react-toastify";

export const Admin = () => {
  const [data, setData] = useState();
  const [tasks, setTask] = useState();
  const [taskCount, setTaskCount] = useState();
  const [taskloading, settaskLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const deleteUser = async (e) => {
    e.preventDefault();
    let idd = e.target.value;
    var config = {
      method: "DELETE",
      url: "http://localhost:5000/admin/data/del",
      data: { idd },
    };

    await axios(config).then((res) => {
      if (res.data === "Admin") {
        toast.error("Admin can not be deleted");
      } else if (res.data === "del") {
        toast.success("successfully deleted");
      }
    });
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let idd = e.target.value;
    var config = {
      method: "PATCH",
      url: "http://localhost:5000/admin/data",
      data: { idd },
    };

    await axios(config).then((res) => {
      if (res.status === 200) {
        toast.success("success");
      }
    });
  };

  useEffect(() => {
    const initTask = async () => {
      var config = {
        method: "GET",
        url: "http://localhost:5000/admin/data/task",
      };
      await axios(config).then((res) => {
        setTask(res.data);
        settaskLoading(false);
      });
    };
    const init = async () => {
      var config = {
        method: "GET",
        url: "http://localhost:5000/admin/data",
      };
      await axios(config).then((res) => {
        setData(res.data);
        setLoading(false);
      });
    };
    init();
  }, [data]);

  return (
    <>
      <div className="admin">
        <button
          className="adminLogout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location = "/login";
          }}
        >
          Logout
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>

              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <th>Loading ...</th>
              </tr>
            ) : (
              <>
                {data.map((val, index) => (
                  <>
                    <tr key={index}>
                      <td>{val.name}</td>
                      <td>{val.email}</td>

                      <td>
                        {val.isAdmin ? (
                          <button>Yes</button>
                        ) : (
                          <button value={val._id} onClick={handleClick}>
                            {val.isAdmin ? "Yes" : "No"}
                          </button>
                        )}
                      </td>
                      <td>
                        <button value={val._id} onClick={deleteUser}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
