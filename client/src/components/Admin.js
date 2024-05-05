import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import axios from "axios";

export const Admin = () => {
  const [data, setData] = useState();
  const [buttontext, setButtonText] = useState("No");
  const [loading, setLoading] = useState(true);
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
        setButtonText("Yes");
      }
    });
  };

  useEffect(() => {
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
              <th>Admin</th>
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
                      <td>
                        {val.isAdmin ? (
                          <button>Yes</button>
                        ) : (
                          <button value={val._id} onClick={handleClick}>
                            {val.isAdmin ? "Yes" : "No"}
                          </button>
                        )}
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
