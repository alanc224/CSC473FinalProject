import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Navbar from "./NavBar";
import './loginpage.css';
 
export default function LoginPage(){
 
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
   
    const navigate = useNavigate();
     
    const logInUser = () => {
        if(username.length === 0){
          alert("username has left Blank!");
        }
        else if(password.length === 0){
          alert("password has left Blank!");
        }
        else{
            axios.post('http://127.0.0.1:5000/login', {
                username: username,
                password: password
            })
            .then(function (response) {
                console.log(response);
                //console.log(response.data);
                navigate("/");
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response.status === 401) {
                    alert("Invalid credentials");
                }
            });
        }
    }
     
    return (
      <div className="loginpage">
        <Navbar />
        <div className="login-form-container">
          <form>
            <div>
              <p>Log Into Your Account</p>
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
              <div>
                <input type="checkbox"/>
                <label>
                  Remember me
                </label>
              </div>
            </div>
    
            <div>
              <button type="button" onClick={logInUser}>Login</button>
              <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
          </form>
        </div>
      </div>
    );    
}