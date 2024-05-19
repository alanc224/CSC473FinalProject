import React, { useState } from "react";
import {Link, useNavigate } from 'react-router-dom';
import Navbar from "./NavBar";

const PurchaseHint = ({ item }) => {
    const [purchaseState, setPurchaseState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState(null);
    const token = sessionStorage.getItem("token")
  
    const handlePurchase = async () => {
      setPurchaseState('processing'); 
      try {
        const response = await fetch('http://127.0.0.1:5000/purchaseItem=hints',{
          headers: {
            Authorization: `Bearer ${token}`
          },
          method: 'POST', 
          withCredentials: true
        });
  
        if (response.ok) {
          setPurchaseState('success');
        } 
        
        else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Purchase failed');
          setPurchaseState('error');
        }
      } 
      
      catch (error) {
        console.error('Error during purchase:', error);
        setErrorMessage('An error occurred. Please try again later.');
        setPurchaseState('error');
      }
    };
  
    return (
      <>
        <Navbar />
        <div>
          <h2>Purchase Confirmation</h2>
          <p>You are about to purchase a Hint for ${item === 'hint' ? 1 : '1'}</p>
          {purchaseState === 'processing' && <p>Processing purchase...</p>}
          {purchaseState === 'success' && <p>Purchase successful!</p>}
          {purchaseState === 'error' && <p className="error-message">{errorMessage}</p>}
          <button disabled={purchaseState !== 'idle'} onClick={handlePurchase}>
            {purchaseState === 'idle' ? 'Purchase Hint' : 'Processing...'}
          </button>
        </div>
      </>
    );
  };

export default PurchaseHint;