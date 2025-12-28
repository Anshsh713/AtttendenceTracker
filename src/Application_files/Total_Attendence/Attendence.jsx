import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import ExtraClassform from "../../Forms/ExtraClassform.jsx";
import { useAttendance } from "../../Context/AttendenceContext.jsx";
import { useUser } from "../../Context/UserContext.jsx";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "./Attendence.css";

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

  const toggleExtraClass = () => setExtraClass((prev) => !prev);

  useEffect(() => {
    if (subject?.$id) TotalAttendance(subject.$id);
  }, [refresh_Trigger, subject, refresh]);

  if (!subject?.$id) return <p>No subject found.</p>;

  const stats = totalAttendance[subject.$id] || {};
  const {
    totalPresent = 0,
    totalAbsent = 0,
    totalCancelled = 0,
    attendancePercentage = 0,
  } = stats;

  const target = profile?.attendence ?? 75;
  const formatted = Number(attendancePercentage).toFixed(2);

  const COLORS = ["#4CAF50", "#F44336", "#FFFFFF"];

  const data = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
    { name: "Cancelled", value: totalCancelled },
  ];

  const effective = totalPresent + totalAbsent + totalCancelled;
  const t = target / 100;
  const required = (t * effective - totalPresent) / (1 - t);
  const classesNeeded =
    effective === 0 && target > 0 ? 1 : Math.max(0, Math.ceil(required));

  const isSafe = Number(attendancePercentage) >= target;

  return (
    <div className="total-attendance-container">
      <div className="attendance-total-card">
        {/* -------- HEADER -------- */}
        <div className="attendance-header">
          <h2>{subject.SubjectName}</h2>

          <Button title="+ Extra Class" onClick={toggleExtraClass} />
        </div>

        {/* -------- DONUT CHART -------- */}
        <div className="donut-wrapper">
          <PieChart width={320} height={260}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                  stroke="#ccc"
                  strokeWidth={entry.name === "Cancelled" ? 1.5 : 0}
                />
              ))}
            </Pie>

            <Tooltip />

            {/* Percentage text in center */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              {formatted}%
            </text>
          </PieChart>
        </div>

        {/* -------- COLOURED NUMBER ROW -------- */}
        <div className="attendance-colored-stats">
          <span className="present-box">{totalPresent}</span>
          <span className="absent-box">{totalAbsent}</span>
          <span className="cancel-box">{totalCancelled}</span>
        </div>

        {/* -------- STATUS -------- */}
        <div className="attendance-stats">
          <p>
            <strong>Target %:</strong> {target}%
          </p>

          <p className={`attendance-status ${isSafe ? "safe" : "warn"}`}>
            {isSafe
              ? "✅ You can safely skip the next class."
              : `⚠️ You need to attend ${classesNeeded} more class(es) to reach ${target}%.`}
          </p>
        </div>

        {/* -------- EXTRA CLASS MODAL -------- */}
        {extraclass && (
          <div className="modal-overlay" onClick={toggleExtraClass}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={toggleExtraClass}>
                Close ✖
              </button>

              <ExtraClassform
                subjectID={subject.$id}
                subjectName={subject.SubjectName}
                onextraClass={ExtraClassSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
