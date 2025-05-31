// store/auth.jsx
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const LogoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/user", {
        headers: { Authorization: authorizationToken },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        LogoutUser();
      }
    } catch (error) {
      console.error(error);
      LogoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        storeTokenInLS,
        LogoutUser,
        user,
        authorizationToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
