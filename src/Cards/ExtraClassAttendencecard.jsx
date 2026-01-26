import React, { useEffect, useState } from "react";
import { useAttendance } from "../Context/AttendenceContext";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateExtraClassAttendenceform from "../Forms/UpdateExtraClassAttendenceform";
import "./ExtraClassAttendencecard.css";

export default function ExtraClasscard({ subject = [] }) {
  const { fetchExtraClass, extraclassesRecords, UpdateExtraClassAttendence } =
    useAttendance();

  const [mistake, setMistake] = useState(null);

  const togglemistake = (key) => {
    setMistake((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    fetchExtraClass();
  }, []);

  const record = Object.values(extraclassesRecords || {});

  if (record.length === 0) return <p>No Extra Classes Added yet</p>;

  return (
    <div className="extra-classes-wrapper">
      <h2>Extra Classes</h2>

      {record.map((rec, index) => (
        <React.Fragment key={index}>
          <div className="extra-class-card">
            <p>
              <strong>{rec.SubjectName}</strong> — {rec.ClassDay} @{" "}
              {rec.ClassTime}
            </p>

            <p>
              Status:{" "}
              <span
                className={`extra-status ${rec.Status === "Present"
                    ? "present"
                    : rec.Status === "Absent"
                      ? "absent"
                      : "canceled"
                  }`}
              >
                {rec.Status}
              </span>
            </p>

            <p>Date: {rec.ClassDate}</p>

            <div className="mistake-row">
              <Button title="Mistake" onClick={() => togglemistake(index)} />
            </div>
          </div>

          {mistake === index && (
            <div className="modal-overlay" onClick={() => setMistake(null)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close"
                  onClick={() => setMistake(null)}
                >
                  Close ✖
                </button>

                <UpdateExtraClassAttendenceform
                  UpdateExtraCLASS={async (data) => {
                    const success = await UpdateExtraClassAttendence(rec, data);
                    if (success) setMistake(null);
                  }}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
