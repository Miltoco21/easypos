/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import Stepperproductos from "../Componentes/Stepper/Stepperproductos";




const Productos = () => {
  
  

  
  return (
    <div style={{ display: "flex" }}>
      
      <SideBar />
      <Stepperproductos/>

      <Box  sx={{ flexGrow: 1, p: 3 }}>
       
       
        
        
        

       
        

       
      </Box>
    </div>
  )
}

export default Productos