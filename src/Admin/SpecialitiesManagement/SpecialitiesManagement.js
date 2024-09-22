import React, { useEffect, useRef, useState } from "react";
import Layout, { ShowMenu } from "../Layout";
import { useParams, useNavigate } from "react-router-dom";
import { NoData, Loading, InputEmpty } from "../../ForAll";
import SpecialitiesData from "./SpecialitiesData";
import { BiSolidPencil } from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux';
import Actions from "../../Redux/Actions";
import axios from "axios";
import { AiOutlineMenu } from 'react-icons/ai';
import "../Admin.css";
import "../../App.css";

export default function SpecialitiesManagement() {
  const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
  const AllSpecialities = useSelector(state => state.SpecialitiesReducer.allSpecialities);
  const dispatch = useDispatch();

  const [Btn, setBtn] = useState(false);
  const [ID, setID] = useState('');
  const [InputSpecialityName, setInputSpecialityName] = useState('');
  const [Conponent, setConponent] = useState({
    result: (mess = null) => <NoData message={mess} />,
  });
  const AdminUsername = useParams().username;
  const API_DOMAIN = process.env.React_App_API_DOMAIN;
  const redirect = useNavigate();
  const TargetForm = useRef();

  useEffect(() => {
    document.title = "IFAPP | Specialities Management";

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
        if (!AllSpecialities.length) GetAllSpecialities();
      }
    };

    const GetAllSpecialities = async () => {
      try {
        setConponent({ result: (mess = null) => <Loading /> });
        const result = (
          await axios.get(`${API_DOMAIN}/specialities/GetAllSpecialities`, { withCredentials: true })
        ).data;
        if (result.err) throw new Error(result.err);
        if (result.response) {
          dispatch(Actions.exportAllSpecialities(result.response));
        }
      } catch (error) {
        alert(error.message);
      }
    };

    if (!IsAuth) AdminIsAuthenticated();
    if (!AllSpecialities.length) GetAllSpecialities();
  }, []);


  useEffect(() => {
    setConponent({
      result: (mess = null) => <NoData message={mess} />,
    });
  }, [AllSpecialities]);


  const AddSpeciality = async (e) => {
    e.preventDefault();

    try {
        const data = Object.fromEntries(new FormData(TargetForm.current));
        if (InputEmpty(data)) throw new Error('Enter the speciality name');
        const result = (await axios.post(`${API_DOMAIN}/specialities/addSpeciality`, data, { withCredentials: true })).data;
        if (result.err) throw new Error(result.err);
        if (result.response) {
          const NewSpeciality = {SpecialityName: data.speciality, SpecialityId: result.itemId};
          dispatch(Actions.add_speciality(NewSpeciality));
          setInputSpecialityName('');
        };
    } catch (error) {
        alert(error.message);
    };
  };

  const UpdateSpeciality = async (e) => {
    e.preventDefault();

    try {
        const data = Object.fromEntries(new FormData(TargetForm.current));
        data.SpecialityId = ID;
        const result = (await axios.put(`${API_DOMAIN}/specialities/updateSpeciality`, data, { withCredentials: true })).data;
        if (result.err) throw new Error(result.err);
        if (result.response) {
            setBtn(false);
            setInputSpecialityName('');
            dispatch(Actions.update_speciality(ID, data.speciality));
        };
    } catch (error) {
        alert(error.message);
    };
  };

  if (IsAuth) {
    return (
      <div id="container">
        <Layout />
        <div id="SpecialitiesManagemnt-content">
          <h1>
            <AiOutlineMenu className="ShowMenu" onClick={ShowMenu}/>
            {AdminUsername}
          </h1>
          <div id="SpecialitiesInfo">
            <h2>All Institut Specialities</h2>
            <div id="AllInstitutSpecialities">
              {AllSpecialities.length ? (
                <SpecialitiesData
                  data={AllSpecialities}
                  callback2={setBtn}
                  callback3={setInputSpecialityName}
                  callback4={setID}
                />
              ) : (
                Conponent.result("No specialities yet ...")
              )}
            </div>
          </div>
          <div id="AddSpeciality">
            <h2>Add Speciality</h2>
            <form ref={TargetForm}>
              <div>
                <input
                  type="text"
                  name="speciality"
                  placeholder="Speciality Name"
                  value={InputSpecialityName}
                  onChange={e => setInputSpecialityName(e.target.value)}
                />
              </div>
              <div>
                {Btn ? (
                  <button id="updatebtn" onClick={UpdateSpeciality}>
                    <p>Update</p>
                    <BiSolidPencil />
                  </button>
                ) : (
                  <button id="addbtn-SM" onClick={AddSpeciality}>
                    Add
                  </button>
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
  }
}
