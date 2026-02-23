import React, { createContext, useContext, useState, useEffect } from "react";
import classAttendService from "../Appwrite/ClassAttendService";
import { useUser } from "./UserContext";
import { useLocalStorage } from "./LocalStorageContext";
import { useSchedule } from "./ScheduleContext";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { allSubjects } = useSchedule();
  const { user } = useUser();
  const { LoadData, SaveData } = useLocalStorage();
  const [extraclassesRecords, setExtraClassesRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [totalAttendance, setTotalAttendance] = useState({});
  const today = new Date().toLocaleDateString("en-CA");
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const loadFromCacheForAttendance = (key) => {
    try {
      const cache = LoadData(key);
      if (cache) {
        setAttendanceRecords(cache.attendancerecords);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("❌ Failed to load attendance from cache:", error);
    }
    return false;
  };

  const saveToCache = (data, key) => {
    SaveData(key, {
      ...data,
    });
  };

  const TotalAttendance = async (subjectId) => {
    if (!user || !allSubjects?.length) return;
    setLoading(true);

    const cache =
      JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
    if (cache[subjectId] !== undefined) {
      setTotalAttendance((prev) => ({
        ...prev,
        [subjectId]: cache[subjectId],
      }));
      setLoading(false);
      return;
    }

    try {
      const data = await classAttendService.TotalAttendance(
        user.$id,
        subjectId,
      );
      setTotalAttendance((prev) => ({
        ...prev,
        [subjectId]: data,
      }));
      localStorage.setItem(
        "TotalAttendanceCache",
        JSON.stringify({ ...cache, [subjectId]: data }),
      );
    } catch (error) {
      console.error("❌ Error fetching total attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (subjects) => {
    if (!user || !subjects?.length) return;
    setLoading(true);

    if (loadFromCacheForAttendance("AttendClassesCache")) return;

    try {
      const data = await classAttendService.getAttendanceByDate(
        user.$id,
        today,
        dayName,
      );

      const allRecords = {};
      data.forEach((rec) => {
        const key = `${rec.SubjectID}_${rec.ClassDay}_${rec.ClassTime}`;
        allRecords[key] = rec;
      });

      setAttendanceRecords(allRecords);
      saveToCache({ attendancerecords: allRecords }, "AttendClassesCache");
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status, subj, schedule) => {
    if (!user) return;
    try {
      const response = await classAttendService.markAttendance(
        user.$id,
        subj.subjectName,
        subj.subjectId,
        schedule.day,
        schedule.time,
        today,
        status,
      );

      if (!response?.success) {
        return false;
      }

      const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
      const updatedRecords = {
        ...attendanceRecords,
        [key]: {
          Status: status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
          ClassDate: today,
        },
      };

      setAttendanceRecords(updatedRecords);
      saveToCache({ attendancerecords: updatedRecords }, "AttendClassesCache");

      // Clear total attendance cache for this subject
      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[subj.subjectId];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));
    } catch (error) {
      console.log("❌ Failed to mark attendance:", error);
    }
  };

  const QuickAttendance = async (status, subj, schedule) => {
    if (!user) return;

    const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;

    const updatedRecords = {
      ...attendanceRecords,
      [key]: {
        Status: status,
        ClassDay: schedule.day,
        ClassTime: schedule.time,
        ClassDate: schedule.date,
      },
    };

    setAttendanceRecords(updatedRecords);

    saveToCache({ attendancerecords: updatedRecords }, "AttendClassesCache");
    try {
      const response = await classAttendService.markAttendance(
        user.$id,
        subj.subjectName,
        subj.subjectId,
        schedule.day,
        schedule.time,
        schedule.date,
        status,
      );

      if (!response?.success) return false;

      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[subj.subjectId];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));
    } catch (error) {
      console.log("❌ Failed to mark attendance:", error);
    }
  };

  const fetchExtraClass = () => {
    try {
      const cache = LoadData("ExtraClassCache");
      if (cache?.extraclassesRecords) {
        setExtraClassesRecords(cache.extraclassesRecords);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.log("Failed to load the extra classes");
    }
    return false;
  };

  const handleExtraClass = async (data) => {
    if (!user) return false;
    try {
      const response = await classAttendService.addExtraClass(
        user.$id,
        data.subjectName,
        data.subjectID,
        data.day,
        data.time,
        data.date,
        data.status,
      );

      if (!response) {
        return false;
      }

      const key = `${data.subjectID}_${data.day}_${data.time}`;
      const updatedRecords = {
        ...extraclassesRecords,
        [key]: {
          SubjectID: data.subjectID,
          SubjectName: data.subjectName,
          Status: data.status,
          ClassDay: data.day,
          ClassTime: data.time,
          ClassDate: data.date || today,
        },
      };

      setExtraClassesRecords(updatedRecords);
      saveToCache(
        {
          extraclassesRecords: updatedRecords,
        },
        "ExtraClassCache",
      );

      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[data.subjectID];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));

      return true;
    } catch (error) {
      console.log("❌ Error adding extra class:", error);
      return false;
    }
  };
  const UpdateExtraClassAttendence = async (rec, data) => {
    if (!user) return false;
    try {
      await classAttendService.updateAttendance(
        user.$id,
        rec.SubjectID,
        rec.SubjectName,
        rec.ClassDay,
        rec.ClassTime,
        rec.ClassDate || today,
        data,
      );
      const key = `${rec.SubjectID}_${rec.ClassDay}_${rec.ClassTime}`;

      const updatedRecords = {
        ...extraclassesRecords,
        [key]: {
          ...rec,
          Status: data.Status,
        },
      };
      setExtraClassesRecords(updatedRecords);
      saveToCache(
        {
          extraclassesRecords: updatedRecords,
        },
        "ExtraClassCache",
      );
      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[rec.SubjectID];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));

      await TotalAttendance(rec.SubjectID);
      return true;
    } catch (error) {
      console.error("❌ Update extra class failed:", error);
      return false;
    }
  };
  const UpdateAttendance = async (subj, schedule, data) => {
    try {
      await classAttendService.updateAttendance(
        user.$id,
        subj.subjectId,
        subj.subjectName,
        schedule.day,
        schedule.time,
        schedule.date || today,
        data,
      );
      const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
      const updatedRecords = {
        ...attendanceRecords,
        [key]: {
          Status: data.Status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
          ClassDate: schedule.date || today,
        },
      };
      setAttendanceRecords(updatedRecords);
      saveToCache(
        {
          attendancerecords: updatedRecords,
        },
        "AttendClassesCache",
      );
      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[subj.subjectId];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));

      setTotalAttendance((prev) => {
        const updated = { ...prev };
        delete updated[subj.subjectId];
        return updated;
      });

      await TotalAttendance(subj.subjectId);
      return true;
    } catch (error) {
      console.error("❌ Error updating attendance:", error);
      return false;
    }
  };

  const updateAttendance_by_History = async (rec, data) => {
    if (!user) return false;
    try {
      await classAttendService.updateAttendance(
        user.$id,
        rec.SubjectID,
        rec.SubjectName,
        rec.ClassDay,
        rec.ClassTime,
        rec.ClassDate || today,
        data,
      );

      const key = `${rec.SubjectID}_${rec.ClassDay}_${rec.ClassTime}`;

      const updatedAttendance = {
        ...attendanceRecords,
        [key]: {
          Status: data.Status,
          ClassDay: rec.ClassDay,
          ClassTime: rec.ClassTime,
          ClassDate: rec.ClassDate,
        },
      };

      setAttendanceRecords(updatedAttendance);

      saveToCache(
        {
          attendancerecords: updatedAttendance,
        },
        "AttendClassesCache",
      );

      if (extraclassesRecords[key]) {
        const updatedExtra = {
          ...extraclassesRecords,
          [key]: {
            ...extraclassesRecords[key],
            Status: data.Status,
          },
        };

        setExtraClassesRecords(updatedExtra);
        saveToCache(
          {
            extraclassesRecords: updatedExtra,
          },
          "ExtraClassCache",
        );
      }

      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[rec.SubjectID];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));

      await TotalAttendance(rec.SubjectID);
      return true;
    } catch (error) {
      console.error("Update extra class failed:", error);
      return false;
    }
  };

  const todayKey = `autoMarked_${today}`;
  const [hasMarkedYesterday, setHasMarkedYesterday] = useState(
    localStorage.getItem(todayKey) === "true",
  );

  const autoMarkYesterdayMissedClasses = async () => {
    if (!user || !allSubjects?.length || hasMarkedYesterday) return;
    setHasMarkedYesterday(true);
    localStorage.setItem(todayKey, "true");

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let anyMarked = false;
    const subjectsToRefresh = new Set();

    try {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateString = pastDate.toLocaleDateString("en-CA");
      const dayName = dayNames[pastDate.getDay()];
      const dayNameLower = dayName.toLowerCase();

      // Fetch ALL attendance records for yesterday once
      const yesterdayAttendance = await classAttendService.getAttendanceByDate(
        user.$id,
        dateString,
        dayName,
      );

      // Create a lookup set for efficiency: "SubjectID_Time"
      const markedSet = new Set(
        yesterdayAttendance.map((rec) => `${rec.SubjectID}_${rec.ClassTime}`),
      );

      for (const subject of allSubjects) {
        if (!subject.ClassesSchedule) continue;

        for (const scheduleStr of subject.ClassesSchedule) {
          try {
            const schedule = JSON.parse(scheduleStr);
            if (schedule.day.toLowerCase() === dayNameLower) {
              const lookupKey = `${subject.$id}_${schedule.time}`;

              if (!markedSet.has(lookupKey)) {
                console.log(
                  `Auto-marking NOT for: ${subject.SubjectName} at ${schedule.time} on ${dateString}`,
                );

                await classAttendService.markAsNot(
                  user.$id,
                  subject.$id,
                  subject.SubjectName,
                  dayName,
                  schedule.time,
                  dateString,
                );

                anyMarked = true;
                subjectsToRefresh.add(subject.$id);
              }
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (anyMarked) {
        const totalCache =
          JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
        subjectsToRefresh.forEach((id) => {
          delete totalCache[id];
          TotalAttendance(id); // Trigger refresh
        });
        localStorage.setItem(
          "TotalAttendanceCache",
          JSON.stringify(totalCache),
        );
      }
    } catch (error) {
      console.error("❌ Auto-marking failed:", error);
      setHasMarkedYesterday(false); // Reset on error to allow retry
    }
  };

  useEffect(() => {
    if (user?.$id && allSubjects?.length) {
      autoMarkYesterdayMissedClasses();
    }
  }, [user?.$id, allSubjects]);

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        fetchAttendance,
        markAttendance,
        loading,
        TotalAttendance,
        totalAttendance,
        handleExtraClass,
        UpdateAttendance,
        fetchExtraClass,
        extraclassesRecords,
        UpdateExtraClassAttendence,
        updateAttendance_by_History,
        QuickAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
