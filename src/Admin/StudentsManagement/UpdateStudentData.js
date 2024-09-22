import React, { useState, useRef } from "react";
import axios from "axios";
import { BiImageAdd, BiSolidPencil } from "react-icons/bi";
import { AiOutlineFileProtect } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { InputEmpty } from '../../ForAll';

const API_DOMAIN = process.env.React_App_API_DOMAIN;

function UpdateStudentData({
  Groups,
  Specialities,
  data,
  callback,
  callback2,
}) {
  const [Firstname, setFirstname] = useState(data[1]);
  const [Lastname, setLastname] = useState(data[2]);
  const [CIN, setCIN] = useState(data[3]);
  const [Tel, setTel] = useState(data[4]);
  const [Group, setGroup] = useState(data[5]);
  const [Speciality, setSpeciality] = useState(data[6]);
  const [Password, setPassword] = useState(data[7]);
  const [FileIcon, setFileIcon] = useState(<BiImageAdd />);
  const InputFile = useRef();
  const InputFileContainer = useRef();
  const TargetForm = useRef();

  const OnChangeInputFile = () => {
    setFileIcon(<AiOutlineFileProtect />);
    InputFileContainer.current.style.background = "#67f27c";
    InputFileContainer.current.firstElementChild.textContent =
      "The Image Added";
  };

  const UpdateStudent = async (e) => {
    e.preventDefault();
    const username = data[0];
    try {

      const CheckSelectValueIsvalid = (obj, key, target) => {
        return obj.some((ele) => ele[key] == target);
      };

      let RequestData = new FormData(TargetForm.current);
        RequestData.append("format", RequestData.get("photo").type);

      const data = Object.fromEntries(RequestData);
      if (InputEmpty(data)) throw new Error("Some fields is empty");
      else if (!CheckSelectValueIsvalid(Groups, "GroupId", data.group))
        throw new Error("Choose a valid group");
      else if (
        !CheckSelectValueIsvalid(
          Specialities,
          "SpecialityId",
          data.speciality
        )
      )
        throw new Error("Choose a valid specility");
      const result = (
        await axios.put(`${API_DOMAIN}/students/UpdateStudent`, RequestData, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        callback({ status: false });
        document.getElementById("container").classList.remove("Desable");
        callback2(prev => prev.map(ele => {
          if (ele.StudentUsername === username) {
            ele.StudentUsername = data.username;
            ele.FirstName = data.firstname;
            ele.LastName = data.lastname;
            ele.S_CIN = data.cin;
            ele.Tel = data.tel;
            ele.Group = Groups.find(ele => ele.GroupId == data.group).GroupName;
            ele.Speciality = Specialities.find(ele => ele.SpecialityId == data.speciality).SpecialityName;
            ele.Password = data.password;

            if (RequestData.get('photo').size) {
              const reader = new FileReader();

              reader.onload = e => ele.Photo = e.target.result;
              reader.readAsDataURL(RequestData.get('photo'));
            };
          };
          return ele;
        }))
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div id="UpdateStudentData">
      <div
        onClick={() => {
          callback({ status: false });
          document.getElementById("container").classList.remove("Desable");
        }}
      >
        <GiCancel />
      </div>
      <form ref={TargetForm} enctype="multipart/form-data">
        <div>
          <input
            type="text"
            name="username"
            placeholder="Student Username"
            value={data[0]}
          />
        </div>
        <div>
          <input
            type="text"
            name="firstname"
            placeholder="Student First Name"
            value={Firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="lastname"
            placeholder="Student Last Name"
            value={Lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            name="cin"
            placeholder="Student CIN"
            value={CIN}
            onChange={(e) => setCIN(e.target.value)}
          />
        </div>
        <div>
          <input
            type="tel"
            name="tel"
            placeholder="Student Phone"
            value={Tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </div>
        <div>
          <select name="group">
            <option>Choose a group</option>
            {Groups.map((ele) => {
              if (Group === ele.GroupName) {
                return (
                  <option selected key={ele.GroupId} value={ele.GroupId}>
                    
                    {ele.GroupName}
                  </option>
                );
              } else {
                return (
                  <option key={ele.GroupId} value={ele.GroupId}>
                    
                    {ele.GroupName}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div>
          <select name="speciality">
            <option>Choose a specility</option>
            {Specialities.map((ele) => {
              if (Speciality === ele.SpecialityName) {
                return (
                  <option
                    selected
                    key={ele.SpecialityId}
                    value={ele.SpecialityId}
                  >
                    {ele.SpecialityName}
                  </option>
                );
              } else {
                return (
                  <option key={ele.SpecialityId} value={ele.SpecialityId}>
                    {ele.SpecialityName}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div>
          <input
            type="file"
            name="photo"
            ref={InputFile}
            placeholder="Student photo"
            accept=".jpg,.png,.jpeg,.webp"
            style={{ display: "none" }}
            onChange={OnChangeInputFile}
          />
          <div
            ref={InputFileContainer}
            onClick={() => InputFile.current.click()}
          >
            <p>Add student image</p>
            {FileIcon}
          </div>
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Student Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button onClick={UpdateStudent}>
            <p>Update</p>
            <BiSolidPencil />
          </button>
        </div>
      </form>
    </div>
  );
}


export default React.memo(UpdateStudentData);