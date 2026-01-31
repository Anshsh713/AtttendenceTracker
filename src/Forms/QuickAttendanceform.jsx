import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import { useAttendance } from "../Context/AttendenceContext";

export default function QuickAttendanceForm({ subject, onClose }) {
  const { QuickAttendance } = useAttendance();

  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);

  const [entries, setEntries] = useState([
    { date: "", time: "", status: "Present" },
  ]);

  const today = new Date().toISOString().split("T")[0];

  const getDayFromDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const handleCountChange = (value) => {
    const newArr = Array.from(
      { length: value },
      (_, i) => entries[i] || { date: "", time: "", status: "Present" },
    );
    setCount(value);
    setEntries(newArr);
  };

  const handleChange = (i, field, value) => {
    const copy = [...entries];
    copy[i][field] = value;
    setEntries(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let item of entries) {
      if (item.date >= today) {
        return;
      }
    }

    setSaving(true);

    for (let item of entries) {
      const dayName = getDayFromDate(item.date);

      await QuickAttendance(
        item.status,
        {
          subjectId: subject.$id,
          subjectName: subject.SubjectName,
        },
        {
          day: dayName,
          time: item.time,
          date: item.date,
        },
      );
    }

    setSaving(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="add-subject-form">
      <h2>Quick Attendance</h2>

      <p>
        <strong>{subject.SubjectName}</strong>
      </p>

      <Input
        label="Number of Classes"
        type="number"
        min="1"
        value={count}
        onChange={(e) => handleCountChange(Number(e.target.value))}
      />

      {entries.map((item, index) => (
        <div key={index} className="schedule-row">
          <Input
            type="date"
            value={item.date}
            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
            onChange={(e) => handleChange(index, "date", e.target.value)}
            required
          />

          <Input
            type="time"
            value={item.time}
            onChange={(e) => handleChange(index, "time", e.target.value)}
            required
          />

          <select
            value={item.status}
            onChange={(e) => handleChange(index, "status", e.target.value)}
          >
            <option>Present</option>
            <option>Absent</option>
            <option>Canceled</option>
          </select>
        </div>
      ))}

      <Button
        type="submit"
        title={saving ? "Saving..." : "Mark Attendance"}
        disabled={saving}
      />
    </form>
  );
}
