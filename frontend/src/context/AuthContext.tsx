"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
// Remove useRouter import from here - not needed!

export interface AdminForLogin {
  admin_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  role: AdminRole;
  hashed_password: string;
  region: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  REGIONAL_ADMIN = "regional_admin",
  STANDARD = "standard",
}

type AuthContextType = {
  isAuthenticated: boolean;
  isMainLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  admin: AdminForLogin | null;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isMainLoading: true,
  login: async () => false,
  logout: () => {},
  admin: null,
  token: null,
});

const axiosInstance = axios.create({
  // baseURL: "http://192.168.31.193:8000/api",
  // baseURL: "http://26.219.114.145:8000/api",
  baseURL: "http://localhost:8000/api",
  // withCredentials: true, this is not needed for now as no cookies are used
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMainLoading, setisMainLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminForLogin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Remove router from here - navigation will be handled by layouts!

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const adminString = localStorage.getItem("admin");
        const tokenString = localStorage.getItem("token");
        if (adminString) {
          const adminData = JSON.parse(adminString);
          setAdmin(adminData);
          setIsAuthenticated(true);
        }
        if (tokenString) {
          setToken(tokenString);
        }
      } catch (error) {
        console.error("Failed to get admin data", error);
      } finally {
        setisMainLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (email && password) {
        console.log("Attempting to login with", email);
        console.log("password", password);

        const response = await axiosInstance.post("/auth/login/admin", {
          email,
          password,
        });

        const adminData = response.data.data.admin as AdminForLogin;
        const token = response.data.data.token;
        if (!adminData || !token) {
          throw new Error("Invalid login response");
        }
        console.log("Login successful", adminData, token);
        localStorage.setItem("admin", JSON.stringify(adminData));
        localStorage.setItem("token", token);
        setAdmin(adminData);
        setToken(token);
        setIsAuthenticated(true);
        // Remove router.push - layout will handle navigation automatically!
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      toast.success("Logout successful", {
        description: "You have successfully logged out.",
      });
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      setAdmin(null);
      setToken(null);
      setIsAuthenticated(false);
      // Remove router.push("/") - layout will handle navigation automatically!
      console.log("Logout successful");

      // Debug logs
      const adminString = localStorage.getItem("admin");
      const tokenString = localStorage.getItem("token");
      console.log("Admin after logout:", adminString);
      console.log("Token after logout:", tokenString);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isMainLoading, login, logout, admin, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
