import React from 'react';

const Pop = ({ card, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>Card Details</h3>
        <p>{card.text}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Pop;