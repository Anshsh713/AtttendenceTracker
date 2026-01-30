import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./UpdateAttendenceform.css";

export default function UpdateAttendenceform({ updateClass, onstop }) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    setSaving(true);
    onstop(true);
    e.preventDefault();
    if (!status) return alert("Please select a status!");
    const success = await updateClass({ Status: status });
    setSaving(false);
    onstop(false);
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
            value="Canceled"
            checked={status === "Canceled"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Canceled
        </label>
      </div>

      <Button type="submit" title={saving ? "Updating" : "Update"} />
    </form>
  );
}
