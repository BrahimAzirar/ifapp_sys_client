import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import AdminLogin from './Auth/AdminAuth/AdminLogin';
import EmailVerification from './Auth/AdminAuth/EmailVerification';
import StudentManagment from './Admin/StudentsManagement/StudentManagment';
import GroupsManagement from './Admin/GroupsManagement/GroupsManagement';
import SpecialitiesManagement from './Admin/SpecialitiesManagement/SpecialitiesManagement';
import PaymentManagment from './Admin/PaymentManagement/PaymentManagment';
import AbsencesManagement from './Admin/AbsencesManagement/AbsencesManagement';
import ExamsManagement from './Admin/ExamsManagement/ExamsManagement';
import Home from './Student/Home';
import StudentInfo from './Student/StudentInfo';
import Absences from './Student/StudentAbsences/Absences';
import StudentExams from './Student/StudentExams/StudentExams';
import NotFoundPage from './404';

export default function App() {

  const TargetLink = useRef();

  window.addEventListener('load', () => {
    if (window.location.pathname == "/admin/auth/login") {
      TargetLink.current.click();
    }
  })

  return (
    <Router>
      <Link to="/admin/auth/login" ref={TargetLink}></Link>
      <Routes>
        <Route path='/admin/auth/login' element={<AdminLogin />} />
        <Route path='/admin/auth/Emailverfication' element={<EmailVerification />} />
        <Route path='/admin/account/StudentsManagement/:username' element={<StudentManagment />} />
        <Route path='/admin/account/GroupsManagement/:username' element={<GroupsManagement />} />
        <Route path='/admin/account/SpecialitiesManagement/:username' element={<SpecialitiesManagement />} />
        <Route path='/admin/account/PaymentManagement/:username' element={<PaymentManagment />} />
        <Route path='/admin/account/AbsencesManagement/:username' element={<AbsencesManagement />} />
        <Route path='/admin/account/ExamsManagement/:username' element={<ExamsManagement />} />
        <Route path='/' element={<Home />} />
        <Route path='/student/account/:username' element={<StudentInfo />} />
        <Route path='/student/account/absences/:username' element={<Absences />} />
        <Route path='/student/account/exams/:username' element={<StudentExams />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}