import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useSchedule } from "../../Context/ScheduleContext";
import { useDeleteUpdate } from "../../Context/Delete_UpdateContext";
import UpdateAttendencefrom from "../../Forms/UpdateSubjectform.jsx";
import UserProfileform from "../../Forms/UserProfileform";
import Button from "../../Common_Componenets/Common_Button/Button";

export default function Profile() {
  const { user } = useUser();
  const { allSubjects, refreshSchedule, loading } = useSchedule();
  const { Deleting_the_Subject } = useDeleteUpdate();
  const [showform, setshowform] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const toggleform = () => {
    setshowform(!showform);
  };

  useEffect(() => {
    if (!allSubjects || allSubjects.length === 0) {
      refreshSchedule();
    }
  }, []);

  if (loading) return <p>...Loading Profile</p>;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>{user.email}</p>
      <Button title="edit" onClick={toggleform} />
      {showform && <UserProfileform />}

      <hr style={{ margin: "30px 0" }} />

      {editingSubject && (
        <>
          <UpdateAttendencefrom
            editSubject={editingSubject}
            onSubjectAdded={async () => {
              await refreshSchedule();
              setEditingSubject(null);
            }}
          />

          <Button title="Cancel Edit" onClick={() => setEditingSubject(null)} />
        </>
      )}

      {/* 🔹 SUBJECT LIST MODE */}
      {!editingSubject && (
        <>
          {allSubjects.length === 0 ? (
            <p>No subjects found.</p>
          ) : (
            allSubjects.map((subj) => (
              <div
                key={subj.$id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  margin: "10px 0",
                }}
              >
                <h2>{subj.SubjectName}</h2>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    title="Edit Subject"
                    onClick={() => setEditingSubject(subj)}
                  />
                  <Button
                    title="Delete Subject"
                    onClick={() => Deleting_the_Subject(subj.$id)}
                  />
                </div>

                <h3>Class Schedule:</h3>
                <ul>
                  {subj.ClassesSchedule?.map((item, index) => {
                    const schedule =
                      typeof item === "string" ? JSON.parse(item) : item;
                    return (
                      <li key={index}>
                        <strong>{schedule.day}</strong> — {schedule.time}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
