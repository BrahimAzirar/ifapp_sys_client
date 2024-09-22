import React from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";

const API_DOMAIN = process.env.React_App_API_DOMAIN;

function StudentsList({
  data,
  callback,
  callback2,
  callback3,
  callback4,
  callback5
}) {
  const DeleteStudent = async (username) => {
    try {
      const result = (
        await axios.delete(`${API_DOMAIN}/students/deleteStudent/${username}`, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        callback((prev) =>
          prev.filter((ele) => ele.StudentUsername !== username)
        );
        callback5((prev) =>
          prev.filter((item) => item.StudentUsername !== username)
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Student Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>S_CIN</th>
          <th>Tel</th>
          <th>Photo</th>
          <th>Group</th>
          <th>Speciality</th>
          <th>Password</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          const seeimage = () => {
            document.getElementById("container").classList.add("Desable");
            callback2(true);
            callback3(ele.Photo);
          };

          return (
            <tr key={ele.StudentUsername}>
              <td>{ele.StudentUsername}</td>
              <td>{ele.FirstName}</td>
              <td>{ele.LastName}</td>
              <td>{ele.S_CIN}</td>
              <td>{ele.Tel}</td>
              <td>
                {ele.Photo ? (
                  <p className="seeImage" onClick={seeimage}>
                    see
                  </p>
                ) : (
                  <>.....</>
                )}
              </td>
              <td>{ele.Group}</td>
              <td>{ele.Speciality}</td>
              <td>{ele.Password}</td>
              <td className="ModifyColumn">
                <a
                  href="#"
                  className="toCenter"
                  onClick={() => DeleteStudent(ele.StudentUsername)}
                >
                  <p>Delete</p>
                  <AiFillDelete />
                </a>
                <a
                  href="#"
                  className="toCenter updateBTN"
                  onClick={() => {
                    callback4({
                      status: true,
                      data: [
                        ele.StudentUsername,
                        ele.FirstName,
                        ele.LastName,
                        ele.S_CIN,
                        ele.Tel,
                        ele.Group,
                        ele.Speciality,
                        ele.Password,
                      ],
                    });
                    document
                      .getElementById("container")
                      .classList.add("Desable");
                  }}
                >
                  <p>Update</p>
                  <BiSolidPencil />
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


export default React.memo(StudentsList);