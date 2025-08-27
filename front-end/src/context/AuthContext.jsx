import React, { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../constants/urls";
import { da } from "date-fns/locale";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(storedUser);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsAuthenticated(storedAuth === "true");
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();
      console.log(data?.user_id);
      if (data?.user_id) {
        setUser(data?.user_id);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", "" + data?.user_id);
        setIsAuthenticated(true);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong, please try again");
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
