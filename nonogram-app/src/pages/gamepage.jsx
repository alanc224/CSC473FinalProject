import React from "react";
import Navbar from "./NavBar";
import './gamepage.css';
import { useParams } from "react-router-dom";
import nonogramData from '../nonogram.json';

export default function GamePage() {
  const params = useParams()
  // Access data from imported JSON
  const { nonogram } = nonogramData;

  // console.log(nonogram[params.size]);
  const myArray = nonogram[params.size];

  // Function to get a random element from the array
  const getRandomElement = () => {
    const randomIndex = Math.floor(Math.random() * myArray.length);
    return myArray[randomIndex];
  };

  // values of nonogram puzzle
  const nonogramPuzzle = getRandomElement();
  const nonogramValues = Object.values(nonogramPuzzle);
  // console.log(nonogramValues[0].board);

  const numRows = parseInt(params.size.split("x")[0]);
  const numCols = parseInt(params.size.split("x")[1]);
  console.log(numRows);
  console.log(numCols);
  const grid = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => ''));


  
  return (
    <div className="gamepage">
      <Navbar/>
      <p>{params.size}</p>
      <div className="grid-container">
      {/* Map over each row of the grid */}
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {/* Map over each cell in the row */}
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="grid-cell">{cell}</div>
          ))}
        </div>
      ))}
    </div>
    </div>
  );
}