/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const IngresoFamilia = ({onSave}) => {
  const [productName, setProductName] = useState("");

  const handleSave = () => {
    onSave({ name: productName });
    setProductName("");
  };

  return (
    <div>
      <TextField
        label="Ingresa"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default IngresoFamilia
