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
    console.log("🟣 getHistory CALLED with subjectId =", subjectId);

    if (!user || !subjectId) {
      console.log("⛔ Missing user or subjectId");
      return;
    }

    console.log("👤 User ID =", user.$id);

    const subject = allSubjects.find((s) => s.$id === subjectId);
    console.log("📘 SUBJECT FOUND =", subject);

    if (!subject) {
      console.log("⛔ No subject found for this ID");
      return;
    }

    setLoadingHistory(true);
    console.log("⏳ Loading history = TRUE");

    try {
      console.log("📥 Fetching attendance from service...");
      const attendance = await scheduleService.getAttendanceHistory(
        subjectId,
        user.$id
      );

      console.log("📥 ATTENDANCE RECEIVED =", attendance);

      const merged = {
        subjectName: subject.SubjectName,
        createdAt: subject.$createdAt,
        schedules: subject.ClassesSchedule,
        attendance,
      };

      console.log("🟢 MERGED HISTORY OBJECT =", merged);

      setHistoryData((prev) => ({
        ...prev,
        [subjectId]: merged,
      }));

      console.log("📦 historyData UPDATED =", merged);
    } catch (error) {
      console.error("❌ Error loading history:", error);
    } finally {
      console.log("⏹ Loading history = FALSE");
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
