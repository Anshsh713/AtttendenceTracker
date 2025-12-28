import React, { useEffect, useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input.jsx";
import authService from "../Appwrite/AuthService.js";
import scheduleService from "../Appwrite/ScheduleService.js";
import "./Attendenceform.css";

export default function Attendencefrom({ onSubjectAdded }) {
  const [subjectName, SetsubjectName] = useState("");
  const [classesPerWeek, setclassesPerWeek] = useState(1);
  const [schedule, setschedule] = useState([{ Day: "", Time: "" }]);
  const [saving, setsaving] = useState(false);
  const [message, setmessage] = useState("");

  useEffect(() => {
    const newSchedule = Array.from({ length: classesPerWeek }, (_, i) => {
      return schedule[i] || { Day: "", Time: "" };
    });
    setschedule(newSchedule);
  }, [classesPerWeek]);

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

      await scheduleService.AddSubject(userid, subjectName, classesSchedule);
      setmessage("Subject saved successfully");
      SetsubjectName("");
      setclassesPerWeek(1);
      setschedule([{ Day: "", Time: "" }]);
      if (onSubjectAdded) onSubjectAdded();
    } catch (error) {
      console.error(error);
      setmessage("Error in saving the subject");
    }
    setsaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="add-subject-form">
      <h2>Add Subject</h2>

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

      <div className="classesperweek">
        <div className="schedule-list">
          {schedule.map((items, index) => (
            <div key={index} className="schedule-row">
              <select
                value={items.Day}
                onChange={(e) =>
                  handleScheduleChange(index, "Day", e.target.value)
                }
                required
              >
                <option value="">Select Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
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
        </div>
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Subject"}
      </button>

      {message && (
        <p
          className={message.includes("success") ? "success-msg" : "error-msg"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
