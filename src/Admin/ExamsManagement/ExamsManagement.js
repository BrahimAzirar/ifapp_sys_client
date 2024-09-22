import React, { useState, useEffect, useRef } from 'react';
import Layout, { SchoolYearSelect, ShowMenu } from '../Layout';
import '../Admin.css';
import '../../App.css';
import { Loading, NoData, GetSchoolYear, InputEmpty } from '../../ForAll';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../Redux/Actions';
import ExamsData from './ExamsData';
import { AiFillDelete, AiOutlineMenu } from 'react-icons/ai';

export default function ExamsManagement() {
  const IsAuth = useSelector(state => state.AuthReducer.AdminAuth);
  const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
  const dispatch = useDispatch();

  const [TargetStudent, setTargetStudent] = useState([]);
  const [Exams, setExams] = useState([]);
  const [Result, setResult] = useState(null);
  const [ExamsComponent, setExamsComponent] = useState({
    result: (mess = null) => <NoData message={mess} />
  });
  const [ResultsComponent, setResultComponent] = useState({
    result: (mess = null) => <NoData message={mess} />
  });
  const ResultsInfoForm = useRef();
  const SelectSchoolYear = useRef();
  const SelectSession = useRef();
  const ExamsInfoForm = useRef();
  const AddExamForm = useRef();
  const Add_Session = useRef();
  const Add_SchoolYear = useRef();
  const AddResult_Form = useRef();
  const AdminUsername = useParams().username;
  const redirect = useNavigate();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    document.title = "IFAPP | Exams Management";

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
    setExamsComponent({
      result: (mess = null) => <NoData message={mess} />
    });
  }, [Exams]);

  useEffect(() => {
    setResultComponent({
      result: (mess = null) => <NoData message={mess} />
    });
  }, [Result]);

  const GetStudentExams = async (e) => {
    e.preventDefault();

    try {
      setExamsComponent({
        result: () => <Loading />
      });
      const data = Object.fromEntries(new FormData(ExamsInfoForm.current));
      if (InputEmpty(data)) throw new Error("Some fields is empty");

      const result = (await axios.post(
        `${API_DOMAIN}/exams/GetStudentExams`,
        data, { withCredentials: true }
      )).data;

      if (result.err) throw new Error(result.err);
      setTargetStudent(data);
      setExams(result.response);
    } catch (error) {
      setExamsComponent({
        result: (mess = null) => <NoData message={mess} />
      });
      alert(error.message);
    };
  };

  const GetStudentResult = async (e) => {
    e.preventDefault();

    try {
      setResultComponent({
        result: (mess = null) => <Loading />
      });
      const data = Object.fromEntries(new FormData(ResultsInfoForm.current));

      const result = (await axios.post(
        `${API_DOMAIN}/exams/GetStudentResult`,
        data, { withCredentials: true }
      )).data;

      if (result.err) throw new Error(result.err);
      if (result.response) setResult(result.response);
      else {
        setResultComponent({
          result: (mess = null) => <NoData message={mess} />
        });
      };
    } catch (error) {
      setResultComponent({
        result: (mess = null) => <NoData message={mess} />
      });
      alert(error.message);
    };
  };

  const AddExam = async (e) => {
    e.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(AddExamForm.current));
      if (InputEmpty(data)) throw new Error("Some fields is empty");
      const result = (await axios.post(
        `${API_DOMAIN}/exams/AddExam`, data,
        { withCredentials: true }
      )).data;

      if (result.err) throw new Error(result.err);
      if (result.response) alert("Added Exam Successfully");
    } catch (error) {
      alert(error.message);
    };
  };

  const AddResult = async e => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(AddResult_Form.current));
      const result = (await axios.post(
        `${API_DOMAIN}/exams/AddResult`,
        data, { withCredentials: true }
      )).data;
      if (result.err) throw new Error(result.err);
      if (result.response) alert("Added Result Successfully");
    } catch (error) {
      alert(error.message);
    };
  };

  const DeleteResult = async () => {
    try {
      const result = (await axios.post(`${API_DOMAIN}/exams/DeleteResult`, Result, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) setResult('');
    } catch (error) {
      alert(error.message);
    };
  }

  if (IsAuth) {
    return (
      <div id='container'>
        <Layout />
        <div id='ExamsManagement-content'>
          <h1>
            <AiOutlineMenu className='ShowMenu' onClick={ShowMenu} />
            { AdminUsername }
          </h1>
          <div id='ExamsInfo'>
            <h2>Exams Information</h2>
            <div>
              <form ref={ExamsInfoForm}>
                <div>
                  <input type='text' name='StudentsUsername' placeholder='Student Username'/>
                </div>
                <div>
                  <select name='Session' ref={SelectSession}>
                    <option value=''>Choose Session</option>
                    <option value='1'>Session 1</option>
                    <option value='2'>Session 2</option>
                  </select>
                </div>
                <SchoolYearSelect data={SchoolYears} Refe={SelectSchoolYear}/>
                <div>
                  <button onClick={GetStudentExams}>Get All Student Exams</button>
                </div>
              </form>
              <div>
                {
                  Exams.length ?
                    <ExamsData data={Exams} target={TargetStudent}/> :
                    ExamsComponent.result('No exams yet ...')
                }
              </div>
            </div>
          </div>
          <div id='ResultsInfo'>
            <h2>Results Information</h2>
            <div>
              <form ref={ResultsInfoForm}>
                <div>
                  <input type='text' name='StudentsUsername' placeholder='Student Username'/>
                </div>
                <div>
                  <select name='Session'>
                    <option value="">Choose Session</option>
                    <option value='1'>Session 1</option>
                    <option value='2'>Session 2</option>
                  </select>
                </div>
                <SchoolYearSelect data={SchoolYears}/>
                <div>
                  <button onClick={GetStudentResult}>Get Student Result</button>
                </div>
              </form>
              <div>
                {
                  Result ?
                    <div id='DeleteNoteContainer'>
                      <p id='note'>{ Result.Note }</p>
                      <div id='DeleteNote' className='toCenter' onClick={DeleteResult}>
                        <p>Delete</p>
                        <AiFillDelete />
                      </div>
                    </div> :
                    ResultsComponent.result('No Result yet ...')
                }
              </div>
            </div>
          </div>
          <div id='AddExam'>
            <h2>Add Exam</h2>
            <form ref={AddExamForm}>
              <div>
                <input type='text' name='StudentsUsername' placeholder='Student Username' />
              </div>
              <div>
                <input type='text' name='ModuleName' placeholder='Module Name' />
              </div>
              <div>
                <input type='number' name='Note' placeholder='Note' />
              </div>
              <div>
                <input type='date' name='ExamDate' placeholder='Exam Date' />
              </div>
              <div>
                <select name='Session' ref={Add_Session}>
                  <option value=''>Choose Session</option>
                  <option value='1'>Session 1</option>
                  <option value='2'>Session 2</option>
                </select>
              </div>
              <SchoolYearSelect data={SchoolYears} Refe={Add_SchoolYear}/>
              <div>
                <input type='number' name='Arranging' placeholder='Arranging of exam'/>
              </div>
              <div>
                <button onClick={AddExam}>Add Exam</button>
              </div>
            </form>
          </div>
          <div id='CalcRedults'>
            <h2>Add Result</h2>
            <form ref={AddResult_Form}>
              <div>
                <input type='text' name='StudentsUsername' placeholder='Student Username' />
              </div>
              <div>
                <input type='number' name='Note' placeholder='Stuent Note' />
              </div>
              <div>
                <select name='Session'>
                  <option value=''>Choose Session</option>
                  <option value='1'>Session 1</option>
                  <option value='2'>Session 2</option>
                </select>
              </div>
              <SchoolYearSelect data={SchoolYears}/>
              <div>
                <button onClick={AddResult}>Add Result</button>
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
};