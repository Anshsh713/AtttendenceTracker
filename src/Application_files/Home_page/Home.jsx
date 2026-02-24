import React, { useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import Attendencefrom from "../../Forms/Attendenceform.jsx";
import Attendencecard from "../../Cards/Attendencecard.jsx";
import { useSchedule } from "../../Context/ScheduleContext.jsx";
import Total_Attendence from "../Total_Attendence/Attendence.jsx";
import ExtraClasscard from "../../Cards/ExtraClassAttendencecard.jsx";
import "./Home.css";

function Home() {
  const { futureClasses, allSubjects, todayClasses, refreshSchedule } =
    useSchedule();

  const [addSubject, setaddSubject] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [refresh_Attendence, setRefresh_Attendence] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);
  const [tab, setTab] = useState("classes");

  const handleAttendanceRefresh = () => {
    setRefresh_Attendence((prev) => !prev);
  };

  const toggleshowing = () => setaddSubject(!addSubject);

  const getClassesForDay = () => {
    if (dayOffset === 0) {
      return todayClasses;
    }

    return futureClasses.length
      ? futureClasses[dayOffset - 1]?.classes || []
      : [];
  };

  const getDayLabel = () => {
    const baseDate = new Date();
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + dayOffset);

    const options = { weekday: "long", day: "numeric", month: "short" };

    if (dayOffset === 0)
      return `Today · ${targetDate.toLocaleDateString("en-US", options)}`;

    return targetDate.toLocaleDateString("en-US", options);
  };

  const getSelectedISODate = () => {
    const baseDate = new Date();
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + dayOffset);

    return targetDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  return (
    <div className="home-container">
      <div className="tab-bar">
        <Button
          title="Classes"
          onClick={() => setTab("classes")}
          className={`tab-btn ${tab === "classes" ? "active" : ""}`}
        />

        <Button
          title="Attendance"
          onClick={() => setTab("attendance")}
          className={`tab-btn ${tab === "attendance" ? "active" : ""}`}
        />
      </div>

      {tab === "classes" && (
        <div className="classes-section">
          <div className="nav-row">
            <Button
              title="⬅"
              onClick={() => setDayOffset((d) => Math.max(d - 1, 0))}
            />
            <strong>{getDayLabel()}</strong>
            <Button
              title="➡"
              onClick={() => setDayOffset((d) => Math.min(d + 1, 2))}
            />
          </div>
          <div className="subjects">
            <h2>Your Subjects</h2>

            <Button title="Add" className="Adding" onClick={toggleshowing} />
          </div>
          <Attendencecard
            subject={getClassesForDay()}
            onAttendenceMarked={handleAttendanceRefresh}
            seeingfutureclass={dayOffset !== 0}
          />

          {addSubject && (
            <div
              className="modal-overlay"
              onClick={() => {
                if (!formLoading) setaddSubject(false);
              }}
            >
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close"
                  disabled={formLoading}
                  onClick={() => setaddSubject(false)}
                >
                  ✖
                </button>

                <Attendencefrom
                  setParentLoading={setFormLoading}
                  onSubjectAdded={() => {
                    refreshSchedule();
                    setaddSubject(false);
                  }}
                />
              </div>
            </div>
          )}

          <ExtraClasscard selectedDate={getSelectedISODate()} />
        </div>
      )}

      {tab === "attendance" && (
        <div className="attendance-section">
          {allSubjects.length === 0 ? (
            <div className="notfound">
              <p className="empty-text">No Subjects Added Yet</p>
            </div>
          ) : (
            allSubjects.map((subj) => (
              <Total_Attendence
                key={subj.$id}
                subject={subj}
                refresh_Trigger={refresh_Attendence}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
