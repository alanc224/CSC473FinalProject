import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, { createContext,useState} from 'react';

import HomePage from './pages/homepage';
import Leaderboard from './pages/leaderboard';
import LoginPage from './pages/loginpage';
import Logout from './pages/logout';
import RegisterPage from './pages/registerpage';
import Navbar from './pages/NavBar';
import GamePage from './pages/gamepage';
import UserContext from './userlogged';


function App() {
  
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const updateLoginStatus = (status) => {
        setIsLoggedIn(status);
      };
    return (
      <UserContext.Provider value={{ isLoggedIn, updateLoginStatus }}>
        <div className='vh-100 gradient-custom'>
          <div className='container'>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage updateLoginStatus={updateLoginStatus} />} />
                <Route path="/logout" element={<Logout updateLoginStatus={updateLoginStatus} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/game/:size" element={<GamePage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </UserContext.Provider>
      );
}

export default App;
