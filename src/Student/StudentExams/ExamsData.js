import React, { useState } from "react";

function ExamsData({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Module Name</th>
          <th>Exam 1</th>
          <th>Exam 2</th>
          <th>Exam 3</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ele) => {
          return (
            <tr key={ele.ModuleName}>
              <td>{ele.ModuleName}</td>
              {[1, 2, 3].map((item, idx) => {
                if (item > ele.Exams.length) {
                  return <td key={item}></td>;
                } else {
                  return <td key={item}>{ele.Exams[item - 1]}</td>;
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(ExamsData);
