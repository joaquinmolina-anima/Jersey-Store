import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("usuario");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  function login(userData, userToken) {
    localStorage.setItem("usuario", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    setUser(userData);
    setToken(userToken);
  }

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  }

  const isLoggedIn = Boolean(user && token);
  const isAdmin = user?.rol === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
