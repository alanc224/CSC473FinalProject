import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Navbar from "./NavBar";
import './registerpage.css';
 
export default function RegisterPage(){
 
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
   
    const navigate = useNavigate();
     
    const registerUser = () => {
      if(username.length === 0){
        alert("username has left Blank!");
      }
      else if(password.length === 0){
        alert("password has left Blank!");
      }
      else{
        axios.post('http://127.0.0.1:5000/register', {
            username: username,
            password: password
        },{withCredentials: true})
        .then(function (response) {
            console.log(response);
            navigate("/");
        })
        .catch(function (error) {
            console.log(error, 'error');
            if (error.response.status === 401) {
                alert("Invalid credentials");
            }
        });
      }
    };
     
  return (
    <div className="registerpage">
      <Navbar />
        <div className="register-form-container">
          <form>
            <div>
              <p>Create Your Account</p>
            </div>

            <div>
              <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter a valid email address" />
              <label>Email Address</label>
            </div>

            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
              <label>Password</label>
            </div>

            <div>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
              <label>Confirm Password</label>
            </div>

            <div>
              <button type="button" onClick={registerUser}>Register</button>
              <p>Already have an account? <a href="/login">Login</a></p>
            </div>
          </form>
        </div>
    </div>
  );
}