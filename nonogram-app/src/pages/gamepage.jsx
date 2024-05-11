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
  const cluesRows = nonogramValues[0].clues_rows;
  const cluesCols = nonogramValues[0].clues_cols;

  let scale;
  switch (params.size) {
    case "5x5":
      scale = 100;
      break;
    case "10x10":
      scale = 60;
      break;
    case "15x15":
      scale = 30;
      break;
    case "20x20":
      scale = 45;
      break;
  }

  let spacing;
  switch (params.size) {
    case "5x5":
      spacing = "4.2rem";
      break;
    case "10x10":
      spacing = "4.3rem";
      break;
    case "15x15":
      spacing = "4.4rem";
      break;
    case "20x20":
      spacing = "4.5rem";
      break;
  }
  
  return (
    <>
      <Navbar/>
      <div className="gamepage" style={{ transform: `scale(${scale}%)` }}>
        <div className="clues-cols" style={{ gap: spacing }}>
          {/* Map over each column of the clues */}
          {cluesCols.map((column, colIndex) => (
            <div key={colIndex} className="clues-column">
              {/* Map over each row in the column */}
              {column.map((clue, rowIndex) => (
                <span key={rowIndex}>{clue} </span>
              ))}
            </div>
          ))}
        </div>

        <div className="grid-container">
          {/* Map over each row of the grid */}
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              <div className="clues-rows">{cluesRows[rowIndex]}</div>
              {/* Map over each cell in the row */}
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="grid-cell">{cell}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}