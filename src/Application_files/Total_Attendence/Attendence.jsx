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
  const [onloadingform, setOnloadingform] = useState(false);

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

  const stats = totalAttendance[subject.$id] || {};
  const {
    totalPresent = 0,
    totalAbsent = 0,
    totalCanceled = 0,
    attendancePercentage = 0,
  } = stats;

  const target = profile?.attendence ?? 75;
  const formatted = Number(attendancePercentage).toFixed(2);

  const COLORS = ["#4CAF50", "#F44336", "#FFFFFF"];

  const data = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];

  const effective = totalPresent + totalAbsent + totalCanceled;
  const t = target / 100;
  const required = (t * effective - totalPresent) / (1 - t);
  const classesNeeded =
    effective === 0 && target > 0 ? 1 : Math.max(0, Math.ceil(required));

  const isSafe = Number(attendancePercentage) >= target;

  const getAttendanceMessage = (percent) => {
    if (percent < target) {
      return {
        text: ` You need to attend ${classesNeeded} more class(es) to reach ${target}%.`,
        type: "warn",
      };
    }

    if (percent >= 75 && percent < 80) {
      return {
        text: " You can't skip classes. Keep attending regularly.",
        type: "warn",
      };
    }

    if (percent >= 80 && percent < 90) {
      return {
        text: " You can skip occasionally, but be careful.",
        type: "mid",
      };
    }

    if (percent >= 90) {
      return {
        text: " You are safe to skip classes 👍",
        type: "safe",
      };
    }

    return { text: "", type: "" };
  };

  const statusMessage = getAttendanceMessage(Number(attendancePercentage));

  return (
    <div className="total-attendance-container">
      <div className="attendance-total-card">
        <div className="attendance-header">
          <h2>{subject.SubjectName}</h2>

          <Button title="+ Extra Class" onClick={toggleExtraClass} />
        </div>
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

        <div className="attendance-colored-stats">
          <span className="present-box">{totalPresent}</span>
          <span className="absent-box">{totalAbsent}</span>
          <span className="cancel-box">{totalCanceled}</span>
        </div>

        <div className="attendance-stats">
          <p>
            <strong>Target %:</strong> {target}%
          </p>

          <p className={`attendance-status ${statusMessage.type}`}>
            {statusMessage.text}
          </p>
        </div>
      </div>
      {extraclass && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!onloadingform) {
              setOnloadingform(false);
              toggleExtraClass();
            }
          }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              disabled={onloadingform}
              onClick={() => {
                setOnloadingform(false);
                toggleExtraClass();
              }}
            >
              ✖
            </button>

            <ExtraClassform
              subjectID={subject.$id}
              subjectName={subject.SubjectName}
              onextraClass={ExtraClassSubmit}
              onstop={setOnloadingform}
            />
          </div>
        </div>
      )}
    </div>
  );
}
