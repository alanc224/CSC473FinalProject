import React, { } from "react";
import {Link} from 'react-router-dom';
import Navbar from "./NavBar";
import './store.css';

const Store = () => {

    return (
        <>
            <Navbar />
            <div className="store" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Store</h1>
                <div className="store-item">
                    <h2>Check - $1</h2>
                    <Link to="/purchase?item=check">
                        <button className="purchase-button">Purchase Check</button>
                    </Link>
                </div>
                <div className="store-item" style={{ marginTop: '20px' }}>
                    <h2>Hint - $1</h2>
                    <Link to="/purchase?item=hint">
                        <button className="purchase-button">Purchase Hint</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Store;