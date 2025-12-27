import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useSchedule } from "../../Context/ScheduleContext";
import { useDeleteUpdate } from "../../Context/Delete_UpdateContext";
import UpdateAttendencefrom from "../../Forms/UpdateSubjectform.jsx";
import UserProfileform from "../../Forms/UserProfileform";
import Button from "../../Common_Componenets/Common_Button/Button";
import "./Profile.css";

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

  if (userLoading || scheduleLoading)
    return <p className="loading-text">Loading Profile...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">
        {profile?.name
          ? `${profile.name}'s Profile`
          : `Welcome ${user?.name || "User"}`}
      </h1>

      <p className="profile-email">
        <strong>Email:</strong> {user?.email}
      </p>

      <div className="profile-card">
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

      <Button title="Edit Profile" onClick={toggleform} />

      {showform && (
        <UserProfileform
          onprofileupdate={async () => {
            await refreshprofile();
            setshowform(false);
          }}
        />
      )}

      <hr className="profile-divider" />

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

      {!editingSubject && (
        <>
          <h2>Subjects</h2>

          {!allSubjects || allSubjects.length === 0 ? (
            <p className="empty-text">No subjects found.</p>
          ) : (
            allSubjects.map((subj) => (
              <div key={subj.$id} className="subject-card">
                <h3>{subj.SubjectName}</h3>

                <div className="subject-actions">
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
                <ul className="schedule-list">
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
