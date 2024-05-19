import React, { useState, useContext, useEffect  } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import Navbar from "./NavBar";
import './loginpage.css';
import UserContext from '../userlogged';
 
export default function LoginPage(){
 
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { updateLoginStatus } = useContext(UserContext);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token")

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      const username = sessionStorage.getItem("username");
      setIsLoggedIn(!!token && !!username);
    }, []); 
     
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
              console.log(response.data);
              setIsLoading(false);
              updateLoginStatus(true);
              sessionStorage.setItem("token", response.data.access_token);
              const username = response.data.username || '';
              sessionStorage.setItem("username", username);
              setUsername(username);
              setIsLoggedIn(true);


              if (token || username) {
              }

              navigate("/");
            })
            .catch(function (error) {
                setIsLoading(false);
                console.log(error, 'error');
                if (error.response.status === 401) {
                    alert("Invalid credentials");
                }
            });
        }
    }
     
    return (
      <>
      <Navbar/>
      <div className="loginpage">
        <div className="login-form-container">
          <form>
            <div>
              <p>Log Into Your Account</p>
            </div>

              {isLoggedIn  ? "You are logged in: " + sessionStorage.getItem("username") :
              <div>
                <div>
                  <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter a valid email address" />
                  <label>Username</label>
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
              </div>
}
          </form>
        </div>
      </div>
      </>
    );    
}