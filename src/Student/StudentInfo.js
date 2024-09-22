import React, { useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../Redux/Actions';
import { useParams, useNavigate } from 'react-router-dom';
import { GetSchoolYear } from '../ForAll';
import './Student.css';
import '../App.css';
import { AiOutlineMenu } from 'react-icons/ai';

export default function StudentInfo() {
    const StudentData = useSelector(state => state.StudentReducer.StudentData);
    const StudentAuth = useSelector(state => state.AuthReducer.StudentAuth);
    const SchoolYears = useSelector(state => state.Absences_Payments_Reducer.allSchoolYears);
    const dispatch = useDispatch();
    const StudentUsername = useParams().username;
    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    useEffect(() => {
        document.title = "IFAPP | Student Page";

        const IsAuthencated = async () => {
            try {
                const result = (await axios.get(`
                    ${API_DOMAIN}/students/studentIsAuth`,
                    { withCredentials: true }
                )).data;

                if (!result.response || StudentUsername !== result.data.StudentUsername)
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

    const ShowMenu = () =>{
        const ele = document.getElementById('layout');
        ele.style.left = '0%';
    };

    return (
        <div id='container'>
            <Layout />
            <div id='StudentInfo-content'>
                <AiOutlineMenu className='ShowMenu' onMouseDown={ShowMenu} />
                <div>
                    <div id='profile'><img src={StudentData.Photo} /></div>
                    <p>{ StudentData.StudentUsername }</p>
                </div>
                <div>
                    <input type='text' value={StudentData.FirstName} readOnly/>
                    <input type='text' value={StudentData.LastName} readOnly/>
                    <input type='text' value={StudentData.S_CIN} readOnly/>
                    <input type='text' value={StudentData.Tel} readOnly/>
                    <input type='text' value={StudentData.SpecialityName} readOnly/>
                    <input type='text' value={StudentData.GroupName} readOnly/>
                </div>
            </div>
        </div>
    );
};