// context/AuthContext.js
"use client";

import { createContext, useContext } from 'react';
import { useSession } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    loading: status === "loading"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);