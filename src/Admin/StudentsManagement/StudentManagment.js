import React, { useEffect, useRef, useState } from "react";
import Layout, { Speciality_Group_Com, ShowMenu } from "../Layout";
import StudentsParentData from "./StudentParentData";
import StudentsList from "./StudentsList";
import UpdateParentData from "./UpdateParentData";
import UpdateStudentData from "./UpdateStudentData";
import { NoData, Loading, InputEmpty } from "../../ForAll";
import { AiOutlineFileProtect } from "react-icons/ai";
import {BiImageAdd } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../Redux/Actions';
import axios from "axios";
import { AiOutlineMenu } from 'react-icons/ai';
import "../Admin.css";
import "../../App.css";
import '../AdminRes.css';

export default function StudentManagment() {
  const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
  const Specialities = useSelector(state => state.SpecialitiesReducer.allSpecialities);
  const AllGroups = useSelector(state => state.GroupsReducer.allGroups);
  const dispatch = useDispatch();

  const [Students, setStudents] = useState([]);
  const [StudentsParants, setStudentsParants] = useState([]);
  const [Groups, setGroups] = useState([]);
  const [S_Conponent, setS_Conponent] = useState({
    result: (mess = null) => <NoData message={mess} />,
  });
  const [SP_Conponent, setSP_Conponent] = useState({
    result: (mess = null) => <NoData message={mess} />,
  });
  const [ShowPhoto, setShowPhoto] = useState(false);
  const [StudentPhoto, setStudentPhoto] = useState("");
  const [UpdateParentinfo, setUpdateParentinfo] = useState({ status: false });
  const [UpdateStudentinfo, setUpdateStudentinfo] = useState({ status: false });
  const [FileIcon, setFileIcon] = useState(<BiImageAdd />);
  const speciality = useRef();
  const InputFileContainer = useRef();
  const TargetForm = useRef();
  const container = useRef();
  const _group = useRef();
  const InputFile = useRef();
  const StudentsUsername = useRef();
  const redirect = useNavigate();
  const AdminUsername = useParams().username;
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    document.title = "IFAPP | Students Management";

    const AdminIsAuthenticated = async () => {
      const result = (
        await axios.get(`${API_DOMAIN}/auth/AdminIsAuthenticated`, {
          withCredentials: true,
        })
      ).data;
      if (!result.response || AdminUsername !== result.admin) {
        dispatch(Actions.IsNotAuthenticated());
        setTimeout(() => {
          redirect("/admin/auth/login");
        }, 5000);
      }
      else {
        dispatch(Actions.IsAuthenticated());
        if (!Specialities.length) GetAllSpecialities();
        if (!AllGroups.length) GetAllGroups();
      }
    };

    const GetAllSpecialities = async () => {
      try {
        const result = (
          await axios.get(`${API_DOMAIN}/specialities/GetAllSpecialities`, { withCredentials: true })
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response.length) {
          dispatch(Actions.exportAllSpecialities(result.response));
        }
      } catch (error) {
        alert(error.message);
      }
    };

    const GetAllGroups = async () => {
      try {
        const result = (await axios.get(`${API_DOMAIN}/groups/GetAllGroups`, { withCredentials: true }))
          .data;
        if (result.err) throw new Error(result.err);
        dispatch(Actions.exportAllGroups(result.response));
      } catch (error) {
        alert(error.message);
      };
    };

    if (!IsAuth) AdminIsAuthenticated();
    if (!Specialities.length) GetAllSpecialities();
    if (!AllGroups.length) GetAllGroups();
  }, []);

  useEffect(() => {
    setS_Conponent({ result: (mess = null) => <NoData message={mess} /> });
  }, [Students]);

  useEffect(() => {
    setSP_Conponent({ result: (mess = null) => <NoData message={mess} /> });
  }, [StudentsParants]);

  useEffect(() => {
    if (!Groups.length) setStudents([]);
  }, [Groups]);

  const GetAllStudentsGroups = async (e) => {
    const data = { Speciality: e.target.value };
    const checkSelectValueIsValid = () => {
      return Specialities.some(
        (ele) => ele.SpecialityId === parseInt(e.target.value)
      );
    };

    try {
      if (checkSelectValueIsValid()) {
        const result = (
          await axios.post(`${API_DOMAIN}/groups/GetSpecialitiesGroups`, data, { withCredentials: true })
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response.length) setGroups(result.response);
        else setGroups([]);
      } else setGroups([]); 
    } catch (error) {
      alert(error.message);
    }
  };

  // this function for get students data
  const getAllStudentsFromGroup = async (e) => {
    const group = e.target.value;
    const checkSelectValueIsValid = () => {
      return Groups.some((ele) => ele.GroupId === parseInt(group));
    };

    try {
      setS_Conponent({ result: (mess = null) => <Loading /> });
      if (checkSelectValueIsValid()) {
        const result = (
          await axios.get(
            `${API_DOMAIN}/students/getAllStudentsFromGroup/${group}`
            , { withCredentials: true })
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response.length) {
          const spclt = Specialities.find((ele) => {
            if (ele.SpecialityId == speciality.current.value) return ele;
          }).SpecialityName;

          const grp = Groups.find((ele) => {
            if (ele.GroupId == _group.current.value) return ele;
          }).GroupName;

          const data = result.response.map((ele) => {
            ele.Group = grp;
            ele.Speciality = spclt;
            return ele;
          });

          setStudents(data);
        } else setStudents([]);
      } else setGroups([]);
    } catch (error) {
      alert(error.message);
    }
  };

  // this function for get students parent contact info
  const SearchParentInformation = async () => {
    setSP_Conponent({ result: (mess = null) => <Loading /> });
    try {
      const username = StudentsUsername.current.value;
      if (!username)
        throw new Error("Enter a valid username don't let the field empty");
      const result = (
        await axios.get(`${API_DOMAIN}/students/ParentData/${username}`, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response.length) setStudentsParants(result.response);
      else setStudentsParants([]);
    } catch (error) {
      setSP_Conponent({ result: (mess = null) => <NoData message={mess} /> });
      alert(error.message);
    }
  };

  const AddStudent = async (e) => {
    e.preventDefault();
  
    const CheckSelectValueIsValid = (obj, key, target) => {
      return obj.some((ele) => ele[key] == target);
    };
  
    try {
      let RequestData = new FormData(TargetForm.current);
      RequestData.append("format", RequestData.get("photo").type);
  
      const data = Object.fromEntries(RequestData);
  
      if (InputEmpty(data)) throw new Error("Some fields are empty");
      else if (!CheckSelectValueIsValid(AllGroups, "GroupId", data.group))
        throw new Error("Choose a valid group");
      else if (!CheckSelectValueIsValid(Specialities, "SpecialityId", data.speciality))
        throw new Error("Choose a valid specialty");
      else if (!data.photo.size) throw new Error("Choose a student image");
      else if (data.cin == data.f_cin || data.cin == data.m_cin || data.m_cin == data.f_cin)
        throw new Error('Choose a valid CIN');
      else if (data.tel == data.f_tel || data.cin == data.m_tel || data.m_tel == data.f_tel)
        throw new Error('Choose a valid phone number');
    
      const result = (await axios.post(
        `${API_DOMAIN}/students/addStudent`,
        RequestData, { withCredentials: true }
      )).data;
  
      if (result.err) throw new Error(result.err);
      if (result.response) {
        Array.from(document.getElementsByClassName('ToEmapty'))
          .forEach(ele => ele.value = '');
  
        InputFileContainer.current.style.background = "#f26767";
        InputFileContainer.current.firstElementChild.textContent = "Add student image";
        setFileIcon(<BiImageAdd />);
        InputFile.current.value = '';
      }
    } catch (error) {
      alert(error.message);
    }
  };  

  const SeeStudentImage = () => {
    return (
      <div id="StudentImage">
        <div
          onClick={() => {
            container.current.classList.remove("Desable");
            setShowPhoto(false);
          }}
        >
          <GiCancel />
        </div>
        <div>
          <img src={StudentPhoto} />
        </div>
      </div>
    );
  };

  const OnChangeInputFile = () => {
    setFileIcon(<AiOutlineFileProtect />);
    InputFileContainer.current.style.background = "#67f27c";
    InputFileContainer.current.firstElementChild.textContent =
      "The Image Added";
  };

  if (IsAuth) {
    return (
      <>
        {ShowPhoto && <SeeStudentImage />}
        {UpdateParentinfo.status && (
          <UpdateParentData
            data={UpdateParentinfo.data}
            callback={setUpdateParentinfo}
            callback2={setStudentsParants}
          />
        )}
        {UpdateStudentinfo.status && (
          <UpdateStudentData
            Groups={AllGroups}
            Specialities={Specialities}
            data={UpdateStudentinfo.data}
            callback={setUpdateStudentinfo}
            callback2={setStudents}
          />
        )}
        <div id="container" ref={container}>
          <Layout />
          <div id="StudentsManagement-content">
            <h1>
              <AiOutlineMenu className="ShowMenu" onClick={ShowMenu}/>
              {AdminUsername}
            </h1>
            <div id="StudentsInformation">
              <h2>Students Information</h2>
              <div>
                <Speciality_Group_Com
                  speciality={speciality}
                  callback={GetAllStudentsGroups}
                  Specialities={Specialities}
                  _group={_group}
                  Groups={Groups}
                  callback2={getAllStudentsFromGroup}
                />
                <div>
                  {Students.length ? (
                    <StudentsList
                      data={Students}
                      callback={setStudents}
                      callback2={setShowPhoto}
                      callback3={setStudentPhoto}
                      callback4={setUpdateStudentinfo}
                      callback5={setStudentsParants}
                    />
                  ) : (
                    S_Conponent.result("No students yet ...")
                  )}
                </div>
              </div>
            </div>
            <div id="ParentInformation">
              <h2>Parent Information</h2>
              <div>
                <div id="parentSearching" className="toCenter">
                  <input
                    type="text"
                    placeholder="Students username"
                    ref={StudentsUsername}
                    autoComplete="off"
                  />
                  <button onClick={SearchParentInformation}>Search</button>
                </div>
                <div>
                  {StudentsParants.length ? (
                    <StudentsParentData
                      data={StudentsParants}
                      callback={setStudentsParants}
                      callback2={setUpdateParentinfo}
                    />
                  ) : (
                    SP_Conponent.result("No data")
                  )}
                </div>
              </div>
            </div>
            <div id="InsertStudent">
              <h2>Add Student</h2>
              <form ref={TargetForm} enctype="multipart/form-data">
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Student username"
                    autoComplete="off"
                    className="ToEmapty"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Student first name"
                    autoComplete="off"
                    className="ToEmapty"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Student last name"
                    autoComplete="off"
                    className="ToEmapty"
                  />
                </div>
                <div>
                  <input type="text" name="cin" placeholder="Student cin" className="ToEmapty" />
                </div>
                <div>
                  <input type="text" name="tel" placeholder="Student phone" className="ToEmapty" />
                </div>
                <div>
                  <select name="group" className="ToEmapty">
                    <option value=''>Choose a group</option>
                    {AllGroups.map((ele) => (
                      <option key={ele.GroupId} value={ele.GroupId}>
                        {ele.GroupName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select name="speciality" className="ToEmapty">
                    <option value=''>Choose a specility</option>
                    {Specialities.map((ele) => (
                      <option key={ele.SpecialityId} value={ele.SpecialityId}>
                        {ele.SpecialityName}
                      </option>
                    ))}
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
                  <input type="text" name="f_cin" placeholder="Father cin" className="ToEmapty" />
                </div>
                <div>
                  <input type="text" name="f_tel" placeholder="Father phone" className="ToEmapty" />
                </div>
                <div>
                  <input type="text" name="m_cin" placeholder="Mother cin" className="ToEmapty" />
                </div>
                <div>
                  <input type="text" name="m_tel" placeholder="Mother phone" className="ToEmapty" />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Student password"
                    className="ToEmapty"
                  />
                </div>
                <div>
                  <button onClick={AddStudent}>Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <Loading />
      </div>
    );
  }
};