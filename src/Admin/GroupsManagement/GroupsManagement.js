import React, { useEffect, useRef, useState } from "react";
import Layout, { ShowMenu } from "../Layout";
import { useParams } from "react-router-dom";
import { NoData, Loading, InputEmpty } from "../../ForAll";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Actions from "../../Redux/Actions";
import axios from "axios";
import GroupsData from "./GroupsData";
import { BiSolidPencil } from 'react-icons/bi';
import { AiOutlineMenu } from 'react-icons/ai';
import "../Admin.css";
import "../../App.css";

export default function GroupsManagement() {
  const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
  const AllGroups = useSelector(state => state.GroupsReducer.allGroups);
  const dispatch = useDispatch();

  const [InputgroupName, setInputgroupName] = useState('');
  const [InputgroupLevel, setInputgroupLevel] = useState('');
  const [Btn, setBtn] = useState(false);
  const [ID, setID] = useState('');
  const [Conponent, setConponent] = useState({
    result: (mess = null) => <NoData message={mess} />,
  });
  const TargetForm = useRef();
  const AdminUsername = useParams().username;
  const redirect = useNavigate();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    document.title = "IFAPP | Groups Management";

    const AdminIsAuthenticated = async () => {
      const result = (
        await axios.get(`${API_DOMAIN}/auth/AdminIsAuthenticated`, {
          withCredentials: true,
        })
      ).data;
      if (!result.response || AdminUsername !== result.admin) {
        setTimeout(() => {
          redirect("/admin/auth/login");
        }, 5000);
        dispatch(Actions.IsNotAuthenticated());
      }
      else {
        dispatch(Actions.IsAuthenticated());
        if (!AllGroups.length) GetAllGroups();
      }
    };

    const GetAllGroups = async () => {
      try {
        setConponent({ result: (mess = null) => <Loading /> });
        const result = (await axios.get(`${API_DOMAIN}/groups/GetAllGroups`, { withCredentials: true }))
          .data;
        if (result.err) throw new Error(result.err);
        dispatch(Actions.exportAllGroups(result.response));
      } catch (error) {
        setConponent({ result: (mess = null) => <NoData message={mess} /> });
        alert(error.message);
      }
    };

    if (!IsAuth) AdminIsAuthenticated();
    if (!AllGroups.length) GetAllGroups();
  }, []);

  useEffect(() => {
    setConponent({ result: (mess = null) => <NoData message={mess} /> });
  }, [AllGroups]);

  const AddGroup = async (e) => {
    e.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(TargetForm.current));
      if (InputEmpty(data)) throw new Error('Some fields in empty');
      const result = (await axios.post(`${API_DOMAIN}/groups/addGroup`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        const NewData = { 
          GroupId: result.itemId, GroupName: data.groupName,
          Level: data.groupLevel
        };

        dispatch(Actions.add_group(NewData));
        setInputgroupName('');
        setInputgroupLevel('');
      };
    } catch (error) {
      alert(error.message);
    };
  };

  const Updategroup = async (e) => {
    e.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(TargetForm.current));
      data.GroupId = ID;
      if (InputEmpty(data)) throw new Error('Some fields in empty');
      const result = (await axios.put(`${API_DOMAIN}/groups/updateGroup`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        dispatch(Actions.update_group(ID, data));
        setInputgroupLevel('');
        setInputgroupName('');
        setBtn(false);
      };
    } catch (error) {
      alert(error.message);
    };
  };

  if (IsAuth) {
    return (
      <div id="container">
        <Layout />
        <div id="GroupsManagement-content">
          <h1>
            <AiOutlineMenu className="ShowMenu" onClick={ShowMenu} />
            {AdminUsername}
          </h1>
          <div id="AllInstitutGroups">
            <h2>All Institut Groups</h2>
            <div>
              {AllGroups.length ? (
                <GroupsData
                  data={AllGroups}
                  callback2={setInputgroupName}
                  callback3={setInputgroupLevel}
                  callback4={setBtn}
                  callback5={setID}
                />
              ) :
                Conponent.result("No groups yet ...")
              }
            </div>
          </div>
          <div id="AddGroup">
            <h2>Add Group</h2>
            <form ref={TargetForm}>
              <div>
                <input
                  type="text"
                  name="groupName"
                  placeholder="Group Name"
                  value={InputgroupName}
                  onChange={(e) => setInputgroupName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="groupLevel"
                  placeholder="Group Level"
                  value={InputgroupLevel}
                  onChange={(e) => setInputgroupLevel(e.target.value)}
                />
              </div>
              <div>
                {Btn ? (
                  <button id="updatebtn" onClick={Updategroup}>
                    <p>Update</p>
                    <BiSolidPencil />
                  </button>
                ) : (
                  <button onClick={AddGroup} id="addbtn-GM">Add</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <Loading />
      </div>
    );
  };
};