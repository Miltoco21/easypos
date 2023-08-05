/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const IngresoItem = ({ onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, price: parseFloat(price) });
    setName("");
    setPrice("");
  };


  return (
    <form onSubmit={handleSubmit}>
    <TextField
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      label="Enter item name"
      variant="outlined"
    />
    <TextField
      type="text"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      label="Enter item price"
      variant="outlined"
    />
    <Button type="submit" variant="contained" color="primary">
      Add Item
    </Button>
  </form>
  )
}

export default IngresoItem