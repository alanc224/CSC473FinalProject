import React, { } from 'react';
import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

import HomePage from './pages/homepage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import Navbar from './pages/NavBar';

function App() {
    return (
        <div className='vh-100 gradient-custom'>
            <div className='container'>
                <BrowserRouter>
                <Routes> 
                    <Route path='/Navbar' element={<Navbar />} />
                    <Route path='/' element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> 
                </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
