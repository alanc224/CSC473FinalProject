import React, { useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../userlogged';

export default function Logout() {

  const navigate = useNavigate();
  const { updateLoginStatus } = useContext(UserContext);
  const token = sessionStorage.getItem("token")

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log("Logout response:", response);

      if (response.status === 200 || response.status === 302) {
        updateLoginStatus(false);
        console.log("Navigating to homepage...");
        navigate("/login");
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("username")
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ fontFamily: 'inherit'}}>Logout</button>
      <style jsx>{`
      button {
        color: white;
        text-decoration: none;
        font-size: 1.8rem;
        border: none;
        background: none; 
        cursor: pointer;
      }
      .left, .middle, .right {
        flex: 1;
        text-align: center;
      }
    `}</style>
  </div>
);
}