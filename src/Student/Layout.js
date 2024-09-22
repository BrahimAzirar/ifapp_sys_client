import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GiCancel } from 'react-icons/gi';

export default function Layout() {
    const StudentUsername = useParams().username;
    const redirect = useNavigate();
    const API_DOMAIN = process.env.React_App_API_DOMAIN;

    const LogOut = async () => {
        try {
            const result = (await axios.get(
                `${API_DOMAIN}/students/StudentLogOut`,
                { withCredentials: true }
            )).data;

            if (result.err) throw new Error(result.err);
            if (result.response) redirect('/');
        } catch (error) {
            alert(error.message);
        };
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
                    <Link to={`/student/account/${StudentUsername}`}>
                        My Information
                    </Link>
                </li>
                <li>
                    <Link to={`/student/account/absences/${StudentUsername}`}>
                        My Absences
                    </Link>
                </li>
                <li>
                    <Link to={`/student/account/exams/${StudentUsername}`}>
                        My Notes
                    </Link>
                </li>
                <li onClick={LogOut}><Link>Log out</Link></li>
            </ul>
        </div>
    );
};