/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");

  const login = (newToken, newUserId, newUsername, newEmail) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    if (newUsername) localStorage.setItem("username", newUsername);
    if (newEmail) localStorage.setItem("userEmail", newEmail);
    setToken(newToken);
    setUserId(newUserId);
    if (newUsername) setUsername(newUsername);
    if (newEmail) setUserEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserId(null);
    setUsername("User");
    setUserEmail("");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        username,
        userEmail,
        isLoggedIn: !!token,
        login,
        logout,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};