import axios from "axios";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import Actions from "../../Redux/Actions";

function SpecialitiesData({
  data,
  callback2,
  callback3,
  callback4
}) {

  const dispatch = useDispatch();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  const DeleteSpeciality = async (id) => {
    try {
      const result = (
        await axios.delete(`${API_DOMAIN}/specialities/DeleteSpeciality/${id}`, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        // callback((prev) => prev.filter((ele) => ele.SpecialityId !== id));
        dispatch(Actions.delete_speciality(id));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const StartUpdateSpecialityName = (id, name) => {
    callback2(true);
    callback3(name);
    callback4(id)
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Speciality Id</th>
          <th>Speciality Name</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          return (
            <tr key={ele.SpecialityId}>
              <td>{ele.SpecialityId}</td>
              <td>{ele.SpecialityName}</td>
              <td className="ModifyColumn">
                <a
                  href="#"
                  className="toCenter"
                  onClick={() => DeleteSpeciality(ele.SpecialityId)}
                >
                  <p>Delete</p>
                  <AiFillDelete />
                </a>
                <a
                  href="#"
                  className="toCenter updateBTN"
                  onClick={() => StartUpdateSpecialityName(ele.SpecialityId, ele.SpecialityName)}
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


export default React.memo(SpecialitiesData);