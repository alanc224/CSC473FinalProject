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
        <Link to="/store">
          <a>Store</a>
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
          background-color: #F2BED1;
          color: #fff;
          box-sizing: border-box;
        }
        a {
          color: black;
          text-decoration: none;
          font-size: 1.6rem;
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
