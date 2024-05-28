import React, { useState } from "react";
import Box from "@mui/material/Box";
import Navegacion from "../Componentes/NavBar/Navegacion";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import IngresoPV from "../Componentes/Proveedores/IngresoPV";
import IngresoCL from "../Componentes/Proveedores/IngresoCL";
import Familias from "../Componentes/Familias/Familias";
import SideBar from "../Componentes/NavBar/SideBar";
import SearchListProveedores from "../Componentes/Proveedores/SearchListProveedores";

const Proveedores = () => {
  const [open, setOpen] = useState(false);
  const [openCL, setOpenCL] = useState(false);
  const text = "Proovedores";
  const uppercaseText = text.toUpperCase();

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOpenModalCL = () => {
    setOpenCL(true);
  };

  const handleCloseModalCL = () => {
    setOpenCL(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          {uppercaseText}
        </Button>
        {/* CLIENTES Button */}
        {/* <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModalCL}
        >
          CLIENTES
        </Button> */}

        <SearchListProveedores />

        <Box />

        {/* Modal for IngresoPV */}
        <Modal open={open} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto",
              maxHeight: "100vh",
              maxWidth: "180vw",
            }}
          >
            <IngresoPV onClose={handleCloseModal} />
          </Box>
        </Modal>

        {/* Modal for IngresoCL */}
        <Modal open={openCL} onClose={handleCloseModalCL}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto",
              maxHeight: "100vh",
              maxWidth: "180vw",
            }}
          >
            <IngresoCL onClose={handleCloseModalCL} />
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default Proveedores;