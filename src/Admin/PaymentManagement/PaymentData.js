import React from "react";
import axios from "axios";

function PaymentData({ data, callback, callback2, TargetSchoolYear }) {
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  const AddPayment = async (StudentUsername, Month) => {
    try {
      const payment = prompt('Enter Student Payment: ');
      const data = { StudentUsername, Month, TargetSchoolYear, payment };
      const result = (
        await axios.post(`${API_DOMAIN}/payments/AddPayment`, data, { withCredentials: true })
      ).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        callback((prev) =>
          prev.map((ele) => {
            if (ele.StudentUsername === StudentUsername) {
              ele.PaymentMonth = { ...ele.PaymentMonth, [Month]: payment };
            }
            return ele;
          })
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const DeletePayment = async (StudentUsername, Month) => {
    try {
      const data = { StudentUsername, Month, TargetSchoolYear };
      const result = (await axios.post(`${API_DOMAIN}/payments/deletePayment/`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        callback((prev) =>
          prev.map((ele) => {
            if (ele.StudentUsername === StudentUsername) {
              delete ele.PaymentMonth[Month];
            };
            return ele;
          })
        );
      };
    } catch (error) {
      alert(error.message);
    };
  }

  const GetStudentPayment = (e, username, month) => {
    if (e.target.classList.contains('payed')) {
      const target = data.find(ele => ele.StudentUsername === username).PaymentMonth[month];
      callback2(target);
    } else callback2(0);
  };

  const AddandDeletePayment = (e, StudentUsername, Month) => {
    if (e.target.classList.contains('payed')) DeletePayment(StudentUsername, Month);
    else AddPayment(StudentUsername, Month);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>September</th>
          <th>October</th>
          <th>November</th>
          <th>December</th>
          <th>January</th>
          <th>February</th>
          <th>March</th>
          <th>April</th>
          <th>May</th>
          <th>June</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          return (
            <tr key={ele.StudentUsername}>
              <td>{ele.StudentUsername}</td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('9') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '9')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 9)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 9)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('10') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '10')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 10)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 10)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('11') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '11')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 11)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 11)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('12') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '12')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 12)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 12)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('1') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '1')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 1)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 1)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('2') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '2')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 2)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 2)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('3') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '3')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 3)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 3)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('4') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '4')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 4)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 4)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('5') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '5')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 5)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 5)}
                onMouseLeave={() => callback2(0)}
              ></td>
              <td
                className={Object.keys(ele.PaymentMonth).includes('6') ? "payed" : null}
                onClick={(e) => AddandDeletePayment(e, ele.StudentUsername, '6')}
                onMouseEnter={e => GetStudentPayment(e, ele.StudentUsername, 6)}
                onTouchStart={e => GetStudentPayment(e, ele.StudentUsername, 6)}
                onMouseLeave={() => callback2(0)}
              ></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


export default React.memo(PaymentData);