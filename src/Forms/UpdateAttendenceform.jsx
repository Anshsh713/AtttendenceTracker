import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./UpdateAttendenceform.css";

export default function UpdateAttendenceform({ updateClass }) {
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!status) return alert("Please select a status!");
    const success = await updateClass({ Status: status });
    if (success) setStatus("");
  };

  return (
    <form onSubmit={handleUpdate} className="update-attendance-form">
      <h2>Update Attendance</h2>

      <div className="update-radio-group">
        <label className="update-radio-item">
          <Input
            type="radio"
            name="status"
            value="Present"
            checked={status === "Present"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Present
        </label>

        <label className="update-radio-item">
          <Input
            type="radio"
            name="status"
            value="Absent"
            checked={status === "Absent"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Absent
        </label>

        <label className="update-radio-item">
          <Input
            type="radio"
            name="status"
            value="Canceled"
            checked={status === "Canceled"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Canceled
        </label>
      </div>

      <Button type="submit" title="Update" />
    </form>
  );
}
