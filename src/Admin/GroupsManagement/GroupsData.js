import axios from "axios";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import Actions from "../../Redux/Actions";

function GroupsData({
  data,
  callback2,
  callback3,
  callback4,
  callback5
}) {

  const dispatch = useDispatch();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  const DeleteGroup = async (id) => {
    try {
      const result = (
        await axios.delete(`${API_DOMAIN}/groups/deletegroup/${id}`, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        dispatch(Actions.delete_group(id));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const setInputValue = (id, name, level) => {
    callback2(name);
    callback3(level);
    callback4(true);
    callback5(id);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>GroupId</th>
          <th>GroupName</th>
          <th>Level</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          return (
            <tr>
              <td>{ele.GroupId}</td>
              <td>{ele.GroupName}</td>
              <td>{ele.Level}</td>
              <td className="ModifyColumn">
                <a
                  href="#"
                  className="toCenter"
                  onClick={() => DeleteGroup(ele.GroupId)}
                >
                  <p>Delete</p>
                  <AiFillDelete />
                </a>
                <a
                  href="#"
                  className="toCenter updateBTN"
                  onClick={() => setInputValue(ele.GroupId, ele.GroupName, ele.Level)}
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


export default React.memo(GroupsData);