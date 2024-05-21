# GRIDDLE
CSC 473 Website Design Final Project <br>
By: Team Null

[Griddle](https://griddle-csc-473-final-project.vercel.app/) is an aesthetically fun, user-friendly nonogram puzzle game web application, designed for puzzle lovers and people looking for some casual brain-stimulating game. (shown below) <br>
![Screenshot 2024-05-20 222809](https://github.com/alanc224/CSC473FinalProject/assets/80214490/262d94be-d9e2-44df-900a-7a80b4f52445)

## Project Description
##### Problem Statement
Have you ever been bored and wanted to play a stimulating game? For example, you are taking the MTA trains in NYC and you are bored on your phone.
##### Our Solution
We aim to create a user-friendly nonogram puzzle game web application. Based on the hints on the top and left of the grid, players can solve the puzzle shown as an interactive grid. We chose this topic because it seemed like a fun logic puzzle game and an interesting challenge to implement.

## Technologies
- Frontend
  - Framework: Flask
  - Language: Python
- Backend
  - Framework: React
  - Language: Javascript
- Database
  - PostgresSQL (Relational Database)
- Github


## Nonogram Game Design

- Created big JSON file to store all the nonogram puzzles
- Formatted into objects of different sizes
  - 5x5, 10x10, 15x15, 20x20
- 2D arrays for the row clues, column clues, and answers 


## API Implementation

- We utilized the Stripe API to handle payment in our application.
- When users choose to purchase a check or a hint, the api will generate a unique one time use purchase link for the user to buy the digital good.
- This allows us a hands off approach when dealing with user’s credit/debit card information.


## Demo

https://griddle-csc-473-final-project.vercel.app/

## Contact
<b>Team Null<b>
- Zuhayer Alvi
- Alan Concepcion
- Daphne Tang
