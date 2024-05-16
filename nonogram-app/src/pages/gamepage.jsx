import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import './gamepage.css';
import { useParams } from "react-router-dom";
import nonogramData from '../nonogram.json';

export default function GamePage() {
  const params = useParams()
  // Access data from imported JSON
  const [nonograms, setNonograms] = useState(nonogramData['nonogram'][params.size])
  const [nonogramPuzzle, setNonogramPuzzle] = useState(nonograms[Math.floor(Math.random() * nonograms.length)])
  const [numRows] = useState(parseInt(params.size.split("x")[0]))
  const [numCols] = useState(parseInt(params.size.split("x")[1]))
  const [cluesRows, setCluesRows] = useState(Object.values(nonogramPuzzle)[0].clues_rows)
  const [cluesCols, setCluesCols] = useState(Object.values(nonogramPuzzle)[0].clues_cols)
  const [board, setBoard] = useState(Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => '0')));

  useEffect(() => {
    console.log(board)
  }, [board])

  const boardUpdate = (rowIndex, colIndex) => {
    let tempboard = [...board]

    if (board[rowIndex][colIndex] === '0') {
      tempboard[rowIndex][colIndex] = '1';
    } else if (board[rowIndex][colIndex] === '1') {
      tempboard[rowIndex][colIndex] = 'x';
    } else if (board[rowIndex][colIndex] === 'x') {
      tempboard[rowIndex][colIndex] = '0';
    }
    setBoard(tempboard)
  }

  let scale;
  switch (params.size) {
    case "5x5":
      scale = 100;
      break;
    case "10x10":
      scale = 60;
      break;
    case "15x15":
      scale = 40;
      break;
    case "20x20":
      scale = 20;
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
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              <div className="clues-rows">{cluesRows[rowIndex]}</div>
              {/* Map over each cell in the row */}
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="grid-cell" onClick={() => boardUpdate(rowIndex, colIndex)}>{cell}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}