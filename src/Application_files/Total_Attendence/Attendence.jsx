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
    totalNot = 0,
    attendancePercentage = 0,
  } = stats;

  const target = profile?.attendence ?? 75;

  // Always compute percentage safely from raw values
  const totalClasses = totalPresent + totalAbsent;

  const safePercentage =
    totalClasses === 0 ? 0 : (totalPresent / totalClasses) * 100;

  const formatted = safePercentage.toFixed(2);

  const COLORS = ["#10b981", "#ef4444", "#f1f5f9"];

  const data = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];

  // Perfect mathematical model
  const calculateNeededClasses = (present, absent, targetPercent) => {
    const total = present + absent;

    if (total === 0) return 1;

    const T = targetPercent / 100;

    const numerator = T * total - present;
    const denominator = 1 - T;

    if (denominator <= 0) return 0;

    const result = numerator / denominator;

    return result <= 0 ? 0 : Math.ceil(result);
  };

  const classesNeeded = calculateNeededClasses(
    totalPresent,
    totalAbsent,
    target,
  );

  // Use safePercentage for logic
  const isSafe = safePercentage >= target;

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

  const statusMessage = getAttendanceMessage(safePercentage);

  return (
    <div className="total-attendance-container">
      <div className="attendance-total-card">
        <div className="attendance-header">
          <h2>{subject.SubjectName}</h2>

          <Button title="+ Extra Class" onClick={toggleExtraClass} />
        </div>
        <div className="donut-wrapper">
          <PieChart width={260} height={230}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                  className="recharts-sector"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "24px",
                fontWeight: "800",
                fill: "var(--primary-900)",
                fontFamily: "inherit",
              }}
            >
              {formatted}%
            </text>
          </PieChart>
        </div>

        <div className="attendance-colored-stats">
          <span className="present-box">{totalPresent}</span>
          <span className="absent-box">{totalAbsent}</span>
          <span className="cancel-box">{totalCanceled}</span>
          <span className="not-box">{totalNot}</span>
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
