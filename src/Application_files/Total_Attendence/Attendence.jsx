import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import ExtraClassform from "../../Forms/ExtraClassform.jsx";
import { useAttendance } from "../../Context/AttendenceContext.jsx";
import { useUser } from "../../Context/UserContext.jsx";

export default function Total_Attendence({ subject, refresh_Trigger }) {
  const { TotalAttendance, totalAttendance, handleExtraClass } =
    useAttendance();
  const { profile } = useUser();

  const [extraclass, setExtraClass] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const ExtraClassSubmit = async (formData) => {
    const success = await handleExtraClass(formData);
    if (success) {
      setRefresh((prev) => !prev);
      setExtraClass(false);
    }
  };

  const ExtraClass = () => setExtraClass((prev) => !prev);

  useEffect(() => {
    if (subject?.$id) TotalAttendance(subject.$id);
  }, [refresh_Trigger, subject, refresh]);

  if (!subject?.$id) return <p>No subject found.</p>;

  const stats = totalAttendance[subject.$id] || {};

  const {
    totalClasses = 0,
    totalPresent = 0,
    totalAbsent = 0,
    attendancePercentage = 0,
  } = stats;

  const target = profile?.attendence ?? 75;
  const formatted = Number(attendancePercentage).toFixed(2);

  // ---- Classes counted towards attendance ----
  const effective = totalPresent + totalAbsent;

  // ---- Calculate classes needed ----
  let classesNeeded = 0;

  if (effective === 0 && target > 0) {
    classesNeeded = 1;
  } else {
    const t = target / 100;

    const required =
      (t * (totalPresent + totalAbsent) - totalPresent) / (1 - t);

    classesNeeded = Math.max(0, Math.ceil(required));
  }

  const isSafe = Number(attendancePercentage) >= target;

  return (
    <div>
      <h2>Total Attendance for: {subject.SubjectName}</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <p>
          <strong>Total Classes:</strong> {totalClasses}
        </p>
        <p>
          <strong>Present:</strong> {totalPresent}
        </p>
        <p>
          <strong>Absent:</strong> {totalAbsent}
        </p>
        <p>
          <strong>Attendance %:</strong> {formatted}%
        </p>
        <p>
          <strong>Target %:</strong> {target}%
        </p>

        <p style={{ marginTop: "10px" }}>
          <strong>
            {isSafe
              ? "✅ You can safely skip the next class."
              : `⚠️ You need to attend ${classesNeeded} more class(es) to reach ${target}%.`}
          </strong>
        </p>
      </div>

      <Button title="+ Extra Class" onClick={ExtraClass} />

      {extraclass && (
        <div>
          <ExtraClassform
            subjectID={subject.$id}
            subjectName={subject.SubjectName}
            onextraClass={ExtraClassSubmit}
          />
          <Button title="Cancel" onClick={ExtraClass} />
        </div>
      )}
    </div>
  );
}
