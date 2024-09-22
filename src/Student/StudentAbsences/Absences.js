import React, { useEffect, useRef, useState } from 'react';
import Layout from '../Layout';
import { AiOutlineMenu } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Actions from '../../Redux/Actions';
import { GetSchoolYear, InputEmpty, Loading, NoData } from '../../ForAll';
import { SchoolYearSelect } from '../../Admin/Layout';
import AbsencesData from './AbsencesData';
import axios from 'axios';
import '../Student.css';
import '../../App.css';

export default function Absences() {
    const { Photo = null } = useSelector(state => state.StudentReducer.StudentData);
    const StudentAuth = useSelector(state => state.AuthReducer.StudentAuth);
    const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
    const dispatch = useDispatch();

    const [Absences, setAbsences] = useState([]);
    const [Component, setComponent] = useState({
        result: (mess = null) => <NoData message={mess} />
    });
    const Username = useParams().username;
    const TargetForm = useRef();
    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    useEffect(() => {
        document.title = "IFAPP | Student Absences";

        const IsAuthencated = async () => {
            try {
                const result = (await axios.get(`
                    ${API_DOMAIN}/students/studentIsAuth`,
                    { withCredentials: true }
                )).data;

                if (!result.response || Username !== result.data.StudentUsername)
                    redirect('/');
                else {
                    dispatch(Actions.student_is_auth());
                    dispatch(Actions.export_student_data(result.data));
                    if (!SchoolYears.length) GetAllSchoolYears();
                };
            } catch (error) {
                alert(error.message);
            };
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

        if (!StudentAuth) IsAuthencated();
        if (!SchoolYears.length) GetAllSchoolYears();
    }, []);

    useEffect(() => {
        setComponent({ result: (mess = null) => <NoData message={mess} /> });
        console.log(Absences);
    }, [Absences]);

    const GetStudentAbsences = async (e) => {
        e.preventDefault();

        try {
            setComponent({ result: () => <Loading /> });
            let data = Object.fromEntries(new FormData(TargetForm.current));
            data.StudentUsername = Username;
            data.SchoolYear = data.Schoolyear;
            delete data.Schoolyear;
            if (InputEmpty(data)) throw new Error('Some fields in empty');
            if (![1, 2, 3, 4, 5, 6, 9, 10, 11, 12].includes(parseInt(data.Month)))
                throw new Error('This month is not valid');
            const result = (await axios.post(
                `${API_DOMAIN}/absences/GetAbsences`,
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
              };
        } catch (error) {
            setComponent({ result: (mess = null) => <NoData message={mess} /> });
            alert(error.message);
        };
    };

    const ShowMenu = () =>{
        const ele = document.getElementById('layout');
        ele.style.left = '0%';
    };

    return (
      <div id='container'>
          <Layout />
          <div id='StudentAbsences-content'>
              <div>
                <AiOutlineMenu className='ShowMenu other1' onClick={ShowMenu}/>
                  <div>
                      <p> { Username } </p>
                      <div id='StudentProfile'> <img src={Photo}/> </div>
                  </div>
              </div>
              <div id='AbsencesInfo'>
                <h2>Absnces</h2>
                <div id='_Content'>
                    <form ref={TargetForm}>
                        <div>
                            <input type='number' name='Month' placeholder='Month'/>
                        </div>
                        <SchoolYearSelect data={SchoolYears}/>
                        <div>
                            <button onClick={GetStudentAbsences}>Get Absences</button>
                        </div>
                    </form>
                    <div>
                        {
                            Absences.length ?
                                <AbsencesData data={Absences} /> :
                                Component.result('No Data ...')
                        }
                    </div>
                </div>
              </div>
          </div>
      </div>
    );
};