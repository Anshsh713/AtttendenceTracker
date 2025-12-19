import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext.jsx";
import { useSchedule } from "./ScheduleContext.jsx";
import scheduleService from "../Appwrite/ScheduleService.js";

export const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const { user } = useUser();
  const { allSubjects } = useSchedule();

  const [historyData, setHistoryData] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  const getHistory = async (subjectId) => {
    if (!user || !subjectId) return;

    const subject = allSubjects.find((s) => s.$id === subjectId);
    if (!subject) return;

    setLoadingHistory(true);

    try {
      const attendance = await scheduleService.getAttendanceHistory(
        subjectId,
        user.$id
      );

      const merged = {
        subjectName: subject.SubjectName,
        createdAt: subject.$createdAt,
        schedules: subject.ClassesSchedule,
        attendance,
      };

      setHistoryData((prev) => ({
        ...prev,
        [subjectId]: merged,
      }));
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <HistoryContext.Provider
      value={{ getHistory, historyData, loadingHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
