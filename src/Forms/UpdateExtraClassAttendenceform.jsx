import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./UpdateExtraClassAttendenceform.css";

export default function UpdateExtraClassAttendenceform({ UpdateExtraCLASS }) {
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!status) return alert("Please select a status");
    const success = await UpdateExtraCLASS({ Status: status });
    if (success) setStatus("");
  };

  return (
    <form onSubmit={handleUpdate} className="update-extra-form">
      <h2>Update Attendance</h2>

      <div className="extra-radio-group">
        <label className="extra-radio-item">
          <Input
            type="radio"
            name="status"
            value="Present"
            checked={status === "Present"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Present
        </label>

        <label className="extra-radio-item">
          <Input
            type="radio"
            name="status"
            value="Absent"
            checked={status === "Absent"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Absent
        </label>

        <label className="extra-radio-item">
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
