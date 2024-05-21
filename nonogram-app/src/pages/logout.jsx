import React, { useState, useContext, useNavigate } from "react";
import axios from 'axios';
 
export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/logout');
      console.log(response);

      // Handle successful logout
      if (response.status === 200 || response.status === 302) {
        updateLoginStatus(false);
        navigate("/login");
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Log Out</button>
  );
}
