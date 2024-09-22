import React from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { GiCancel } from 'react-icons/gi';

export default function Layout() {
  const adminUsername = useParams().username;
  const API_DOMAIN = process.env.React_App_API_DOMAIN;
  
  const LogOut = async () => {
    try {
      await axios.get(`${API_DOMAIN}/auth/logout`, { withCredentials: true });
    } catch (error) {
      alert(error.message);
    }
  };

  const HideMenu = () => {
    const ele = document.getElementById('layout');
    ele.style.left = '-100%';
  }

  return (
    <div id='layout'>
        <div>
            <img src="/Images/logo.svg" alt="Logo" />
            <GiCancel onClick={HideMenu} style={{ display: "none" }}/>
        </div>
        <ul>
          <li>
            <Link to={`/admin/account/StudentsManagement/${adminUsername}`}>
              Students Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/account/GroupsManagement/${adminUsername}`}>
              Groups Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/account/SpecialitiesManagement/${adminUsername}`}>
              Specialities Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/account/ExamsManagement/${adminUsername}`}>
              Exams Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/account/PaymentManagement/${adminUsername}`}>
              Payments Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/account/AbsencesManagement/${adminUsername}`}>
              Absences Management
            </Link>
          </li>
          <li>
            <Link to={`/admin/auth/login`} onClick={LogOut}>
              Log out
            </Link>
          </li>
        </ul>
    </div>
  );
};


function MemoizedSpeciality_Group_Com({
  speciality = null,
  callback,
  Specialities = [],
  _group = null,
  Groups = [],
  callback2
}) {

  return (
    <>
      <div>
        <select
          id="specialities"
          ref={speciality}
          onChange={callback}
        >
          <option>Choose a specility</option>
          {Specialities.map((ele) => (
            <option key={ele.SpecialityId} value={ele.SpecialityId}>
              {ele.SpecialityName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          id="groups"
          ref={_group}
          className={Groups.length ? "" : "Desable"}
          onChange={callback2}
        >
          <option>Choose a group</option>
          {Groups.map((ele) => (
            <option key={ele.GroupId} value={ele.GroupId}>
              {ele.GroupName}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export const Speciality_Group_Com = React.memo(MemoizedSpeciality_Group_Com);


export const MemoizedSchoolYearSelect = ({ data, callback = null, callback2 = null, Refe = null }) => {
  const WhenOnchange = (e) => {
    if (callback && callback2) {
      callback(e);
      callback2(e.target.value);
    };

    return null;
  };

  return (
    <div>
      <select name='Schoolyear' onChange={WhenOnchange} ref={Refe}> {/* add name attribute */}
        <option value=''>Choose school year</option> {/* Change value from null to '' */}
        { data.map(ele => {
          return <option value={ele}>{ ele }</option>;
        }) }
      </select>
    </div>
  );
}

export const SchoolYearSelect = React.memo(MemoizedSchoolYearSelect);

export const ShowMenu = () =>{
  const ele = document.getElementById('layout');
  ele.style.left = '0%';
};