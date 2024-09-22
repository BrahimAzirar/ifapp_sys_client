import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate hook allow us to redirect to target route and sending some data to target route
import AuthAlert from './AuthAlert';
import './AdminLogin.css';
import '../../App.css';

export default function AdminLogin() {
    const [Err, setError] = useState({ err: false }); // this state controlling the error alert
    const Target = useRef();
    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    useEffect(() => {
        document.title = "IFAPP | Admin Login";

        // this function for check an admin is auth to entering to admin page
        const AdminIsAuthenticated = async () => {
            const result = (await axios.get(`${API_DOMAIN}/auth/AdminIsAuthenticated`, { withCredentials: true })).data;
            if (result.response) redirect(`${result.nextPage}${result.admin}`);
        };

        AdminIsAuthenticated();
    }, []);

    // This function for login admin to admin page
    const AdminIsExist = async (e) => {
        e.preventDefault();

        const InputEmpty = (obj) => {
            const IsNotEmpty = Object.values(obj).some(ele => ele === '');
            return IsNotEmpty;
        };

        try {
            const data = Object.fromEntries(new FormData(Target.current));
            if (InputEmpty(data)) throw new Error("Some fields is empty");
            const result = (await axios.post(`${API_DOMAIN}/auth/adminIsExist`, data)).data;
            if (result.err) throw new Error(result.err);
            if (result.response) redirect('/admin/auth/Emailverfication');
            else throw new Error("The username or password incorrect");
        } catch (error) {
            setError({ err: true, mess: error.message });
            setTimeout(() => {
                setError({ err: false });
            }, 5000);
        };
    }

  return (
    <div id='AdminLogin' className='toCenter'>
        { Err.err && <AuthAlert message={Err.mess} /> }
        <form ref={Target}>
            <div>
                <img src="/Images/logo.svg" />
            </div>
            <div>
                <input type="text" name="username" placeholder="Username"/>
            </div>
            <div>
                <input type="password" name="password" placeholder="Password"/>
            </div>
            <div>
                <button type="submit" onClick={AdminIsExist}>Log in</button>
            </div>
        </form>
    </div>
  )
}
