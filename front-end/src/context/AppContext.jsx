import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
      const response = await fetch(
        `whatsapp-bulker-server-1ex8nfvuw-ashhusen97s-projects.vercel.app/userJobs/${user.id}`
      );

      const data = await response.json();

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
