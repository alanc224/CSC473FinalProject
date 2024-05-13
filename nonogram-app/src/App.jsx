import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, { createContext,useState, useEffect } from 'react';

import HomePage from './pages/homepage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import Navbar from './pages/NavBar';
import GamePage from './pages/gamepage';
import UserContext from './userlogged';

const UC = createContext(null); 

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
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route
                path="/login"
                element={<LoginPage updateLoginStatus={updateLoginStatus} />} // Pass updateLoginStatus prop
              />
              <Route path="/logout" element={<HomePage />} />
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
