import React, { useState, useEffect, useRef } from 'react';
import Layout, { SchoolYearSelect, ShowMenu } from '../Layout';
import { useParams, useNavigate } from 'react-router-dom';
import AbsencesData from './AbsencesData';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../Redux/Actions';
import axios from 'axios';
import { checkSelectValueIsValid, InputEmpty, GetSchoolYear, Loading, NoData } from '../../ForAll';
import { AiOutlineMenu } from 'react-icons/ai';
import '../Admin.css';
import '../../App.css';

export default function AbsencesManagement() {
    const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
    const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
    const dispatch = useDispatch();

    const InputStudentUsername = useRef();
    const InputMonth = useRef();
    const SelectSchoolYear = useRef();
    const [Absences, setAbsences] = useState([]);
    const [Component, setComponent] = useState({ 
        result: (mess = null) => <NoData message={mess} /> 
    })
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
            if (!SchoolYears.length) GetAllSchoolYears();
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
    }, []);

    useEffect(() => {
        setComponent({ 
            result: (mess = null) => <NoData message={mess} /> 
        });
    }, [Absences]);

    const GetStudentAbsences = async () => {
        try {
            setComponent({ result: (mess = null) => <Loading /> });
            const data = { 
                StudentUsername: InputStudentUsername.current.value,
                Month: InputMonth.current.value,
                SchoolYear: SelectSchoolYear.current.value
            };
            if (![9, 10, 11, 12, 1, 2, 3, 4, 5, 6].includes(parseInt(data.Month)))
                throw new Error("This month isn't valid");
            if (InputEmpty({ val1: data.StudentUsername, val2: data.Month }))
                throw new Error('The username field is empty');
            if (!checkSelectValueIsValid(SchoolYears, data.SchoolYear))
                throw new Error('choose a valid school year');

            const result = (await axios.post(
                `${API_DOMAIN}/absences/GetStudentAbsences`,
                data, { withCredentials: true }
            )).data;

            if (result.err) throw new Error(result.err);
            if (result.response.length) setAbsences(result.response);
            else {
              const getDate = () => {
                if (parseInt(data.Month) >= 9 && parseInt(data.Month) <= 12)
                  return `${data.SchoolYear.slice(0, 4)}-${data.Month}`;
                return `${data.SchoolYear.slice(5)}-${data.Month}`;
              };

              setAbsences([{
                StudentUsername: data.StudentUsername,
                AbsenceDate: getDate(),
                AbsenceHourStart: null,
                AbsenceHourEnd: null,
                schoolYear: data.SchoolYear
              }]);
            }
        } catch (error) {
            alert(error.message);
            setComponent({ 
                result: (mess = null) => <NoData message={mess} /> 
            });
        };
    };

    if (IsAuth) {
        return (
            <div id='container'>
                <Layout />
                <div id='AbcenseManagemnt-content'>
                  <h1>
                    <AiOutlineMenu className='ShowMenu' onClick={ShowMenu} />
                    { AdminUsername }
                  </h1>
                  <div id='AbsencesInfo'>
                      <h2>Absences Information</h2>
                      <div>
                          <div>
                            <input 
                                type='text' 
                                name='StudentUsername' 
                                placeholder='Student Username'
                                ref={InputStudentUsername} 
                                className='AdminInput'
                            />
                          </div>
                          <div>
                            <input 
                                type='number' 
                                name='Month' 
                                placeholder='Month' 
                                ref={InputMonth}
                                className='AdminInput'
                            />
                          </div>
                          <SchoolYearSelect 
                            data={SchoolYears}
                            Refe={SelectSchoolYear}
                          />
                          <div>
                            <button onClick={GetStudentAbsences}>Get Absences</button>
                          </div>
                          <div>
                            { 
                                Absences.length ? 
                                <AbsencesData data={Absences} /> :
                                Component.result("No data yet ...")
                            }
                          </div>
                      </div>
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
};