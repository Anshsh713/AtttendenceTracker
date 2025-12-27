import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./ExtraClassform.css";

export default function ExtraClassform({
  subjectID,
  subjectName,
  onextraClass,
}) {
  const Today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const [Day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      subjectID,
      subjectName,
      day: Today,
      date: date,
      time: Time,
      status: status,
    };

    const success = await onextraClass(data);
    if (success) {
      setDay("");
      setDate("");
      setTime("");
      setStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="extra-class-form">
      <h2>Add Extra Class</h2>

      <div className="today-row">Day: {Today}</div>

      <Input
        label="Class Date : "
        type="date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        label="Class Time : "
        type="Time"
        required
        value={Time}
        onChange={(e) => setTime(e.target.value)}
      />

      <div className="radio-group">
        <label className="radio-item">
          <Input
            type="radio"
            name="status"
            value="Present"
            checked={status === "Present"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Present
        </label>

        <label className="radio-item">
          <Input
            type="radio"
            name="status"
            value="Absent"
            checked={status === "Absent"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Absent
        </label>
      </div>

      <Button type="submit" title="Submit" />
    </form>
  );
}
