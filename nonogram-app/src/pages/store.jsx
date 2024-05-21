import React, { useState } from "react";
import {Link, useNavigate } from 'react-router-dom';
import Navbar from "./NavBar";
import './store.css';

const Store = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [purchaseError, setPurchaseError] = useState(null);
    const navigate = useNavigate();

    const handlePurchase = async () => {
        if (!selectedItem) 
            return;
        setPurchaseError(null);
    
        try {
            const response = await fetch('/purchase?item=' + selectedItem, {
              method: 'POST',
            });
      
            if (response.ok) {
              setSelectedItem(null);
              alert('Hint purchased successfully!');
            } 
            
            else {
              const errorData = await response.json();
              setPurchaseError(errorData.message || 'Purchase failed');
            }
          } 
          
          catch (error) {
            console.error('Error during purchase:', error);
            setPurchaseError('An error occurred. Please try again later.');
          }
        };

    return (
        <>
            <Navbar />
            <div className="store" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Store</h1>
                <div className="store-item">
                    <h2>Check - $1</h2>
                    <Link to="/purchaseItem=checks">
                        <button className="purchase-button">Purchase Check</button>
                    </Link>
                </div>
                <div className="store-item" style={{ marginTop: '20px' }}>
                    <h2>Hint - $1</h2>
                    <Link to='/purchaseItem=hints'>
                        <button className="purchase-button">Purchase Hint</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Store;
