import React from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";

const API_DOMAIN = process.env.React_App_API_DOMAIN;

function StudentsParentData({ data, callback, callback2 }) {
  const DeleteStudentParentInfo = async (username) => {
    try {
      const result = (
        await axios.delete(
          `${API_DOMAIN}/students/deleteStudentParent/${username}`
          , { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        callback((prev) =>
          prev.filter((ele) => ele.StudentUsername !== username)
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
          <th>Students Username</th>
          <th>Father CIN</th>
          <th>Mother CIN</th>
          <th>Father Phone</th>
          <th>Mother Phone</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          return (
            <tr key={ele.StudentUsername}>
              <td>{ele.StudentUsername}</td>
              <td>{ele.F_CIN}</td>
              <td>{ele.M_CIN}</td>
              <td>{ele.F_Tel}</td>
              <td>{ele.M_Tel}</td>
              <td className="ModifyColumn">
                <a
                  href="#"
                  className="toCenter"
                  onClick={() => DeleteStudentParentInfo(ele.StudentUsername)}
                >
                  <p>Delete</p>
                  <AiFillDelete />
                </a>
                <a
                  href="#"
                  className="toCenter updateBTN"
                  onClick={() => {
                    callback2({
                      status: true,
                      data: [
                        ele.StudentUsername,
                        ele.F_CIN,
                        ele.M_CIN,
                        ele.F_Tel,
                        ele.M_Tel,
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


export default React.memo(StudentsParentData);