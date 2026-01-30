import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useSchedule } from "../../Context/ScheduleContext";
import { useDeleteUpdate } from "../../Context/Delete_UpdateContext";
import UpdateAttendencefrom from "../../Forms/UpdateSubjectform.jsx";
import UserProfileform from "../../Forms/UserProfileform";
import Button from "../../Common_Componenets/Common_Button/Button";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import authService from "../../Appwrite/AuthService.js";

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    profile,
    refreshprofile,
    loading: userLoading,
  } = useUser();
  const {
    allSubjects,
    refreshSchedule,
    loading: scheduleLoading,
  } = useSchedule();
  const { Deleting_the_Subject } = useDeleteUpdate();
  const [onloadingform, setOnloadingform] = useState(false);
  const [showform, setshowform] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const toggleform = () => setshowform(!showform);
  const logout = async () => {
    try {
      await authService.logout();

      localStorage.clear();
      setUser(null);

      navigate("/about", { replace: true });

      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (!allSubjects || allSubjects.length === 0) {
      refreshSchedule();
    }
  }, []);

  if (userLoading || scheduleLoading)
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin-pulse"></i>
        <p>Loading Profile</p>
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-name">
        <h1 className="profile-title">
          {profile?.name
            ? `Welcome ${profile.name}`
            : `Welcome ${user?.name || "User"}`}
        </h1>
        <div className="profile-buttons">
          <Button
            className="logout-button"
            title={<i className="fa-solid fa-arrow-right-from-bracket"></i>}
            onClick={logout}
          />
          <Button
            title={<i className="fa-solid fa-pen"></i>}
            onClick={toggleform}
          />
        </div>
      </div>
      <div className="profile-card">
        <p className="profile-email">
          <strong>Email </strong> {user?.email}
        </p>
        <p>
          <strong>Attendance Target </strong>{" "}
          {(profile?.attendence ?? 75) + "%"}
        </p>
        <p>
          <strong>College </strong> {profile?.college || "-"}
        </p>
        <p>
          <strong>City </strong> {profile?.city || "-"}
        </p>
        <p>
          <strong>State </strong> {profile?.state || "-"}
        </p>
        <p>
          <strong>Country </strong> {profile?.country || "-"}
        </p>
      </div>

      {showform && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserProfileform
              onprofileupdate={async () => {
                await refreshprofile();
                setshowform(false);
              }}
            />
            <button className="close-btn" onClick={toggleform}>
              close
            </button>
          </div>
        </div>
      )}

      {editingSubject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UpdateAttendencefrom
              editSubject={editingSubject}
              onstop={setOnloadingform}
              onSubjectAdded={async () => {
                await refreshSchedule();
                setEditingSubject(null);
              }}
            />
            <button
              className="close-btn"
              disabled={onloadingform}
              onClick={() => setEditingSubject(null)}
            >
              close
            </button>
          </div>
        </div>
      )}

      {!editingSubject && (
        <>
          <h2 className="Subjects">Subjects</h2>

          {!allSubjects || allSubjects.length === 0 ? (
            <div className="notfound">
              <p className="empty-text">Subject Not Found</p>
            </div>
          ) : (
            allSubjects.map((subj) => (
              <div key={subj.$id} className="subject-card">
                <div className="subject-actions">
                  <h3>{subj.SubjectName}</h3>
                  <div className="subject-action">
                    <Button
                      title={<i className="fa-solid fa-pen"></i>}
                      onClick={() => setEditingSubject(subj)}
                    />
                    <Button
                      title={<i className="fa-solid fa-trash-can"></i>}
                      onClick={() => Deleting_the_Subject(subj.$id)}
                    />
                  </div>
                </div>

                <h4 className="classes">Class Schedule:</h4>
                <ul className="schedule-list">
                  {subj.ClassesSchedule?.map((item, index) => {
                    const schedule =
                      typeof item === "string" ? JSON.parse(item) : item;

                    return (
                      <li className="subjects-lists" key={index}>
                        <p>
                          <strong>{schedule.day}</strong> {schedule.time}
                        </p>
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
