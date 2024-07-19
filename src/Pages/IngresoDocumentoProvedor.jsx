import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  ListItem,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchListDocumento from "../Componentes/SearchlistDocumento.jsx/SearchListDocumento";

const IngresoDocumentoProveedor = () => {
  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [folioDocumento, setFolioDocumento] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen200, setSnackbarOpen200] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchSnackbarOpen, setSearchSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTermProd, setSearchTermProd] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log("selectedProveedor", selectedProveedor);

  const setOpenSnackbar = (value) => {
    setSnackbarOpen(value);
  };

  const handleQuantityChange = (value, index) => {
    const updatedProducts = [...selectedProducts];
    // Parse the input value to an integer
    const parsedValue = parseInt(value);

    // Check if the parsed value is NaN or less than zero
    if (isNaN(parsedValue) || parsedValue < 0) {
      // If it's NaN or less than zero, set quantity and total to zero
      updatedProducts[index].cantidad = 0;
      updatedProducts[index].total = 0;
    } else {
      // Otherwise, update quantity and calculate total
      updatedProducts[index].cantidad = parsedValue;
      updatedProducts[index].total =
        parsedValue * updatedProducts[index].precio;
    }

    setSelectedProducts(updatedProducts);
  };

  const handleAddProductToSales = (product) => {
    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.id === product.idProducto
    );

    if (existingProductIndex !== -1) {
      // Producto ya existe, incrementar la cantidad
      const updatedProducts = selectedProducts.map((p, index) => {
        if (index === existingProductIndex) {
          const updatedQuantity = p.cantidad + 1;
          return {
            ...p,
            cantidad: updatedQuantity,
            total: updatedQuantity * p.precioCosto,
          };
        }
        return p;
      });
      setSelectedProducts(updatedProducts);
    } else {
      // Producto no existe, agregar como nuevo
      const newProduct = {
        id: product.idProducto,
        nombre: product.nombre,
        cantidad: 1,
        precio: product.precioCosto,
        total: product.precioCosto,
        precioCosto: product.precioCosto,
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }

    setSearchedProducts([]);
    setErrorMessage("");
  };

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "https://www.easypos.somee.com/api/Proveedores/GetAllProveedores"
        );
        setProveedores(response.data.proveedores);
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  const handleOpenModal = () => {
    setOpen(true);
    setSelectedProveedor("");
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarOpen200(false);
  };

  const handleSearch = () => {
    setSelectedProveedor("");
    if (searchText.trim() === "") {
      setSnackbarMessage("Campo vacío, ingresa proveedor ...");
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
      const filteredResults = proveedores.filter((proveedor) =>
        proveedor.razonSocial.toLowerCase().includes(searchText.toLowerCase()) ||
        proveedor.rut.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
  
      if (filteredResults.length === 0) {
        setSearchSnackbarOpen(true);
      } else {
        setSearchSnackbarOpen(false);
      }
    }
  };

  const handleChipClick = (result) => {
    setSelectedProveedor(result);
    setSearchResults([]);
    setSearchText("");
  };

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week");

  const handleSearchButtonClick = async () => {
    if (searchTermProd.trim() === "") {
      setSearchedProducts([]);
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }

    // Verificar si el término de búsqueda es numérico
    const isNumeric =
      !isNaN(parseFloat(searchTermProd)) && isFinite(searchTermProd);

    try {
      if (isNumeric) {
        // Si el término de búsqueda es numérico, buscar en el endpoint de código
        const responseByCodigo = await axios.get(
          `https://www.easypos.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${searchTermProd}&codigoCliente=${0}`
        );

        if (
          responseByCodigo.data &&
          responseByCodigo.data.cantidadRegistros > 0
        ) {
          handleSearchSuccess(responseByCodigo, "PLU");
        } else {
          // Si no se encuentran resultados por código numérico, buscar por descripción
          const responseByDescripcion = await axios.get(
            `https://www.easypos.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTermProd}&codigoCliente=${0}`
          );

          if (
            responseByDescripcion.data &&
            responseByDescripcion.data.cantidadRegistros > 0
          ) {
            handleSearchSuccess(responseByDescripcion, "Descripción");
          } else {
            // Si no hay resultados para la búsqueda por descripción, mostrar mensaje de error
            setSnackbarMessage(
              `No se encontraron resultados para "${searchTermProd}"`
            );
            setOpenSnackbar(true);
            setTimeout(() => {
              setOpenSnackbar(false);
            }, 3000);
          }
        }
      } else {
        // Si el término de búsqueda no es numérico, buscar directamente por descripción
        const responseByDescripcion = await axios.get(
          `https://www.easypos.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTermProd}&codigoCliente=${0}`
        );

        if (
          responseByDescripcion.data &&
          responseByDescripcion.data.cantidadRegistros > 0
        ) {
          handleSearchSuccess(responseByDescripcion, "Descripción");
        } else {
          // Si no hay resultados para la búsqueda por descripción, mostrar mensaje de error
          setSnackbarMessage(
            `No se encontraron resultados para "${searchTermProd}"`
          );
          setOpenSnackbar(true);
          setTimeout(() => {
            setOpenSnackbar(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setSnackbarMessage("Error al buscar el producto");
      setOpenSnackbar(true);

      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSearchSuccess = (response, searchType) => {
    if (response.data && response.data.cantidadRegistros > 0) {
      setSearchedProducts(response.data.productos);
      console.log("Productos encontrados", response.data.productos);
      setSearchTermProd("");
      setSnackbarOpen(true);
      setSnackbarMessage(`Productos encontrados (${searchType})`);
      setTimeout(() => {
        setSnackbarOpen200(false);
      }, 3000);
    } else if (response.data && response.data.cantidadRegistros === 0) {
      setSnackbarMessage(`No se encontraron resultados (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    } else {
      setSnackbarMessage(`Error al buscar el producto (${searchType})`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!tipoDocumento) {
        setErrorMessage("Por favor complete tipo de documento.");
        setLoading(false);
        return;
      }

      if (!folioDocumento) {
        setErrorMessage("Por favor complete campo folio.");
        setLoading(false);
        return;
      }else if (folioDocumento){
        setErrorMessage("");
      }

      if (!selectedProveedor) {
        setErrorMessage("No se ha seleccionado ningún proveedor.");
        setLoading(false);
        return;
      }
      if (selectedProducts.length === 0) {
        setErrorMessage("No se han seleccionado productos.");
        setLoading(false);
        return;
      }

      // Calculating total
      let total = 0;
      selectedProducts.forEach((product) => {
        total += product.total;
      });
      if (total === 0) {
        setErrorMessage("El total no puede ser cero.");
        setLoading(false);
        return;
      }
  

      const proveedorCompraDetalles = selectedProducts.map((product) => ({
        codProducto: product.id,
        descripcionProducto: product.nombre,
        cantidad: product.cantidad,
        precioUnidad: product.precio,
        costo: product.total,
      }));

      const dataToSend = {
        fechaIngreso: fecha.toISOString(),
        tipoDocumento: tipoDocumento,
        folio: folioDocumento,
        codigoProveedor: selectedProveedor.codigoProveedor,
        total: total,
        proveedorCompraDetalles,
      };

      console.log("Datos a enviar al servidor:", dataToSend);

      const response = await axios.post(
        "https://www.easypos.somee.com/api/Proveedores/AddProveedorCompra",
        dataToSend
      );

      console.log("Datos enviados al servidor:", response.data);

      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);

      setTipoDocumento("");
      setFolioDocumento("");
      setFecha(dayjs());
      setSearchText("");
      setSelectedProveedor(null);
      setAdditionalRows(1);
      setDescripcion("");
      setCantidad("");
      setSelectedProducts([]);
      setSearchResults([]);

      setErrorMessage("");
      setTimeout(() => {
        handleCloseModal();
      }, "2000");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setSnackbarMessage("Error al guardar los datos.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleFolioChange = (e) => {
    // Obtener la tecla presionada
    const keyPressed = e.key;

    // Verificar si la tecla presionada es un número o la tecla de retroceso (Backspace)
    const isValidKey = /^\d$/.test(keyPressed) || keyPressed === "Backspace";

    // Verificar si el valor actual del campo de entrada es negativo
    const isNegativeValue = e.target.value.startsWith("-");

    // Evitar que se ingrese números negativos o signos
    if (!isValidKey || isNegativeValue) {
      e.preventDefault();
    }
  };
  const grandTotal = selectedProducts.reduce(
    (total, product) => total + product.total,
    0
  );

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ my: 1, mx: 2 }}
          startIcon={<Add />}
          onClick={handleOpenModal}
        >
          Ingresa Documento de Compra
        </Button>

        <SearchListDocumento></SearchListDocumento>
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
              maxHeight: "90vh",
              maxWidth: "90vw",
            }}
          >
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <TextField
              select
              label="Tipo de documento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="Factura">Factura</MenuItem>
              <MenuItem value="Boleta">Boleta</MenuItem>
              <MenuItem value="Ticket">Ticket</MenuItem>
              <MenuItem value="Ingreso Interno">Ingreso Interno</MenuItem>
            </TextField>
            <TextField
              name="folioDocumento"
              label="Folio documento"
              value={folioDocumento}
              onKeyDown={handleFolioChange}
              onChange={(e) => setFolioDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de ingreso"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ mb: 2 }} />
                )}
                format="DD/MM/YYYY"
                minDate={inicioRango}
                maxDate={hoy}
                sx={{ mb: 2 }}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Buscar proveedor por nombre"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button onClick={handleSearch} variant="contained" sx={{ mb: 2 }}>
              Buscar
            </Button>
            <Box
              sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}
            >
              {searchResults.map((result) => (
                <Chip
                  key={result.codigoProveedor}
                  label={`${result.razonSocial} ${result.rut}`}
                  onClick={() => handleChipClick(result)}
                  sx={{
                    backgroundColor: "#2196f3",
                    margin: "5px",
                  }}
                />
              ))}
              {selectedProveedor && (
                <ListItem key={selectedProveedor.codigoCliente}>
                  <Chip
                    label={`${selectedProveedor.razonSocial} ${selectedProveedor.rut}`}
                    icon={<CheckCircleIcon />}
                    sx={{
                      backgroundColor: "#A8EB12",
                      margin: "5px",
                    }}
                  />
                </ListItem>
              )}
            </Box>

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
                  placeholder="Ingresa Código"
                  value={searchTermProd}
                  onChange={(e) => setSearchTermProd(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchButtonClick();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleSearchButtonClick}
                  sx={{ mx: 1 }}
                >
                  Buscar
                </Button>
              </Grid>
              {/* Agregar el bloque de código para los resultados de la búsqueda de productos */}
              <TableContainer
                component={Paper}
                style={{ overflowX: "auto", maxHeight: 200 }}
              >
                <Table>
                  <TableBody>
                    {searchedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ width: "21%" }}>
                          {product.nombre}
                        </TableCell>
                        <TableCell sx={{ width: "21%" }}>
                          Plu: {product.idProducto}
                        </TableCell>
                        <TableCell sx={{ width: "21%" }}>
                          Precio Costo: {product.precioCosto}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleAddProductToSales(product)}
                            variant="contained"
                            color="secondary"
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fin del bloque de código para los resultados de la búsqueda de productos */}
              <TableContainer
                component={Paper}
                style={{ overflowX: "auto", maxHeight: 200 }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "23%" }}>Descripción</TableCell>
                      <TableCell sx={{ width: "23%" }}>Precio Costo</TableCell>
                      <TableCell sx={{ width: "23%" }}>Cantidad</TableCell>
                      <TableCell sx={{ width: "23%" }}>Total</TableCell>
                      <TableCell sx={{ width: "20%" }}>Eliminar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.nombre}</TableCell>
                        <TableCell>{product.precioCosto}</TableCell>
                        <TableCell>
                          <TextField
                            value={product.cantidad}
                            onChange={(e) =>
                              handleQuantityChange(e.target.value, index)
                            }
                            InputProps={{
                              maxLenght: 3,
                            }}
                          />
                        </TableCell>
                        <TableCell>{product.total}</TableCell>
                        <TableCell>
                          <IconButton
                            
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TextField
                label="Total"
                value={grandTotal}
                sx={{ mt: 3 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Guardar
            </Button>
          </Box>
        </Modal>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Snackbar
          open={snackbarOpen200}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={errorMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Snackbar
          open={searchSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSearchSnackbarOpen(false)}
          message="No se encontraron resultados"
        />
      </Box>
    </div>
  );
};

export default IngresoDocumentoProveedor;
