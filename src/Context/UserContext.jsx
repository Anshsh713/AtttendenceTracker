import React, { createContext, useContext, useState, useEffect } from "react";
import authInformation from "../Appwrite/AuthInformation";
import { useSelector } from "react-redux";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const reduxUser = useSelector((state) => state.auth.userData);

  const [user, setUser] = useState(null);
  const [profile, setprofile] = useState({});
  const [loading, setLoading] = useState(true);

  const loadfromcache = (key) => {
    try {
      const cache = JSON.parse(localStorage.getItem(key));
      return cache || null;
    } catch (error) {
      console.error("Not able to get cache:", error);
      return null;
    }
  };

  const saveToCache = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Unable to save cache:", error);
    }
  };

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      setUser(null);
      setprofile({});
      localStorage.removeItem("UserProfile");
    }
  }, [reduxUser]);

  const fetchProfile = async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const cached = loadfromcache("UserProfile");
    if (!forceRefresh && cached) {
      setprofile(cached);
      setLoading(false);
      return;
    }

    try {
      const res = await authInformation.getProfile(user.$id);

      if (res) {
        const normalized = {
          name: res.USERNAME ?? "",
          college: res.College_Name ?? "",
          city: res.City ?? "",
          state: res.State ?? "",
          country: res.Country ?? "",
          attendence: res.attendence ?? 75,
        };

        setprofile(normalized);
        saveToCache("UserProfile", normalized);
      }
    } catch (error) {
      console.log("Not able to get user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const refreshprofile = async () => {
    await fetchProfile(true);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, profile, refreshprofile, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
