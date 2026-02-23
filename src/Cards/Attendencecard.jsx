import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateAttendenceform from "../Forms/UpdateAttendenceform.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";
import "./Attendencecard.css";

export default function Attendencecard({ subject = [], onAttendenceMarked }) {
  const {
    attendanceRecords,
    fetchAttendance,
    markAttendance,
    loading,
    UpdateAttendance,
  } = useAttendance();

  const [lastAction, setLastAction] = useState("");
  const [editingkey, setEditingKey] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [activeStatus, setActiveStatus] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setEditingKey(null);
    setLastAction("");
    if (Array.isArray(subject) && subject.length > 0) {
      fetchAttendance(subject);
    }
  }, [subject]);

  const handleAttendance = async (status, subj, schedule, key) => {
    try {
      setActiveKey(key);
      setActiveStatus(status);
      await markAttendance(status, subj, schedule);
      if (onAttendenceMarked) onAttendenceMarked();
      setLastAction(
        `Marked "${status}" for ${subj.subjectName} on ${schedule.day} at ${schedule.time}`,
      );
    } catch (error) {
      setLastAction(`Error: ${error.message}`);
    } finally {
      setActiveKey(null);
      setActiveStatus("");
    }
  };

  const AttendingStatus = (status, key) => {
    if (activeKey !== key) return status;

    return activeStatus === status ? `${status} Today...` : status;
  };

  if (loading)
    return (
      <div className="notfound">
        <p className="empty-text">Finding Subjects...</p>
      </div>
    );
  if (!Array.isArray(subject) || subject.length === 0)
    return (
      <div className="subjectNot">
        <p className="empty-message">No class scheduled for this day</p>
      </div>
    );

  return (
    <div>
      {subject.map((subj) => (
        <React.Fragment key={subj.subjectId}>
          <div className="attendance-card">
            <h3>{subj.subjectName}</h3>

            <ul className="class-list">
              {subj.schedules?.map((schedule, index) => {
                const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
                const record = attendanceRecords?.[key] || null;

                return (
                  <li key={index} className="class-item">
                    <p>
                      <strong>{schedule.day}</strong> — {schedule.time}
                    </p>
                    <div className="button-group">
                      {record ? (
                        <>
                          <span className="status-label">
                            Your attendance: {record.Status}
                          </span>

                          <Button
                            title="Mistake?"
                            onClick={() =>
                              setEditingKey((prev) =>
                                prev === key ? null : key,
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            title={AttendingStatus("Present", key)}
                            disabled={activeKey === key}
                            onClick={() =>
                              handleAttendance("Present", subj, schedule, key)
                            }
                          />

                          <Button
                            title={AttendingStatus("Absent", key)}
                            disabled={activeKey === key}
                            onClick={() =>
                              handleAttendance("Absent", subj, schedule, key)
                            }
                          />

                          <Button
                            title={AttendingStatus("Canceled", key)}
                            disabled={activeKey === key}
                            onClick={() =>
                              handleAttendance("Canceled", subj, schedule, key)
                            }
                          />
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {subj.schedules?.map((schedule) => {
            const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
            if (editingkey !== key) return null;

            return (
              <div
                key={key}
                className="modal-overlay"
                onClick={() => {
                  if (!formLoading) setEditingKey(null);
                }}
              >
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="modal-close"
                    disabled={formLoading}
                    onClick={() => setEditingKey(null)}
                  >
                    ✖
                  </button>

                  <UpdateAttendenceform
                    updateClass={async (data) => {
                      const success = await UpdateAttendance(
                        subj,
                        schedule,
                        data,
                      );
                      if (success) setEditingKey(null);
                    }}
                    onstop={setFormLoading}
                  />
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
