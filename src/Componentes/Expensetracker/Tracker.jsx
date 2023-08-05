/* eslint-disable no-unused-vars */
import React, { useState } from "react";


const Tracker = () => {
  const [totalAmount, setTotalAmount] = useState(1000);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handlePayment = (amount) => {
    setPaymentAmount(amount);
    setTotalAmount(totalAmount - amount);
  };
  return (
    <div>
      <h1>Credit Score App</h1>
      <p>Total Amount: ${totalAmount}</p>
      <p>Payment Amount: ${paymentAmount}</p>
      <button onClick={() => handlePayment(totalAmount)}>Pay Total Amount</button>
      <button onClick={() => handlePayment(totalAmount / 2)}>Pay Half Amount</button>
    </div>
  )
}

export default Tracker
