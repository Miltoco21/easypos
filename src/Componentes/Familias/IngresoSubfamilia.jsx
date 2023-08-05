/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const IngresoSubfamilia = ({ onSave }) => {
  const [subFamilia, setSubFamilia] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ subFamilia });
    setSubFamilia("");
  };


  return (
    <form onSubmit={handleSubmit}>
    <TextField
      type="text"
      value={subFamilia}
      onChange={(e) => setSubFamilia(e.target.value)}
      label="Sub-Familia"
      variant="outlined"
    />
    <Button type="submit" variant="contained" color="primary">
      Agregar Sub-Familia
    </Button>
  </form>

  );
};

export default IngresoSubfamilia;
