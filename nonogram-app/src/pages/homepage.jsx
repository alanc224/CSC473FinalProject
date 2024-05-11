import React, { } from "react";
import {Link} from 'react-router-dom';
import Navbar from "./NavBar";
import './homepage.css';
 
export default function HomePage(){
 
  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage__content">
        <h1 className="homepage__title">WELCOME TO ______!</h1>
        <h2>HOW TO PLAY</h2>
        <h2>-Select a grid size below to get started-</h2>
        <div className="homepage__link-container">
          <Link to='/game/5x5' className="homepage__link">5 x 5</Link> 
          <Link to='/game/10x10' className="homepage__link">10 x 10</Link>
          <Link to='/game/15x15' className="homepage__link">15 x 15</Link>
          <Link to='/game/20x20' className="homepage__link">20 x 20</Link>
        </div>
      </div>
    </div>
  );
}