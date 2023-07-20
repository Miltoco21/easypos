// eslint-disable-next-line no-unused-vars
import React from "react";
import { Button } from "@mui/material";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Navegacion = () => {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/home">Easy POS LOGO</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Button href="/home">home</Button>
              <Button href="/login">Login</Button>
              <Button href="/registro">Registro</Button>
              <Button href="/usuarios">Usuarios</Button>
              <Button href="/precios">Precios</Button>
              <Button href="/proveedores">Proovedores</Button>

            

            </Nav>

            <Nav>
              {/* <Nav.Link href="/">Cerrar sesión</Nav.Link> */}
              

             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navegacion;
