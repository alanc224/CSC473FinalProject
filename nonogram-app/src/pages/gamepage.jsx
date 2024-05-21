import React, { useState, useEffect} from "react";
import Navbar from "./NavBar";
import './gamepage.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import nonogramData from '../nonogram.json';
import UserContext from '../userlogged';

export default function GamePage() {
  const params = useParams()
  const [nonograms, setNonograms] = useState(nonogramData['nonogram'][params.size])
  const [nonogramPuzzle, setNonogramPuzzle] = useState(nonograms[Math.floor(Math.random() * nonograms.length)])
  const [numRows] = useState(parseInt(params.size.split("x")[0]))
  const [numCols] = useState(parseInt(params.size.split("x")[1]))
  const [cluesRows, setCluesRows] = useState(Object.values(nonogramPuzzle)[0].clues_rows)
  const [cluesCols, setCluesCols] = useState(Object.values(nonogramPuzzle)[0].clues_cols)
  const [board, setBoard] = useState(Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => '0')));
  const [nonogramAnswers, setNonogramAnswers] = useState(Object.values(nonogramPuzzle)[0].board)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ownedHints, setOwnedHints] = useState(null);
  const [ownedChecks, setOwnedChecks] = useState(null);
  

  useEffect(() => {
    console.log(nonogramAnswers);
  },[])

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  
    const fetchOwnedHints = async () => {
      if (isLoggedIn === true) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/user/hints', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response) {
            setOwnedHints(response.data);
          }
        } 
        
        catch (error) {
          console.error("Error fetching owned hints:", error);
        }
      }
    };
    
    fetchOwnedHints();
  
  }, [isLoggedIn]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  
    const fetchOwnedChecks = async () => {
      if (isLoggedIn === true) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/user/checks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response) {
            setOwnedChecks(response.data);
          }
        } 
        
        catch (error) {
          console.error("Error fetching owned checks:", error);
        }
      }
    };
    
    fetchOwnedChecks();
  
  }, [isLoggedIn]);


  useEffect(() => {

    for (let i = 0; i < board.length; i++) {
      const row1 = board[i];
      const row2 = nonogramAnswers[i];
  
      for (let j = 0; j < row1.length; j++) {
        const cell1 = row1[j];
        const cell2 = row2[j];
  
        if (cell1 === 'x' && cell2 === 0) {
          continue;
        } else if (parseInt(cell1) !== cell2) {
          return;
        }
      }  
    }

    window.alert(`You Win! It's a ${Object.keys(nonogramPuzzle)[0]}.`)

  }, [board]);

  const boardUpdate = (rowIndex, colIndex) => {
    let tempboard = [...board]

    if (board[rowIndex][colIndex] === '0') {
      tempboard[rowIndex][colIndex] = '1';
    } else if (board[rowIndex][colIndex] === '1') {
      tempboard[rowIndex][colIndex] = 'x';
    } else if (board[rowIndex][colIndex] === 'x') {
      tempboard[rowIndex][colIndex] = '0';
    } else if (board[rowIndex][colIndex] === 'w') {
      tempboard[rowIndex][colIndex] = '0';
    }
    setBoard(tempboard)
  }

  const boardCheck  = async () => {
    const token = sessionStorage.getItem("token");
    let tempboard = [...board]

    if (ownedChecks >= 2 && isLoggedIn === true){
      for (let i = 0; i < board.length; i++) {
        const row1 = board[i];
        const row2 = nonogramAnswers[i];
    
        for (let j = 0; j < row1.length; j++) {
          const cell1 = row1[j];
          const cell2 = row2[j];
    
          if ((cell1 === '1' && cell2 === 0) || (cell1 === 'x' && cell2 === 1)) {
            tempboard[i][j] = 'w'
          }
        } 
      }

      setBoard(tempboard)
      console.log(board)

      const newOwnedChecks = ownedChecks - 2;
      setOwnedChecks(newOwnedChecks);

      try{
        const response = await axios.get('http://127.0.0.1:5000/user/UpdateChecks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
      });

      if (response) {
        console.log("Check updated on backend!");
      }

      else {
        console.error("Error updating checks:", response.status);
      }}

      catch (error) {
        console.error("Error calling backend:", error);
      }
    };

    if (ownedHints < 2 && isLoggedIn === true) {
      console.log("Not enough checks")
      // Need to display message
    }

    if (!isLoggedIn){
      console.log("Not Logged in for this feature")
      // Need to display message
    }

  }

  // - go thro answers Array
  // - for each 1 check if its on the board 
  // - if not add to another Array
  // - choose a random element from that array
  const boardHint = async () => {
    const token = sessionStorage.getItem("token");
    const possibleHints = [];
    if (ownedHints >= 2 && isLoggedIn === true){
      for (let i = 0; i < nonogramAnswers.length; i++) {
        const row = nonogramAnswers[i];
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          if (cell === 1 && board[i][j] !== '1') {
            possibleHints.push([i, j]);
          }
        } 
      }
      const hint = possibleHints[Math.floor(Math.random() * possibleHints.length)]
      let tempboard = [...board]
      tempboard[hint[0]][hint[1]] = '1'
      setBoard(tempboard)
      const newOwnedHints = ownedHints - 2;
      setOwnedHints(newOwnedHints);

      try{
        const response = await axios.get('http://127.0.0.1:5000/user/UpdateHints', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
      });

      if (response) {
        console.log("Hint updated on backend!");
      }

      else {
        console.error("Error updating hint:", response.status);
      }}

      catch (error) {
        console.error("Error calling backend:", error);
      }
    };

    if (ownedHints < 2 && isLoggedIn === true) {
      console.log("Not enough hints")
      // Need to display message
    }

    if (!isLoggedIn){
      console.log("Not Logged in for this feature")
      // Need to display message
    }
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
      scale = 35;
      break;
  }

  let spacing;
  switch (params.size) {
    case "5x5":
      spacing =[ "4.2rem", "104%"];
      break;
    case "10x10":
      spacing = ["4.3rem", "102%"];
      break;
    case "15x15":
      spacing = ["4.45rem", "101%"];
      break;
    case "20x20":
      spacing = ["4.3rem", "101%"];
      break;
  }
  
  return (
    <>
      <Navbar/>
      <div className="gamepage" style={{ transform: `scale(${scale}%)` }}>
        <div className="clues-cols" style={{ gap: spacing[0] }}>
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
              <div className="clues-rows" style={{ right: spacing[1] }}>
                {cluesRows[rowIndex].map((clue, clueIndex) => (
                  <span key={clueIndex}>{clue} </span>
                ))}
              </div>
              {/* Map over each cell in the row */}
              {row.map((cell, colIndex) => (
                <div key={colIndex} className={`grid-cell ${cell === '1' ? 'active' : ''} ${cell === 'w' ? 'wrong' : ''}`} onClick={() => boardUpdate(rowIndex, colIndex)}>{cell === 'x' ? 'x' : ''}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="btn-container">
        <button onClick={boardHint}>Hint</button>
        <button onClick={boardCheck}>Check</button>
      </div>
    </>
  );
}
