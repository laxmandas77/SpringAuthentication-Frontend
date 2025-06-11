import { createContext, useEffect, useState } from "react";
import React from 'react';
import { AppConstants } from "../util/constant";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();


export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;

  const backendURL = AppConstants.BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(backendURL + "/api/profile");
      if (response.status === 200) {
        setUserData(response.data)
      } else {
        toast.error("Unable to retrieve the peofile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getAuthState = async () => {
    try {
      const response = await axios.get(backendURL + "/api/is-authenticated");
      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAuthState();
  }, [])

  const contextValue = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData
  }
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}
