/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
/* eslint-disable react/prop-types */


const CeldaEditable = ({ value, onSave }) => {

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSaveClick = () => {
    onSave(inputValue);
    setEditing(false);
  };

  const handleCancelClick = () => {
    setInputValue(value);
    setEditing(false);
  };


  return editing ? (
    <div>
    <TextField value={inputValue} onChange={handleInputChange} />
    <Button variant="contained" color="primary" onClick={handleSaveClick}>
      Save
    </Button>
    <Button variant="contained" color="secondary" onClick={handleCancelClick}>
      Cancel
    </Button>
  </div>
  ) : (
    <div>
      {value}{" "}
      <Button variant="contained" color="primary" onClick={() => setEditing(true)}>
        Edit
      </Button>
    </div>
  );
}

export default CeldaEditable
