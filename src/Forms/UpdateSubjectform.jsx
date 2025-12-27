import React, { useEffect, useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input.jsx";
import authService from "../Appwrite/AuthService.js";
import scheduleService from "../Appwrite/ScheduleService.js";
import "./UpdateSubjectform.css";

export default function UpdateAttendencefrom({
  onSubjectAdded,
  editSubject = null,
}) {
  const [subjectName, SetsubjectName] = useState("");
  const [classesPerWeek, setclassesPerWeek] = useState(1);
  const [schedule, setschedule] = useState([{ Day: "", Time: "" }]);
  const [saving, setsaving] = useState(false);
  const [message, setmessage] = useState("");

  useEffect(() => {
    if (editSubject) {
      SetsubjectName(editSubject.SubjectName);
      setclassesPerWeek(editSubject.ClassesSchedule.length);

      const parsed = editSubject.ClassesSchedule.map((item) =>
        typeof item === "string" ? JSON.parse(item) : item
      );

      setschedule(
        parsed.map((s) => ({
          Day: s.day,
          Time: s.time,
        }))
      );
    }
  }, [editSubject]);

  useEffect(() => {
    setScheduleSafe(classesPerWeek);
  }, [classesPerWeek]);

  const setScheduleSafe = (count) => {
    setschedule((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] || { Day: "", Time: "" })
    );
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setschedule(newSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsaving(true);
    setmessage("");

    const classesSchedule = schedule.map((item) =>
      JSON.stringify({ day: item.Day, time: item.Time })
    );

    try {
      const userdata = await authService.getCurrentUser();
      const userid = userdata.$id;

      if (editSubject) {
        await scheduleService.updateSubject(
          editSubject.$id,
          userid,
          subjectName,
          classesSchedule
        );
        setmessage("Subject updated successfully");
      } else {
        await scheduleService.AddSubject(userid, subjectName, classesSchedule);
        setmessage("Subject added successfully");
      }

      if (onSubjectAdded) onSubjectAdded();
    } catch (error) {
      console.error(error);
      setmessage("Error saving subject");
    }

    setsaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="update-subject-form">
      <h2>{editSubject ? "Update Subject" : "Add Subject"}</h2>

      <Input
        label="Subject Name : "
        type="text"
        placeholder="Enter the Subject Name"
        value={subjectName}
        onChange={(e) => SetsubjectName(e.target.value)}
        required
      />

      <Input
        label="Classes per week : "
        type="number"
        min="1"
        value={classesPerWeek}
        onChange={(e) => setclassesPerWeek(Number(e.target.value))}
        required
      />

      {schedule.map((items, index) => (
        <div key={index} className="schedule-row">
          <select
            value={items.Day}
            onChange={(e) => handleScheduleChange(index, "Day", e.target.value)}
            required
          >
            <option value="">Select Day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>

          <Input
            label="Time : "
            type="time"
            value={items.Time}
            onChange={(e) =>
              handleScheduleChange(index, "Time", e.target.value)
            }
            required
          />
        </div>
      ))}

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : editSubject ? "Update Subject" : "Save Subject"}
      </button>

      {message && (
        <p
          className={
            message.includes("success") ? "success-text" : "error-text"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
