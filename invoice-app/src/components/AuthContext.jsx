import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import api from "./Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
   const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await fetchUserProfile();
      }
      setIsLoading(false);
    };
    initializeAuth();
    }, []); 

   const register = async (userData) => {
    console.log("3. Inside the context's register function."); 
    try {
      await api.post('/register', userData);
    } catch (error) {
      console.error("Error from API call in context:", error); 
      throw new Error(error.response?.data || 'An unknown error occurred.');
    }
  };
  
  const login = async (credentials) => {
    console.log("Data being sent to /login API:", credentials);
    try {
      const config = {
         headers: {
           'Content-Type': 'application/json'
         }
       }

      const response = await api.post('/login', credentials, config);
      const { token, user: userFromServer } = response.data;
      
      if (!token || !userFromServer) {
        throw new Error("Invalid response from server on login.");
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userFromServer);
      return userFromServer; 
      
    } catch (error) {
      console.error("AuthContext: Error during login process:", error);
      throw error; 
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false); 
      return;
    }

    try {
      const response = await api.get('/profile');
      setUser(response.data);

      } catch (error) {
        console.error("Failed to fetch user profile, likely an invalid token.", error);
        logout(); 
      }
  };
  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      setUser(response.data.user);
      return response.data.user;
    }  
    catch (error) {
      console.error("Failed to update profile:", error);
      throw new Error(error.response?.data?.message || 'Could not update profile.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const deleteAccount = async () => {
    try {
      await api.delete('/me');
      logout();
      
    } catch (error) {
      console.error("Failed to delete account:", error);
        throw new Error(error.response?.data?.message || 'Could not delete your account.');
    }
  };


  const value = { user, token, register, login, logout, fetchUserProfile, updateUserProfile, deleteAccount };
  if (isLoading) {
    return <div>Loading Application...</div>;
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>);
};
