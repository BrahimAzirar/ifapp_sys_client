import React, { useEffect } from 'react';
import StudentLogin from '../Auth/StudentAuth/StudentLogin';
import './Student.css';
import './StudentRes.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Actions from '../Redux/Actions';

export default function Home() {
    const dispatch = useDispatch();

    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    useEffect(() => {
        document.title = "IFAPP | Login Page";

        const IsAuthencated = async () => {
          try {
              const result = (await axios.get(`
                  ${API_DOMAIN}/students/studentIsAuth`,
                  { withCredentials: true }
              )).data;

              if (result.response) {
                dispatch(Actions.student_is_auth());
                dispatch(Actions.export_student_data(result.data));
                redirect(result.nextPage);
              };
          } catch (error) {
              alert(error.message);
          };
      };

      IsAuthencated();
    }, []);

    return (
        <div id='_container'>
            <StudentLogin />
            <div className='toCenter'>
                <img src='/Images/logo.svg' />
            </div>
        </div>
    );
};