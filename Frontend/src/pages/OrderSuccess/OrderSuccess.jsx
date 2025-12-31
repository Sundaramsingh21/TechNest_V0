import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="tick-animation">
          <svg viewBox="0 0 100 100" className="tick-svg">
            <circle className="tick-circle" cx="50" cy="50" r="45" />
            <path className="tick-check" d="M30 53 L45 70 L70 40" />
          </svg>
        </div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for shopping with us. Your order has been placed successfully.</p>
        <button className="order-button" onClick={() => {
        navigate('/myorders');
        window.location.reload();
       }}>
          Go to My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
