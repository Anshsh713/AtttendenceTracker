import React, { useContext, createContext, useEffect, useState } from "react";
import scheduleService from "../Appwrite/ScheduleService.js";
import { useUser } from "./UserContext.jsx";
import { useLocalStorage } from "./LocalStorageContext.jsx";
const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const { user } = useUser();
  const [todayClasses, setTodayClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [futureClasses, setFutureClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { LoadData, SaveData } = useLocalStorage();

  const today = new Date().toISOString().split("T")[0];

  const loadfromcache = () => {
    try {
      const cache = LoadData("ClassCache");
      if (cache) {
        setTodayClasses(cache.todayClasses || []);
        setAllSubjects(cache.allSubjects || []);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("NOt able to get data : ", error);
    }
    return false;
  };

  const saveToCache = (data) => {
    SaveData("ClassCache", {
      ...data,
    });
  };

  const fetchScheduleData = async (forceRefresh = false) => {
    if (!user) return;
    setLoading(true);
    if (!forceRefresh && loadfromcache()) {
      setLoading(false);
      return;
    }
    try {
      const baseDate = new Date();
      const subjects = await scheduleService.getUserSubject(user.$id);
      const todayclass = await scheduleService.getTodayClasses(
        user.$id,
        new Date(baseDate)
      );
      const past = [];
      const future = [];

      for (let offset = 1; offset <= 4; offset++) {
        const pastDate = new Date(baseDate);
        pastDate.setDate(pastDate.getDate() - offset);

        const futureDate = new Date(baseDate);
        futureDate.setDate(futureDate.getDate() + offset);

        const pastClasses = await scheduleService.getTodayClasses(
          user.$id,
          pastDate
        );

        const futureClasses = await scheduleService.getTodayClasses(
          user.$id,
          futureDate
        );

        past.push({
          date: pastDate,
          classes: pastClasses,
        });

        future.push({
          date: futureDate,
          classes: futureClasses,
        });
      }
      console.log(subjects);
      setTodayClasses(todayclass || []);
      setPastClasses(past || []);
      setFutureClasses(future || []);
      setAllSubjects(subjects || []);
      saveToCache({
        todayClasses: todayclass || [],
        pastClasses: past || [],
        futureClasses: future || [],
        allSubjects: subjects || [],
      });
      console.log("Fetched schedule data from Appwrite");
    } catch (error) {
      console.error("Error fetching schedule data : ", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSchedule = async () => {
    await fetchScheduleData(true);
  };

  useEffect(() => {
    if (user) fetchScheduleData();
  }, [user]);

  return (
    <ScheduleContext.Provider
      value={{
        futureClasses,
        pastClasses,
        todayClasses,
        allSubjects,
        refreshSchedule,
        loading,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
