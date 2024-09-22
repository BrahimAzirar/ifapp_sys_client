import React, { useEffect, useState } from 'react';
import Layout, { Speciality_Group_Com, SchoolYearSelect, ShowMenu } from '../Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { checkSelectValueIsValid, GetSchoolYear, Loading, NoData } from '../../ForAll';
import PaymentData from './PaymentData';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../Redux/Actions';
import { AiOutlineMenu } from 'react-icons/ai';
import axios from 'axios';
import '../Admin.css';
import '../../App.css';

export default function PaymentManagment() {
  const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
  const AllSpecialities = useSelector(state => state.SpecialitiesReducer.allSpecialities);
  const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
  const dispatch = useDispatch();

  const [Payments, setPayments] = useState([]);
  const [Groups, setGroups] = useState([]);
  const [Payment, setPayment] = useState(0);
  const [Component, setComponent] = useState({ result: (mess = null) => <NoData message={mess} /> });
  const [TargetGroup, setTargetGroup] = useState('');
  const [TargetSchoolYear, setTargetSchoolYear] = useState('');
  const AdminUsername = useParams().username;
  const redirect = useNavigate();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
      document.title = "IFAPP | Payment Management";

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
          if (!SchoolYears.length) GetAllSchoolYears();
        }
      };
  
      const GetAllSpecialities = async () => {
        try {
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

      const GetAllSchoolYears = async () => {
        try {
          const result = (await axios.get(`${API_DOMAIN}/payments/getShcoolYears`, { withCredentials: true })).data;
          if (result.err) throw new Error(result.err);
          if (result.response.includes(GetSchoolYear())) 
            dispatch(Actions.export_all_SchoolYears(result.response));
          else dispatch(Actions.export_all_SchoolYears([...result.response, GetSchoolYear()]));
        } catch (error) {
          alert(error.message);
        };
      };
  
      if (!IsAuth) AdminIsAuthenticated();
      if (!SchoolYears.length) GetAllSchoolYears();
      if (!AllSpecialities.length) GetAllSpecialities();
  }, []);

  useEffect(() => {
    setComponent({ result: (mess = null) => <NoData message={mess} /> });
  }, [Payments]);

  const GetAllStudentsGroups = async (e) => {
      const data = { Speciality: e.target.value };
  
      try {
        if (checkSelectValueIsValid(AllSpecialities, e, 'SpecialityId')) {
          const result = (
            await axios.post(`${API_DOMAIN}/groups/GetSpecialitiesGroups`, data, { withCredentials: true })
          ).data;
          if (result.err) throw new Error(result.err);
          if (result.response.length) setGroups(result.response);
          else setGroups([]);
        } else {
          setGroups([]); 
          setPayments([]);
        }
      } catch (error) {
        alert(error.message);
      }
  };

  const GetStudentPayment = async (e) => {
    try {
      if (checkSelectValueIsValid(SchoolYears, e)) {
        setComponent({ result: () => <Loading /> });
        const selectvalue = e.target.value;
        if (!TargetGroup) throw new Error('Choose a group');
        const data = { schoolYear: selectvalue, group: TargetGroup };
        const result = (await axios.post(`${API_DOMAIN}/payments/GetPaymentsData`, data, { withCredentials: true })).data;
        if (result.err) throw new Error(result.err);
        setPayments(result.response);
      } else {
        setGroups([]);
        setPayments([]);
        setTargetGroup('');
      }
    } catch (error) {
      alert(error.message);
      setComponent({ result: (mess = null) => <NoData message={mess} /> });
    };
  };

  if (IsAuth) {
    return (
      <div id='container'>
          <Layout />
          <div id='PaymentManagemnt-content'>
              <h1>
                <AiOutlineMenu className='ShowMenu' onClick={ShowMenu}/>
                {AdminUsername}
              </h1>
              <div id='PaymentInfo'>
                  <h2>Payment Information</h2>
                  <div>
                      <Speciality_Group_Com
                          Specialities={AllSpecialities}
                          Groups={Groups}
                          callback={GetAllStudentsGroups}
                          callback2={(e) => setTargetGroup(e.target.value)}
                      />
                      <SchoolYearSelect 
                        data={SchoolYears} 
                        callback={GetStudentPayment}
                        callback2={setTargetSchoolYear}
                      />
                      <div>
                        {
                          Payments.length ?
                          <PaymentData 
                            data={Payments} 
                            TargetSchoolYear={TargetSchoolYear}
                            callback={setPayments}
                            callback2={setPayment}
                          /> :
                          Component.result("No data yet ...")
                        }
                      </div>
                  </div>
              </div>
              {Payment ? <h2>{Payment} dh</h2> : null}
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
};