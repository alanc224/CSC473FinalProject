import React, { useState } from "react";
import {Link} from 'react-router-dom';
import Navbar from "./NavBar";
import './homepage.css';
 
export default function HomePage(){

  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage__content">
        <h1 className="homepage__title">WELCOME TO GRIDDLE!</h1>
        <div className="h2p-button center"onClick={toggleInstructions} style={{ cursor: "pointer" }}>
          <button>HOW TO PLAY</button>
        </div>
        {showInstructions && (
          <div className="instructions">
            <p>Nonograms, also known as Picross, is a puzzle game where you fill in cells in a grid based on numerical clues provided for each row and column. 
              Here are the basic instructions to play a nonogram game:</p>
              <ul>
                <li>Grid: A nonogram puzzle consists of a grid of squares. The size of the grid varies from puzzle to puzzle.</li>
                <li>Clues: Each row and column of the grid has a sequence of numbers associated with it. These numbers represent the lengths of consecutive filled cells in that row or column. 
                  For example, a row with the clue "3 1" means there are three consecutive filled cells followed by at least one empty cell, and then one filled cell.</li>
                <li>Logic: Use the clues provided to logically determine which cells should be filled and which should be left empty. 
                  By analyzing the clues and the intersections between rows and columns, you can deduce the correct arrangement of filled and empty cells. Good Luck!</li>
              </ul>
            <button onClick={toggleInstructions}>Close</button>
          </div>
        )}
        <h2>--Select a grid size below to get started--</h2>
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