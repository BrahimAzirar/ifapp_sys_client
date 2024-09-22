import axios from "axios";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";

function ExamsData({ data, target }) {
  const [TargetNotes, setTargetNotes] = useState([]);
  const API_DOMAIN = process.env.React_App_API_DOMAIN;

  const DeleteExamsNotes = async (Module) => {
    try {
      if (TargetNotes[Module]) {
        if (TargetNotes[Module].length) {
          const data = { ...target, Notes: TargetNotes[Module], Module };
          const result = (await axios.post(
            `${API_DOMAIN}/exams/DeleteExams`,
            data, { withCredentials: true }
          )).data;
  
          if (result.err) throw new Error(result.err);
          if (result.response) window.location.reload();
        } else throw new Error("Select Some Notes");
      } else throw new Error("Select Some Notes");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Module Name</th>
          <th>Exam 1</th>
          <th>Exam 2</th>
          <th>Exam 3</th>
          <th>Modify</th>
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
                  return (
                    <td
                      key={item}
                      className="StudentExamNote"
                      onClick={(e) => {
                        e.target.classList.toggle("SelectedNote");

                        if (e.target.classList.contains("SelectedNote")) {
                          setTargetNotes({
                            ...TargetNotes,
                            [ele.ModuleName]: TargetNotes[ele.ModuleName]
                              ? [
                                  ...TargetNotes[ele.ModuleName],
                                  { [e.target.textContent]: ele.ExamDate[idx] },
                                ]
                              : [{ [e.target.textContent]: ele.ExamDate[idx] }],
                          });
                        } else {
                          setTargetNotes(prev => {
                            const newNotes = (prev[ele.ModuleName] || []).filter((note) => {
                              const noteValue = Object.values(note)[0];
                              return (
                                parseInt(Object.keys(note)[0]) !== e.target.textContent &&
                                noteValue !== ele.ExamDate[idx]
                              );
                            });

                            return {
                              ...prev,
                              [ele.ModuleName]: newNotes,
                            };
                          });
                        }
                      }}
                    >
                      {ele.Exams[item - 1]}
                    </td>
                  );
                }
              })}
              <td className="ModifyColumn">
                <a
                  href="#"
                  className="toCenter"
                  onClick={() => DeleteExamsNotes(ele.ModuleName)}
                >
                  <p>Delete</p>
                  <AiFillDelete />
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(ExamsData);
