import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const defaultTheme = createTheme();

const PreciosGenerales = ({ onClose }) => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchClienteTerm, setSearchClienteTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para mantener el producto seleccionado

  const handleSearchCliente = (e) => {
    setSearchClienteTerm(e.target.value);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, clientes.length);
  const clientesPaginados = clientes.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_API2}/Clientes/GetAllClientes`
        );
        setClientes(response.data.cliente);
        console.log("clientes:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedClientes(clientes);
    } else {
      setSelectedClientes([]);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  // const handleCheckboxChange = (cliente) => {
  //   const selectedIndex = selectedClientes.findIndex(
  //     (selectedCliente) =>
  //       selectedCliente.codigoCliente === cliente.codigoCliente
  //   );

  //   let newSelectedClientes = [];

  //   if (selectedIndex === -1) {
  //     newSelectedClientes = newSelectedClientes.concat(
  //       selectedClientes,
  //       cliente
  //     );
  //   } else if (selectedIndex === 0) {
  //     newSelectedClientes = newSelectedClientes.concat(
  //       selectedClientes.slice(1)
  //     );
  //   } else if (selectedIndex === selectedClientes.length - 1) {
  //     newSelectedClientes = newSelectedClientes.concat(
  //       selectedClientes.slice(0, -1)
  //     );
  //   } else if (selectedIndex > 0) {
  //     newSelectedClientes = newSelectedClientes.concat(
  //       selectedClientes.slice(0, selectedIndex),
  //       selectedClientes.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedClientes(newSelectedClientes);
  // };
  const handleCheckboxChange = (cliente) => {
    const selectedIndex = selectedClientes.findIndex(
      (selectedCliente) =>
        selectedCliente.codigoCliente === cliente.codigoCliente
    );
  
    let newSelectedClientes = [];
  
    if (selectedIndex === -1) {
      newSelectedClientes = newSelectedClientes.concat(
        selectedClientes,
        cliente
      );
    } else if (selectedIndex === 0) {
      newSelectedClientes = newSelectedClientes.concat(
        selectedClientes.slice(1)
      );
    } else if (selectedIndex === selectedClientes.length - 1) {
      newSelectedClientes = newSelectedClientes.concat(
        selectedClientes.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedClientes = newSelectedClientes.concat(
        selectedClientes.slice(0, selectedIndex),
        selectedClientes.slice(selectedIndex + 1)
      );
    }
  
    setSelectedClientes(newSelectedClientes);
  
    // Actualizar los códigos de cliente seleccionados
    const selectedClientCodes = newSelectedClientes.map(
      (cliente) => cliente.codigoCliente
    );
    setSelectedClientCodes(selectedClientCodes);
    console.log("selectedClientCodes:", selectedClientCodes);
  };
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/ProductosTmp/GetProductos`,
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
      setProducts([])
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTerm}&codigoCliente=${0}`
      );
      if (response.data && response.data.cantidadRegistros > 0) {
        setProducts(response.data.productos);
      } else {
        setProducts([])
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
        categoria:
          selectedProduct.categoria === "" ? 0 : selectedProduct.categoria,
        subCategoria:
          selectedProduct.subCategoria === ""
            ? 0
            : selectedProduct.subCategoria,
        familia: selectedProduct.familia === "" ? 0 : selectedProduct.familia,
        subFamilia:
          selectedProduct.subFamilia === "" ? 0 : selectedProduct.subFamilia,
      };

      const response = await axios.put(
        `${apiUrl}/ProductosTmp/UpdateProducto`,
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

      if (response.data.statusCode === 200) {
        setSuccessMessage("Precio editado exitosamente");
        setOpenSnackbar(true);
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

  // Función para manejar el clic del botón "Asociar"
  const handleAsociarClick = async () => {
    try {
      // Obtener el producto seleccionado desde la lista de productos

      const selectedClientCodes = selectedClientes.map(
        (cliente) => cliente.codigoCliente
      );
      console.log("selectedClientCodes:", selectedClientCodes);
      // Verificar si el producto seleccionado existe
      if (!selectedProduct) {
        setErrorMessage("Seleccione un producto válido");
        setOpenSnackbar(true);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/ProductosTmp/AsociarProductoCliente`,
        {
          idProducto: selectedProduct.idProducto,
          nombre: selectedProduct.nombre,
          precioCosto: selectedProduct.precioCosto,
          precioVenta: selectedProduct.precioVenta,
          codigoCliente: selectedClientCodes,
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Producto asociado exitosamente");
        setOpenSnackbar(true);
        setOpenDialog(false)
       
      
      
           
      } else {
        setErrorMessage("Error al asociar producto");
        setOpenSnackbar(true);
      }

      // Resto del código para asociar el producto con los clientes...
    } catch (error) {
      console.error("Error al asociar producto:", error);
      setErrorMessage("Error al asociar producto");
      setOpenSnackbar(true);
    }
  };

  console.log("selectedproduct", selectedProduct);

  useEffect(() => {
    const filtered = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchClienteTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
  }, [searchClienteTerm, clientes]);

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
                          onClick={() => handleProductSelection(product)}
                          variant="contained"
                          color="error"
                        >
                          Asociar
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
      <Dialog
        sx={{ width: "90%" }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Asociación de precios</DialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Buscar cliente"
              value={searchClienteTerm}
              onChange={handleSearchCliente}
            />
            {filteredClientes.length > 0 && (
              <TableContainer component={Paper}>
                <Table aria-label="Clientes table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Correo</TableCell>
                      <TableCell>Teléfono</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClientes.map((cliente) => (
                      <TableRow key={cliente.codigoCliente}>
                        <TableCell>
                          <Checkbox
                            checked={selectedClientes.includes(cliente)}
                            onChange={() => handleCheckboxChange(cliente)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          {cliente.nombre}
                          <br />
                          {cliente.rut}
                        </TableCell>
                        <TableCell>{cliente.correo}</TableCell>
                        <TableCell>{cliente.telefono}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                 
                </Grid>
              </TableContainer>
            )}
            <TablePagination
              component="div"
              count={clientes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPageOptions={[]}
              labelRowsPerPage="Por página"
            />
          </Grid>
        </DialogContent>
        <DialogActions>
        <Button
                    sx={{ margin: "1px" }}
                    variant="contained"
                 
                    color="secondary"
                    onClick={handleAsociarClick}
                  >
                    Guardar asociacion
                  </Button>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
