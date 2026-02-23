import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import "./UpdateExtraClassAttendenceform.css";

export default function UpdateExtraClassAttendenceform({
  UpdateExtraCLASS,
  onstop,
}) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!status) {
      alert("Please select a status");
      return;
    }

    setSaving(true);
    onstop(true);

    const success = await UpdateExtraCLASS({ Status: status });

    setSaving(false);
    onstop(false);

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
            disabled={saving}
            value="Present"
            checked={status === "Present"}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          Present
        </label>

        <label className="extra-radio-item">
          <Input
            type="radio"
            name="status"
            value="Absent"
            disabled={saving}
            checked={status === "Absent"}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          Absent
        </label>

        <label className="extra-radio-item">
          <Input
            type="radio"
            name="status"
            value="Canceled"
            disabled={saving}
            checked={status === "Canceled"}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
          Canceled
        </label>
      </div>

      <Button
        type="submit"
        title={saving ? "Updating..." : "Update"}
        disabled={saving}
      />
    </form>
  );
}
