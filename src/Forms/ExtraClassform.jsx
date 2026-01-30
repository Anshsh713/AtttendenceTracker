import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./ExtraClassform.css";

export default function ExtraClassform({
  subjectID,
  subjectName,
  onextraClass,
  onstop,
}) {
  const getDaybyDate = (data) => {
    const date = new Date(data);

    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const [Day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    onstop(true);

    const data = {
      subjectID,
      subjectName,
      day: getDaybyDate(date),
      date: date,
      time: Time,
      status: status,
    };

    try {
      const success = await onextraClass(data);

      if (success) {
        setDay("");
        setDate("");
        setTime("");
        setStatus("");
      }
    } finally {
      setSaving(false);
      onstop(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="extra-class-form">
      <h2>Add Extra Class</h2>

      <Input
        label="Class Date : "
        type="date"
        required
        value={date}
        disabled={saving}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        label="Class Time : "
        type="Time"
        required
        value={Time}
        disabled={saving}
        onChange={(e) => setTime(e.target.value)}
      />

      <div className="radio-group">
        <label className="radio-item">
          <Input
            type="radio"
            name="status"
            value="Present"
            disabled={saving}
            checked={status === "Present"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Present
        </label>

        <label className="radio-item">
          <Input
            type="radio"
            name="status"
            disabled={saving}
            value="Absent"
            checked={status === "Absent"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Absent
        </label>
      </div>

      <Button
        type="Submit"
        title={saving ? "Adding..." : "Add"}
        disabled={saving}
      />
    </form>
  );
}
