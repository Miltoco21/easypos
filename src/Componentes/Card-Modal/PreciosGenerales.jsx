/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TablaNivel from "./TablaNivel";

import Textarea from "@mui/joy/Textarea";
import PercentIcon from "@mui/icons-material/Percent";
import IconButton from "@mui/material/IconButton";

import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

import { Tooltip } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import TablaPrecios from "./TablaPrecios";

export const defaultTheme = createTheme;

const PreciosGenerales = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}`
        );
        setProducts(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al buscar el producto por descripción");
      }
    };

    if (searchTerm.trim() !== "") {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const handleSelectProduct = (product) => {
    onSelectProduct(product);
    setSearchTerm(""); // Limpiar el término de búsqueda después de seleccionar un producto
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "90vh", width: "190vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={2}
          sm={8}
          md={14}
          component={Paper}
          elevation={24}
          square
        >
          <Box
            sx={{
              my: 1,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4>Precios Generales</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={11}>
                  <Paper
                    elevation={1}
                    style={{
                      background: "#859398",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "5px",
                    }}
                  >
                    <TextField
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        marginBottom: "10px",
                      }}
                      fullWidth
                      placeholder="Buscar por descripción"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {errorMessage && (
                      <Typography variant="body4" color="error">
                        {errorMessage}
                      </Typography>
                    )}
                    <TableContainer
                      component={Paper}
                      style={{ overflowX: "auto", maxHeight: "200px" }}
                    >
                      <Table>
                        <TableHead
                          style={{ background: "white", height: "30%" }}
                        >
                          <TableRow>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Plu</TableCell>
                            <TableCell>Agregar</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.nombre}</TableCell>
                              <TableCell>{product.idProducto}</TableCell>
                              <TableCell>{product.precioCosto}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleSelectProduct(product)}
                                >
                                  Agregar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" sx={{ marginRight: "8px" }}>
                      Precio de costo
                    </Typography>
                    <TextField id="precioCosto" size="small" />{" "}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Button
                      size="md"
                      variant="contained"
                      sx={{ marginRight: "8px" }}
                    >
                      Agregar
                      <PercentIcon />
                    </Button>
                    <TextField id="porcentaje" size="small" />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Button
                      size="md"
                      variant="contained"
                      sx={{ marginRight: "8px" }}
                    >
                      Agregar <AttachMoneyIcon />
                    </Button>
                    <TextField id="precio" size="small" />
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginTop: "15px" }}
                  >
                    <Typography variant="body1" sx={{ marginRight: "8px" }}>
                      Precio final de venta
                    </Typography>
                    <TextField id="precioCosto" size="small" /> <br />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginTop: "15px" }}
                  >
                    <TablaNivel />
                    <TablaPrecios />
                  </Box>
                </Grid>
              </Grid>

              <Button
                type="submit"
                size="md"
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
              >
                guardar Precio
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
