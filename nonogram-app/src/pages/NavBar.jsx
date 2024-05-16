import React, { useContext  } from "react";
import {Link} from 'react-router-dom';
import LoginPage from "./loginpage";
import UserContext from '../userlogged';
import Logout from './logout';


const Navbar = () => {
  const { isLoggedIn, updateLoginStatus } = useContext(UserContext);
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
      {isLoggedIn ? (
          <Link to="/logout" onClick={(event) => {
            event.preventDefault();
            updateLoginStatus(false);
            this.props.handleLogout?.();
          }}>
            <a>Log-out</a>
          </Link>
        ) : (
          <Link to="/login">
            <a>Log-in</a>
          </Link>
        )}
      </div>
      
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px;
          background-color: #333;
          color: #fff;
          box-sizing: border-box;
        }
        a {
          color: white;
          text-decoration: none;
          font-size: 1.8rem;
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
