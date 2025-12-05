import React, { createContext, useContext, useState } from "react";
import scheduleService from "../Appwrite/ScheduleService";
import classAttendService from "../Appwrite/ClassAttendService";
import { useUser } from "./UserContext";
import { useLocalStorage } from "./LocalStorageContext";
import { useSchedule } from "./ScheduleContext";

const DeleteUpdateContext = createContext();

export const DeleteUpdateProvider = ({ children }) => {
  const { user } = useUser();
  const { allSubjects, todayClasses, refreshSchedule } = useSchedule();
  const [loading, setLoading] = useState(true);

  const Deleting_the_Subject = async (SubjectId) => {
    if (!user || !allSubjects?.length) return;
    setLoading(true);

    try {
      await scheduleService.deleteSubject(SubjectId);
      await classAttendService.deleteAttendanceBySubject(user.$id, SubjectId);
      const updatedallSubjects = JSON.parse(localStorage.getItem("ClassCache"));
      updatedallSubjects.allSubjects = updatedallSubjects.allSubjects.filter(
        (subj) => subj.$id !== SubjectId
      );
      localStorage.setItem("ClassCache", JSON.stringify(updatedallSubjects));
      await refreshSchedule(true);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <DeleteUpdateContext.Provider
      value={{
        Deleting_the_Subject,
      }}
    >
      {children}
    </DeleteUpdateContext.Provider>
  );
};

export const useDeleteUpdate = () => useContext(DeleteUpdateContext);
