import React, { } from "react";
import {Link} from 'react-router-dom';
import LoginPage from "./loginpage";


const Navbar = () => {
  return (
    <nav>
      <div className="left">
        <Link to="/">
          <a>Home</a>
        </Link>
      </div>
      <div className="middle">
        <Link to="/leaderboard">
          <a>Daily Leaderboard</a>
        </Link>
      </div>
      <div className="right">
        <Link to="/login">
          <a>Log-in</a>
        </Link>
      </div>
      
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px;
          background-color: #F2BED1;
          color: #fff;
          box-sizing: border-box;
        }
        a {
          color: black;
          text-decoration: none;
        }
        .left, .middle, .right {
          flex: 1;
          text-align: center;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
