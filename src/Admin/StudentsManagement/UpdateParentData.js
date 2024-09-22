import React, { useState, useRef } from "react";
import axios from "axios";
import { GiCancel } from "react-icons/gi";
import { BiSolidPencil } from "react-icons/bi";
import { InputEmpty } from '../../ForAll';

const API_DOMAIN = process.env.React_App_API_DOMAIN;

function UpdateParentData({ data, callback, callback2 }) {
  const [F_CIN, setF_CIN] = useState(data[1]);
  const [M_CIN, setM_CIN] = useState(data[2]);
  const [F_Tel, setF_Tel] = useState(data[3]);
  const [M_Tel, setM_Tel] = useState(data[4]);

  const TargetForm = useRef();

  const Update = async (e) => {
    e.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(TargetForm.current));
      if (InputEmpty(data)) throw new Error("Some fields is empty");
      const result = (
        await axios.put(`${API_DOMAIN}/students/updateStudentParent`, data, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        document.getElementById("container").classList.remove("Desable");
        callback({ status: false });
        callback2((prev) =>
          prev.filter((ele) => {
            if (ele.StudentUsername === data.StudentUsername) {
              ele.F_CIN = data.F_CIN;
              ele.M_CIN = data.M_CIN;
              ele.F_Tel = data.F_Tel;
              ele.M_Tel = data.M_Tel;
            }
            return ele;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id="UpdateParentData">
      <div>
        <GiCancel
          onClick={() => {
            document.getElementById("container").classList.remove("Desable");
            callback({ status: false });
          }}
        />
      </div>
      <form ref={TargetForm}>
        <div>
          <input
            type="text"
            name="StudentUsername"
            placeholder="Student Username"
            value={data[0]}
          />
        </div>
        <div>
          <input
            type="text"
            name="F_CIN"
            placeholder="Father Cin"
            value={F_CIN}
            onChange={(e) => setF_CIN(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="M_CIN"
            placeholder="Mother Cin"
            value={M_CIN}
            onChange={(e) => setM_CIN(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="F_Tel"
            placeholder="Father Phone"
            value={F_Tel}
            onChange={(e) => setF_Tel(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="M_Tel"
            placeholder="Mother Phone"
            value={M_Tel}
            onChange={(e) => setM_Tel(e.target.value)}
          />
        </div>
        <div>
          <button onClick={Update}>
            <p>Update</p>
            <BiSolidPencil />
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(UpdateParentData);