import React, { useEffect, useRef, useState } from 'react';
import Layout from '../Layout';
import { AiOutlineMenu } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Actions from '../../Redux/Actions';
import { GetSchoolYear, InputEmpty, Loading, NoData } from '../../ForAll';
import { SchoolYearSelect } from '../../Admin/Layout';
import ExamsData from './ExamsData';
import axios from 'axios';
import '../Student.css';
import '../../App.css';

export default function StudentExams() {
  const { Photo = null } = useSelector(state => state.StudentReducer.StudentData);
  const StudentAuth = useSelector(state => state.AuthReducer.StudentAuth);
  const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
  const dispatch = useDispatch();

  const [Exams, setExams] = useState([]);
  const [Result, setResult] = useState('');
  const [ExamsComponent, setExamsComponent] = useState({
    result: (mess = null) => <NoData message={mess} />
  });
  const [ResultsComponent, setResultsComponent] = useState({
    result: (mess = null) => <NoData message={mess} />
  });

  const SelectSession = useRef();
  const ExamsForm = useRef();
  const ResultsForm = useRef();
  const Username = useParams().username;
  const redirect = useNavigate();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    document.title = "IFAPP | Student Exams";

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
    setExamsComponent({
      result: (mess = null) => <NoData message={mess} />
    })
  }, [Exams]);

  useEffect(() => {
    setResultsComponent({
      result: (mess = null) => <NoData message={mess} />
    })
  }, [Result]);

  const ShowMenu = () =>{
    const ele = document.getElementById('layout');
    ele.style.left = '0%';
  };

  const GetExams = async e => {
    e.preventDefault();

    setExamsComponent({
      result: () => <Loading />
    });

    try {
      const data = Object.fromEntries(new FormData(ExamsForm.current));
      data.StudentUsername = Username;
      if (InputEmpty(data)) throw new Error('Some feilds is empty !!!');
      const result = (await axios.post(
        `${API_DOMAIN}/exams/GetExams`,
        data, { withCredentials: true }
      )).data;
      if (result.err) throw new Error(result.err);
      setExams(result.response);
    } catch (error) {
      setExamsComponent({
        result: (mess = null) => <NoData message={mess} />
      });

      alert(error.message);
    };
  };

  const GetResults = async e => {
    e.preventDefault();

    setResultsComponent({
      result: () => <Loading />
    });
  
    try {
      const data = Object.fromEntries(new FormData(ResultsForm.current));
      data.StudentsUsername = Username;
      const result = (await axios.post(
        `${API_DOMAIN}/exams/GetResult`,
        data, { withCredentials: true }
      )).data;
      if (result.err) throw new Error(result.err);
      setResult(result.response);
    } catch (error) {
      setResultsComponent({
        result: (mess = null) => <NoData message={mess} />
      });

      alert(error.message);
    };
  };

  return (
    <div id='container'>
      <Layout />
      <div id='StudentExams-content'>
        <div>
          <AiOutlineMenu className='ShowMenu other1' onClick={ShowMenu}/>
            <div>
                <p> { Username } </p>
                <div id='StudentProfile'> <img src={Photo}/> </div>
            </div>
        </div>
        <div id='StudentExamsInfo'>
          <h2>Exams</h2>
          <form ref={ExamsForm}>
            <div>
              <select name='Session' ref={SelectSession}>
                <option value=''>Choose Session</option>
                <option value='1'>Session 1</option>
                <option value='2'>Session 2</option>
              </select>
            </div>
            <SchoolYearSelect data={SchoolYears}/>
            <div>
              <button onClick={GetExams}>Get All Exams</button>
            </div>
          </form>
          <div id='exams'>
            {
              Exams.length ?
              <ExamsData data={Exams} /> :
              ExamsComponent.result("No Exams ...")
            }
          </div>
        </div>
        <div id='StudentsResultsInfo'>
          <h2>Results</h2>
          <form ref={ResultsForm}>
            <div>
              <select name='Session' ref={SelectSession}>
                <option value=''>Choose Session</option>
                <option value='1'>Session 1</option>
                <option value='2'>Session 2</option>
              </select>
            </div>
            <SchoolYearSelect data={SchoolYears}/>
            <div>
              <button onClick={GetResults}>Get Results</button>
            </div>
          </form>
          <div>
            {
              Result ?
              <p id='note' style={{ 
                textAlign: "center",
                marginTop: "20px"
               }}>{ Result.Note }</p> :
              ResultsComponent.result("No Result ...")
            }
          </div>
        </div>
      </div>
    </div>
  );
};