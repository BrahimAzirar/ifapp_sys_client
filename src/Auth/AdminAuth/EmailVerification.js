import React, { useState, useEffect, useRef } from 'react';
import AuthAlert from './AuthAlert';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { VscSend } from 'react-icons/vsc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmailVerification() {

  const [Err, setError] = useState({ err: false });
  const Target = useRef();
  const redirect = useNavigate();
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    document.title = 'IFAPP | Email Verification';

    const sendVerficationCode = async () => {
      try {
        const result = (await axios.get(`${API_DOMAIN}/auth/emailVerification`, { withCredentials: true })).data;
        if (!result.response) window.history.back();
      } catch (error) {
        setError({ err: true, mess: error.message });
        setTimeout(() => {
            setError({ err: false });
        }, 5000);
      };
    };

    const AdminIsAuthenticated = async () => {
      const result = (await axios.get(`${API_DOMAIN}/auth/AdminIsAuthenticated`, { withCredentials: true })).data;
      if (result.response) redirect(`${result.nextPage}${result.admin}`);
      else sendVerficationCode();
    };

    AdminIsAuthenticated();
  }, []);

  const SendCode = async (e) => {
    e.preventDefault();

    try {
      const data = Object.fromEntries(new FormData(Target.current));

      const result = (await axios.post(`${API_DOMAIN}/auth/checkEmailCodeIsExist`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) redirect(result.nextPage);
    } catch (error) {
      setError({ err: true, mess: error.message });
      setTimeout(() => {
          setError({ err: false });
      }, 5000);
    };
  };

  return (
    <div id='EmailVerification' className='toCenter'>
      { Err.err && <AuthAlert message={Err.mess} /> }
      <form ref={Target}>
        <div>
          <HiOutlineMailOpen />
          <p>Check your email box we sended you the verification code !</p>
        </div>
        <div>
          <div>
            <input type='text' name='_Code' placeholder='code' />
          </div>
          <div>
            <button className='toCenter' onClick={SendCode}>
              <p>Send</p>
              <VscSend />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};