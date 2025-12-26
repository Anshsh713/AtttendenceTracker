import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../Appwrite/AuthService";
import authInformation from "../Appwrite/AuthInformation";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saveduser = localStorage.getItem("user");
    return saveduser ? JSON.parse(saveduser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [profile, setprofile] = useState({});

  const loadfromcache = (key) => {
    try {
      const cache = JSON.parse(localStorage.getItem(key));
      if (cache) {
        setLoading(false);
        return cache;
      } else {
        return null;
      }
    } catch (error) {
      console.error("NOt able to get data : ", error);
    }
    return null;
  };

  const saveToCache = (key, data) => {
    try {
      const cache = {
        ...data,
      };
      localStorage.setItem(key, JSON.stringify(cache));
    } catch (error) {
      console.error("Unable to get the Data :", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error fetching user : ", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchProfile = async (forceRefresh = false) => {
    if (!user) return null;
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
      console.log("Not able to get user data ");
    }
  };

  const refreshprofile = async () => {
    await fetchProfile(true);
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, profile, refreshprofile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
