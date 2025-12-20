import React, { useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import Attendencefrom from "../../Forms/Attendenceform.jsx";
import Attendencecard from "../../Cards/Attendencecard.jsx";
import { useSchedule } from "../../Context/ScheduleContext.jsx";
import Total_Attendence from "../Total_Attendence/Attendence.jsx";
import ExtraClasscard from "../../Cards/ExtraClassAttendencecard.jsx";

function Home() {
  const {
    futureClasses,
    pastClasses,
    allSubjects,
    todayClasses,
    refreshSchedule,
  } = useSchedule();

  const [addSubject, setaddSubject] = useState(false);
  const [refresh_Attendence, setRefresh_Attendence] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);

  const handleAttendanceRefresh = () => {
    setRefresh_Attendence((prev) => !prev);
  };

  const toggleshowing = () => {
    setaddSubject(!addSubject);
  };

  const getClassesForDay = () => {
    if (dayOffset === 0) return todayClasses;
    if (dayOffset < 0)
      return pastClasses[Math.abs(dayOffset) - 1]?.classes || [];
    return futureClasses[dayOffset - 1]?.classes || [];
  };

  const getDayLabel = () => {
    const baseDate = new Date();
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + dayOffset);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };

    if (dayOffset === 0) {
      return `Today · ${targetDate.toLocaleDateString("en-US", options)}`;
    }

    return targetDate.toLocaleDateString("en-US", options);
  };

  return (
    <>
      {/* Navigation */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button
          title="⬅ Previous"
          onClick={() => setDayOffset((d) => Math.max(d - 1, -4))}
        />

        <strong>{getDayLabel()}</strong>

        <Button
          title="Next ➡"
          onClick={() => setDayOffset((d) => Math.min(d + 1, 4))}
        />
      </div>

      {/* Attendance */}
      <Attendencecard
        subject={getClassesForDay()}
        onAttendenceMarked={handleAttendanceRefresh}
      />

      <Button title="Add" className="Adding" onClick={toggleshowing} />
      {addSubject && <Attendencefrom onSubjectAdded={refreshSchedule} />}

      <ExtraClasscard />

      {/* Total Attendance */}
      <div>
        {allSubjects.map((subj) => (
          <Total_Attendence
            key={subj.$id}
            subject={subj}
            refresh_Trigger={refresh_Attendence}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
