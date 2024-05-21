import React, { useState, useEffect } from "react";
import {Link, useNavigate } from 'react-router-dom';
import Navbar from "./NavBar";
import axios from 'axios';
 
function SuccessPage(){
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const id = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        window.location.href = "/";
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    const handleIncrementHints = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/hintsuccess=true', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          withCredentials: true,
          body: JSON.stringify({ id: id })
        });

        if (response.ok) {
          console.log("incremented hints count");
          sessionStorage.removeItem("id")
        } else {
          console.error("Error incrementing hints:", await response.text());
        }
      } catch (error) {
        console.error("Error incrementing hints:", error);
      }
    };
    handleIncrementHints(); 
  }, []);

  return (
    <div className="success-page">
      <h2>Thank you for your purchase!</h2>
      <p>You will be redirected to the home page in {secondsRemaining} seconds.</p>
    </div>
  );
}

export default SuccessPage;

 