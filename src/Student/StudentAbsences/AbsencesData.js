import React from 'react';

function AbsencesData({ data }) {
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
                className={`${absences.some(({ AbsenceHourStart, AbsenceHourEnd }) =>
                  InOfRange(start, end, AbsenceHourStart, AbsenceHourEnd)
                ) ? 'absence' : ''} toDefault`}
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

  return (
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
  );
};


export default React.memo(AbsencesData);