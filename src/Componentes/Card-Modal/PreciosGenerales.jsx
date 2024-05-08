import React, { useState, useEffect } from "react";
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
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const defaultTheme = createTheme();

const PreciosGenerales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
        );
        setProducts(response.data.productos);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al buscar el producto por descripción");
        setOpenSnackbar(true);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("El campo de búsqueda está vacío");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}&codigoCliente=${0}`
      );
      if (response.data && response.data.cantidadRegistros > 0) {
        setProducts(response.data.productos);
      } else {
        setErrorMessage(`No se encontraron resultados para "${searchTerm}"`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setErrorMessage("Error al buscar el producto");
      setOpenSnackbar(true);
    }
  };

  const handleSelectProduct = (index) => {
    setSelectedProductIndex(index); // Actualiza el índice del producto seleccionado
  };

  const handlePrecioChange = (e, index) => {
    const { value } = e.target;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        precioVenta: value,
      };
      return updatedProducts;
    });
  };
  
  const handleGuardarClick = async () => {
    // Verifica si hay un producto seleccionado
    if (products.length > 0) {
      try {
        const selectedProduct = products[selectedProductIndex];
        console.log("Datos antes de la actualización:", selectedProduct);

        const response = await axios.put(
          "https://www.easyposdev.somee.com/api/ProductosTmp/UpdateProducto",
          {
            idProducto: selectedProduct.id,
            nombre: selectedProduct.nombre,
            precioVenta: selectedProduct.precioVenta,
            bodega: selectedProduct.bodega, // Agrega los demás campos aquí
            impuesto: selectedProduct.impuesto,
            marca: selectedProduct.marca,
            nota: selectedProduct.nota,
            proveedor: selectedProduct.proveedor,
            // Agrega otros campos necesarios
          }
        );
        console.log("Respuesta del servidor:", response.data);
        // Aquí puedes agregar lógica adicional si es necesario, como mostrar un mensaje de éxito
        if (response.status === 201) {
          setSuccessMessage("Precio editado exitosamente");
          setOpenSnackbar(true);
        }
        console.log("Datos después de la actualización:", response.data);

      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        setErrorMessage("Error al actualizar el producto");
        setOpenSnackbar(true);
      }
    } else {
      console.error("No hay ningún producto seleccionado");
      // Agrega lógica adicional si es necesario, como mostrar un mensaje de error
    }
  };
  
  
  
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container justifyContent="center" sx={{ width: 650 }}>
        <Grid item xs={12} md={10} lg={10}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Precios Generales
            </Typography>
            <div style={{ alignItems: "center" }}>
              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: "flex", margin: 1 }}>
                <InputLabel
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Buscador de productos
                </InputLabel>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{
                  margin: 1,
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <TextField
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                  }}
                  fullWidth
                  focused
                  placeholder="Ingresa Búsqueda"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  sx={{
                    width: "30%",
                    margin: "1px",
                    backgroundColor: " #283048",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1c1b17 ",
                      color: "white",
                    },
                  }}
                  onClick={handleSearchButtonClick}
                >
                  Buscar
                </Button>
              </Grid>
            </div>

            <TableContainer
              component={Paper}
              style={{ overflowX: "auto", maxHeight: 500 }}
            >
              <Table>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell>
                        <TextField
                          name="precio"
                          variant="outlined"
                          fullWidth
                          value={product.precioVenta}
                          onChange={(e) => handlePrecioChange(e, index)} // Actualiza el precio específico del producto
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                           onClick={handleGuardarClick} /// Selecciona el producto por su índice
                          variant="contained"
                          color="secondary"
                        >
                          Guardar
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        {successMessage ? (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </ThemeProvider>
  );
};

export default PreciosGenerales;