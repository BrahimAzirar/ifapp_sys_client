import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { InputEmpty } from '../../ForAll';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentLogin() {
    const StudentForm = useRef();
    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    const StudentIsExist = async (e) => {
        e.preventDefault();

        try {
            const data = Object.fromEntries(new FormData(StudentForm.current));
            if (InputEmpty(data)) throw new Error('Some fields is empty');
            const result = (await axios.post(
                `${API_DOMAIN}/students/StudentIsExist`,
                data, { withCredentials: true }
            )).data;
            if (result.err) throw new Error(result.err);
            if (result.response) redirect(result.nextPage);
            else throw new Error('The username or password incorrect');
        } catch (error) {
            alert(error.message);
        };
    };

    return (
        <div className='toCenter'>
            <form ref={StudentForm}>
                <div style={{ display: "none" }} id='LogoContainer'> <img src='/Images/logo.svg'/> </div>
                <div>
                    <input type='text' name='StudentUsername' placeholder='Student Username' />
                </div>
                <div>
                    <input type='password' name='Password' placeholder='Student Password' />
                </div>
                <div>
                    <button onClick={StudentIsExist}>Log in</button>
                </div>
            </form>
            <Link to="/admin/auth/login">admin login</Link>
        </div>
    );
};