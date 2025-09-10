import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../constants/urls";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    if (user) {
      const fetchAndSetJobs = async () => {
        if (cancelled) return;
        await fetchJobs();
      };

      fetchAndSetJobs();

      const t = setInterval(fetchAndSetJobs, 5000);

      return () => {
        cancelled = true;
        clearInterval(t);
      };
    }

    return () => {}; // no-op cleanup when user is null
  }, [user]);

  const fetchJobs = async () => {
    try {
      console.log(user);
      const response = await fetch(
        `${BASE_URL}/conversations/${user?.user_id}`
      );
      const data = await response.json();
      console.log("data", data);
      setJobs(data);
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong, please try again");
    }
  };

  return <AppContext.Provider value={{ jobs }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
