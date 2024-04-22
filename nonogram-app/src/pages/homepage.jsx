import React, { } from "react";
 
import {Link} from 'react-router-dom';
 
export default function HomePage(){
 
  return (
    <div>
        <div className="container h-100">
            <div className="row h-100">
                <div className="col-12">
                    <h1>Welcome to this React Application</h1>
                    <p><Link to="/login" className="btn btn-success">Login</Link> | <Link to="/register" className="btn btn-success">Register</Link> </p>
                </div>
            </div>
        </div>
    </div>
  );
}