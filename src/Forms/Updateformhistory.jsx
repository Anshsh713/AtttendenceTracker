import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
import { useAttendance } from "../Context/AttendenceContext";

export default function Updateformhistory({ record, onSuccess }) {
  const { updateAttendance_by_History } = useAttendance();

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      alert("Select status");
      return;
    }

    setSaving(true);

    const success = await updateAttendance_by_History(record, {
      Status: status,
    });

    setSaving(false);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Attendance</h2>

      <div>
        <label>
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

        <label>
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

        <label>
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

      <Button
        type="submit"
        title={saving ? "Updating..." : "Update"}
        disabled={saving}
      />
    </form>
  );
}
