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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const defaultTheme = createTheme();

const PreciosGenerales = ({onClose}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
        );
        setProducts(response.data.productos);
        console.log(response.data.productos);
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

  const handleGuardarClick = async (selectedProduct) => {
    try {
      console.log("Datos antes de la actualización:", selectedProduct);
  
      const editedProduct = {
        ...selectedProduct,
        categoria: selectedProduct.categoria === "" ? 0 : selectedProduct.categoria,
        subCategoria: selectedProduct.subCategoria === "" ? 0 : selectedProduct.subCategoria,
        familia: selectedProduct.familia === "" ? 0 : selectedProduct.familia,
        subFamilia: selectedProduct.subFamilia === "" ? 0 : selectedProduct.subFamilia,
      };
  
      const response = await axios.put(
        "https://www.easyposdev.somee.com/api/ProductosTmp/UpdateProducto",
        {
          idProducto: editedProduct.idProducto,
          nombre: editedProduct.nombre,
          categoria: editedProduct.categoria,
          subCategoria: editedProduct.subCategoria,
          familia: editedProduct.familia,
          subFamilia: editedProduct.subFamilia,
          precioVenta: editedProduct.precioVenta,
          bodega: editedProduct.bodega,
          impuesto: editedProduct.impuesto,
          marca: editedProduct.marca,
          nota: editedProduct.nota,
          proveedor: editedProduct.proveedor,
        }
      );
  
      console.log("Respuesta del servidor:", response.data);
  
      if (response.data.statusCode === 201) {
        setSuccessMessage("Precio editado exitosamente");
        setOpenSnackbar(true);
        // Actualizar la lista de productos después de la edición
        // const updatedProducts = products.map((product) => {
        //   if (product.id === editedProduct.id) {
        //     return editedProduct;
        //   } else {
        //     return product;
        //   }
        // });
        // setProducts(updatedProducts);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setErrorMessage("Error al actualizar el producto");
      setOpenSnackbar(true);
    }
  };
  
  

  const handleEliminarClick = (product) => {
    setProductToDelete(product); 
    setOpenDialog(true); 
  };

  const confirmarEliminar = async () => {
    setOpenDialog(false); 
  
    try {
      console.log("ID del producto a eliminar:", productToDelete.idProducto); // Usar el nombre correcto del campo del ID
  
      const response = await axios.delete(
        `https://www.easyposdev.somee.com/api/ProductosTmp/DeleteProducto?id=${productToDelete.idProducto}` // Usar el nombre correcto del campo del ID
      );
  
      if (response.status === 200) {
        setSuccessMessage("Producto eliminado exitosamente");
        setOpenSnackbar(true);
        const updatedProducts = products.filter(product => product.idProducto !== productToDelete.idProducto); // Usar el nombre correcto del campo del ID
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setErrorMessage("Error al eliminar el producto");
      setOpenSnackbar(true);
      setTimeout(() => {
        onClose();
      }, 2000);
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
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{ display: "flex", margin: 1 }}
              >
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
                          onChange={(e) => handlePrecioChange(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleGuardarClick(product)}
                          variant="contained"
                          color="secondary"
                        >
                          Guardar
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEliminarClick(product)}
                          variant="contained"
                          color="error"
                        >
                          Eliminar
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
      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmarEliminar} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
