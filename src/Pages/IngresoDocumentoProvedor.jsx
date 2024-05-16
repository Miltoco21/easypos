import React, { useState, useEffect } from "react";
import {
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

const IngresoDocumentoProveedor = () => {
  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [folioDocumento, setFolioDocumento] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(1);
  const [items, setItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la visibilidad del snackbar

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
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
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleAgregarItem = () => {
    setAdditionalRows(additionalRows + 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSearch = () => {
    setSelectedProveedor("");
    if (searchText.trim() === "") {
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false); // Cierra el snackbar si el campo no está vacío
      const filteredResults = proveedores.filter((proveedor) =>
        proveedor.nombreResponsable
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };

  const handleChipClick = (result) => {
    setSelectedProveedor(result);
    setSearchResults([]);
    setSearchText("");
  };

  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week");
  const handleKeyDown = (event, field) => {
    if (field === "marca") {
      const regex = /^[a-zA-Z]*$/;
      if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }
    if (field === "nombre") {
      const regex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\s]+$/; // Al menos un carácter alfanumérico
      if (
        !regex.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== " "
      ) {
        event.preventDefault();
        setEmptyFieldsMessage(
          "El nombre no puede consistir únicamente en espacios en blanco."
        );
        setSnackbarOpen(true);
      }
    }
    if (field === "numeroCuenta") {
      // Permitir solo dígitos numéricos y la tecla de retroceso
      if (!/^\d+$/.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
      }
    }

    if (field === "rut") {
      // Validar si la tecla presionada es un signo menos, un número, la letra 'k' o 'K', el guion '-' o la tecla de retroceso
      const allowedCharacters = /^[0-9kK-]+$/i; // Corregida para permitir el guion
      if (!allowedCharacters.test(event.key)) {
        // Verificar si la tecla presionada es el retroceso
        if (event.key !== "Backspace") {
          event.preventDefault(); // Prevenir la entrada de caracteres no permitidos
        }
      }
    }
    if (event.key === "Enter") {
      event.preventDefault();
    }
    if (field === "cantidadPagada") {
      // Validar si la tecla presionada es un dígito o la tecla de retroceso
      const isDigitOrBackspace = /^[0-9\b]+$/;
      if (!isDigitOrBackspace.test(event.key)) {
        event.preventDefault(); // Prevenir la entrada de caracteres no permitidos
      }

      // Obtener el valor actual del campo cantidadPagada
      const currentValue = parseFloat(cantidadPagada);

      // Validar si el nuevo valor sería menor que el grandTotal
      if (currentValue * 10 + parseInt(event.key) < grandTotal * 10) {
        event.preventDefault(); // Prevenir la entrada de un monto menor al grandTotal
      }
    }
  };
  const handleSubmit = async () => {
    // Muestra los datos antes de guardar
    console.log("Datos antes de guardar:");
    console.log({
      tipoDocumento,
      folioDocumento,
      fecha,
      searchText,
      selectedProveedor,
      items
    });
  
    try {
      // Verifica si se ha seleccionado un proveedor antes de continuar
      if (!selectedProveedor) {
        console.error('Error: No se ha seleccionado ningún proveedor.');
        return;
      }
  
      // Construye el objeto de datos a enviar al API
      const dataToSend = {
        fechaIngreso: new Date().toISOString(),
        tipoDocumento,
        folio: folioDocumento,
        codigoProveedor: selectedProveedor.codigoProveedor,
        total: items.reduce((total, item) => total + parseFloat(item.total), 0),
        proveedorCompraDetalles: items.map(item => ({
          codProducto: item.codProducto || 0,
          descripcionProducto: item.descripcion || '',
          cantidad: parseInt(item.cantidad) || 0,
          precioUnidad: parseFloat(item.precioUnidad) || 0,
          costo: parseFloat(item.costo) || 0
        }))
      };
  
      // Envía la información al API
      const response = await axios.post('https://www.easyposdev.somee.com/api/Proveedores/AddProveeedorCompra', dataToSend);
  
      // Muestra la respuesta del API
      console.log("Respuesta del API:");
      console.log(response.data);
  
      // Muestra los datos después de guardar
      console.log("Datos después de guardar:");
      console.log({
        tipoDocumento,
        folioDocumento,
        fecha,
        searchText,
        selectedProveedor,
        items
      });
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
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
              onKeyDown={(event) => handleKeyDown(event, "nombre")}
              label="Folio documento"
              value={folioDocumento}
              onChange={(e) => setFolioDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ mb: 2 }} />
                )}
                format="DD/MM/YYYY" // Formato día/mes/año
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
                  label={result.nombreResponsable}
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
                    label={`${selectedProveedor.nombreResponsable} ${selectedProveedor.rut}`}
                    icon={<CheckCircleIcon />}
                    sx={{
                      backgroundColor: "#A8EB12",
                      margin: "5px",
                    }}
                  />
                </ListItem>
              )}
            </Box>
            <Button
              onClick={handleAgregarItem}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Agregar más
            </Button>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(additionalRows)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          label="Descripción"
                          name="nombre"
                          onKeyDown={(event) => handleKeyDown(event, "nombre")}
                          fullWidth
                          value={items[index]?.descripcion || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...newItems[index],
                              descripcion: e.target.value,
                            };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Cantidad"
                          name="numeroCuenta"
                          fullWidth
                          onKeyDown={(event) =>
                            handleKeyDown(event, "numeroCuenta")
                          }
                          value={items[index]?.cantidad || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...newItems[index],
                              cantidad: e.target.value,
                            };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Total"
                          name="numeroCuenta"
                          fullWidth
                          onKeyDown={(event) =>
                            handleKeyDown(event, "numeroCuenta")
                          }
                          value={items[index]?.total || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = {
                              ...newItems[index],
                              total: e.target.value,
                            };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <Grid container item xs={12} sm={12} md={12} lg={12}>
                    <Button
                      fullWidth
                      onClick={handleSubmit}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      Guardar Documentos
                    </Button>
                  </Grid>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="El campo está vacío, ingresa proveedor"
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
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        />
      </Box>
    </div>
  );
};

export default IngresoDocumentoProveedor;
