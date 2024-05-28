/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import Stepperproductos from "../Componentes/Stepper/Stepperproductos";
import Stepper2 from "../Componentes/Stepper/Stepper2";
import { Stepper } from "@mui/material";
import StepperNO from "../Componentes/Stepper/StepperNo";
import StepperSI from "../Componentes/Stepper copy/StepperSI";
import SearchListProducts from "../Componentes/Productos/SearchListProduct";

const Productos = () => {
  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);

  const handleOpenStepper = () => {
    setOpen(true);
  };
  const handleCloseStepper = () => {
    setOpen(false);
  };

  const handleOpenStepper2 = () => {
    setOpen2(true);
  };
  const handleCloseStepper2 = () => {
    setOpen2(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
          onClick={handleOpenStepper}
        >
          + Producto sin código
        </Button>
        {/* <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
          onClick={handleOpenStepper2}
        >
          + Producto con código
        </Button> */}

        <SearchListProducts/>

        <Modal open={open} onClose={handleCloseStepper}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "100vh", // Adjust as needed
              maxWidth: "180vw", // Adjust as needed
            }}
          >
           <StepperSI/> 
          </Box>
        </Modal>

        <Modal open={open2} onClose={handleCloseStepper2}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "100vh", // Adjust as needed
              maxWidth: "180vw", // Adjust as needed
            }}
          >
            <StepperSI />
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default Productos;
