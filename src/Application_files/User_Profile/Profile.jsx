import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useSchedule } from "../../Context/ScheduleContext";
import { useDeleteUpdate } from "../../Context/Delete_UpdateContext";
import UpdateAttendencefrom from "../../Forms/UpdateSubjectform.jsx";
import UserProfileform from "../../Forms/UserProfileform";
import Button from "../../Common_Componenets/Common_Button/Button";

export default function Profile() {
  const { user, profile, refreshprofile, loading: userLoading } = useUser();
  const {
    allSubjects,
    refreshSchedule,
    loading: scheduleLoading,
  } = useSchedule();
  const { Deleting_the_Subject } = useDeleteUpdate();

  const [showform, setshowform] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const toggleform = () => setshowform(!showform);

  useEffect(() => {
    if (!allSubjects || allSubjects.length === 0) {
      refreshSchedule();
    }
  }, []);

  if (userLoading || scheduleLoading) return <p>Loading Profile...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* -------- PROFILE HEADER -------- */}
      <h1>
        {profile?.name
          ? `${profile.name}'s Profile`
          : `Welcome ${user?.name || "User"}`}
      </h1>

      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      {/* -------- PROFILE CARD -------- */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "15px",
          marginTop: "10px",
          lineHeight: "1.8",
          background: "#fafafa",
        }}
      >
        <p>
          <strong>Name:</strong> {profile?.name || "-"}
        </p>
        <p>
          <strong>Attendance Target:</strong>{" "}
          {(profile?.attendence ?? 75) + "%"}
        </p>
        <p>
          <strong>College:</strong> {profile?.college || "-"}
        </p>
        <p>
          <strong>City:</strong> {profile?.city || "-"}
        </p>
        <p>
          <strong>State:</strong> {profile?.state || "-"}
        </p>
        <p>
          <strong>Country:</strong> {profile?.country || "-"}
        </p>
      </div>

      {/* EDIT BUTTON */}
      <Button title="Edit Profile" onClick={toggleform} />

      {/* EDIT FORM */}
      {showform && (
        <UserProfileform
          onprofileupdate={async () => {
            await refreshprofile();
            setshowform(false);
          }}
        />
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* -------- SUBJECT EDIT MODE -------- */}
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

      {/* -------- SUBJECT LIST MODE -------- */}
      {!editingSubject && (
        <>
          <h2>Subjects</h2>

          {!allSubjects || allSubjects.length === 0 ? (
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
                <h3>{subj.SubjectName}</h3>

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

                <h4>Class Schedule:</h4>
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
