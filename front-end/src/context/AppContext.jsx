import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../constants/urls";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      console.log(user);
      const response = await fetch(`${BASE_URL}/userJobs/${user}`);
      const data = await response.json();
      console.log("data", data);
      setJobs(data?.jobs);
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
