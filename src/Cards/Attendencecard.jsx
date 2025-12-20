import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateAttendenceform from "../Forms/UpdateAttendenceform.jsx";
import { useAttendance } from "../Context/AttendenceContext.jsx";

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

  useEffect(() => {
    setEditingKey(null);
    setLastAction("");
    if (Array.isArray(subject) && subject.length > 0) {
      fetchAttendance(subject);
    }
  }, [subject]);

  const handleAttendance = async (status, subj, schedule) => {
    try {
      await markAttendance(status, subj, schedule);
      if (onAttendenceMarked) onAttendenceMarked();
      setLastAction(
        `Marked "${status}" for ${subj.subjectName} on ${schedule.day} at ${schedule.time}`
      );
    } catch (error) {
      setLastAction(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading attendance...</p>;
  if (!Array.isArray(subject) || subject.length === 0)
    return <p>No class scheduled for this day</p>;

  return (
    <div>
      <h2>Your Subjects</h2>

      {subject.map((subj) => (
        <div
          key={subj.subjectId}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{subj.subjectName}</h3>

          <ul>
            {subj.schedules?.map((schedule, index) => {
              const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
              const record = attendanceRecords?.[key] || null;

              return (
                <li key={index}>
                  <strong>{schedule.day}</strong> — {schedule.time}
                  <div style={{ marginTop: "6px" }}>
                    {record ? (
                      <>
                        <span>Your attendance: {record.Status}</span>
                        <Button
                          title="Mistake?"
                          onClick={() =>
                            setEditingKey((prev) => (prev === key ? null : key))
                          }
                        />
                        {editingkey === key && (
                          <UpdateAttendenceform
                            updateClass={async (data) => {
                              const success = await UpdateAttendance(
                                subj,
                                schedule,
                                data
                              );
                              if (success) setEditingKey(null);
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          title="Present"
                          onClick={() =>
                            handleAttendance("Present", subj, schedule)
                          }
                        />
                        <Button
                          title="Absent"
                          onClick={() =>
                            handleAttendance("Absent", subj, schedule)
                          }
                        />
                        <Button
                          title="Canceled"
                          onClick={() =>
                            handleAttendance("Canceled", subj, schedule)
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
      ))}

      {lastAction && <p>Last action: {lastAction}</p>}
    </div>
  );
}
