import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AbsencesData({ data }) {
  const [TotalAbsences, setTotalAbsences] = useState(0);
  const [ParentNumbers, setParentNumbers] = useState({});
  const [AbsenceDate, setAbsenceDate] = useState('');
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  useEffect(() => {
    const GetParantPhoneNumbers = async () => {
      try {
        const result = (await axios.get(
          `${API_DOMAIN}/students/ParentData/${data[0].StudentUsername}`,
          { withCredentials: true }
        )).data;

        if (result.err) throw new Error(result.err);
        setParentNumbers({ F_Tel: result.response[0].F_Tel, M_Tel: result.response[0].M_Tel });
      } catch (error) {
        alert(error.message);
      };
    };

    GetParantPhoneNumbers();
  }, []);

  useEffect(() => {
    if (data[0].AbsenceHourEnd && data[0].AbsenceHourStart) 
      setTotalAbsences(data.length);
    else setTotalAbsences(0);
  }, [data]);

  const applyTheStudentAbsences = () => {
    const year = new Date(data[0].AbsenceDate).getFullYear();
    const month = new Date(data[0].AbsenceDate).getMonth() + 1;
    const DaysCountOfMonth = new Date(year, month, 0).getDate();
    const { StudentUsername, schoolYear } = data[0];
    const tableRows = [];
  
    const timeSlots = [
      { start: 9, end: 10 },
      { start: 10, end: 11 },
      { start: 11, end: 12 },
      { start: 12, end: 13 },
      { start: 15, end: 16 },
      { start: 16, end: 17 },
      { start: 17, end: 18 },
      { start: 18, end: 19 },
    ];
  
    for (let i = 1; i <= DaysCountOfMonth; i++) {
      const absences = data.filter(ele => i === new Date(ele.AbsenceDate).getDate());
      const row = (
        <tr key={i}>
          <td>{i}</td>
          {timeSlots.map(({ start, end }) => {
            return (
              <td
                key={`${i}-${start}-${end}`}
                onClick={(e) => AddORDelete(
                  e,
                  StudentUsername, 
                  `${year}-${month}-${i}`,
                  start,
                  end,
                  schoolYear
                )}
                className={absences.some(({ AbsenceHourStart, AbsenceHourEnd }) =>
                  InOfRange(start, end, AbsenceHourStart, AbsenceHourEnd)
                ) ? 'absence' : ''}
              ></td>
            );
          })}
        </tr>
      );
      tableRows.push(row);
    }
  
    return tableRows;
  };
  

  const InOfRange = (from, to, start, end) => {
    return from >= start && to <= end;
  };

  const DeleteAbsence = async (e, StudentUsername, Date, HourStart, HourEnd, SchoolYear) => {
    try {
      const data = { StudentUsername, Date, HourStart, HourEnd, SchoolYear };
      const result = (await axios.post(`${API_DOMAIN}/absences/DeleteAbsence`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        e.target.className = '';
        setTotalAbsences(prev => prev - 1);
      };
    } catch (error) {
      alert(error.message);
    };
  };

  const AddAbsence = async (e, StudentUsername, Date, HourStart, HourEnd, SchoolYear) => {
    try {
      setAbsenceDate(Date);
      const data = {StudentUsername, Date, HourStart, HourEnd, SchoolYear};
      const result = (await axios.post(`${API_DOMAIN}/absences/AddAbsence`, data, { withCredentials: true })).data;
      if (result.err) throw new Error(result.err);
      if (result.response) {
        e.target.className = 'absence';
        setTotalAbsences(prev => prev + 1);
      };
    } catch (error) {
      alert(error.message);
    };
  };

  const SendWhatsappMessage = async (username, start, end) => {
    const FullName = username.replace('.', ' ');
    const HERDERS = {
      "Authorization": 'Bearer EAACRBBdTbG0BO8FbBARHtx3UYIvzXhCzTYqAdFZC12r6yo9AFVgAk6pXxPeY3HjxhUQkj85dqFH2jKQ1FJBHDpce9mZBIZBZCRKiXFoz759XQGzkCDpoxvdSHBinZBPD6Ckm1kvsNVjbXYyEE2e7Ar5fJDz2zpRoV5a8OZA7eMKNeVNwEucAccZBJZASgMOqREZATFgBnbGwRUxyQ8WxeAsUZD',
      "Content-Type": "application/json"
    };

    const Yeild_Req_Body = (
      targetNum, 
      TemplateName, 
      FullName, 
      start = null, 
      end = null,
      date = null
      ) => {
      return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": targetNum,
        "type": "template",
        "template": {
          "name": TemplateName,
          "language": {
            "code": "fr"
          },
          "components": [
            {
              "type": "body",
              "parameters": [
                {
                  "type": "text",
                  "text": FullName
                },
                start ? {
                  "type": "text",
                  "text": start
                } : null,
                end ? {
                  "type": "text",
                  "text": end
                } : null,
                date ? {
                  "type": "text",
                  "text": date
                } : null
              ]
            }
          ]
        }
      };
    }
    
    if (TotalAbsences + 1 == 20) {
      if (ParentNumbers.F_Tel && ParentNumbers.M_Tel) {
        for (let item of Object.values(ParentNumbers)) {
          await axios.post(
            'https://graph.facebook.com/v17.0/154017437789402/messages',
            Yeild_Req_Body(item, 'fire', FullName),
            { headers: HERDERS }
          );
        }
      } else if (ParentNumbers.F_Tel) {
        await axios.post(
          'https://graph.facebook.com/v17.0/154017437789402/messages',
          Yeild_Req_Body(ParentNumbers.F_Tel, 'fire', FullName),
          { headers: HERDERS }
        );
      } else {
        await axios.post(
          'https://graph.facebook.com/v17.0/154017437789402/messages',
          Yeild_Req_Body(ParentNumbers.M_Tel, 'fire', FullName),
          { headers: HERDERS }
        );
      }
    } else {
      if (ParentNumbers.F_Tel && ParentNumbers.M_Tel) {
        for (let item of Object.values(ParentNumbers)) {
          await axios.post(
            'https://graph.facebook.com/v17.0/154017437789402/messages',
            Yeild_Req_Body(item, 'absence', FullName, start, end, AbsenceDate),
            { headers: HERDERS }
          );
        }
      } else if (ParentNumbers.F_Tel) {
        await axios.post(
          'https://graph.facebook.com/v17.0/154017437789402/messages',
          Yeild_Req_Body(ParentNumbers.F_Tel, 'absence', FullName, start, end, AbsenceDate),
          { headers: HERDERS }
        );
      } else {
        await axios.post(
          'https://graph.facebook.com/v17.0/154017437789402/messages',
          Yeild_Req_Body(ParentNumbers.M_Tel, 'absence', FullName, start, end, AbsenceDate),
          { headers: HERDERS }
        );
      }
    }
  }

  const AddORDelete = async (e, StudentUsername, Date, HourStart, HourEnd, SchoolYear) => {
    if (e.target.className === 'absence')
      DeleteAbsence(e, StudentUsername, Date, HourStart, HourEnd, SchoolYear);
    else {
      AddAbsence(e, StudentUsername, Date, HourStart, HourEnd, SchoolYear);
      // await SendWhatsappMessage(StudentUsername, HourStart, HourEnd);
    }
  };

  return (
    <>
      <div id='TargetAbsences'>
        <p>{ TotalAbsences }</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Days</th>
            <th>9 - 10</th>
            <th>10 - 11</th>
            <th>11 - 12</th>
            <th>12 - 13</th>
            <th>15 - 16</th>
            <th>16 - 17</th>
            <th>17 - 18</th>
            <th>18 - 19</th>
          </tr>
        </thead>
        <tbody>{applyTheStudentAbsences()}</tbody>
      </table>
    </>
  );
};


export default React.memo(AbsencesData);