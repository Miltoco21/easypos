import React, { useState, useEffect } from 'react';
import {
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
  IconButton
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SideBar from '../Componentes/NavBar/SideBar';
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';

const IngresoDocumentoProveedor = () => {
  const [open, setOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [folioDocumento, setFolioDocumento] = useState('');
  const [fecha, setFecha] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(1);
  const [items, setItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la visibilidad del snackbar

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores');
        setProveedores(response.data.proveedores);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
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
    if (searchText.trim() === '') {
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false); // Cierra el snackbar si el campo no está vacío
      const filteredResults = proveedores.filter(proveedor =>
        proveedor.nombreResponsable.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
      setSelectedProveedor([]);
    }
  };

  const handleChipClick = (result) => {
    setSelectedProveedor(result);
    setSearchResults([]);
    setSearchText('');
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
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", boxShadow: 24, p: 4, overflow: "auto", maxHeight: "90vh", maxWidth: "90vw" }}>
            <TextField
              select
              label="Tipo de documento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="opcion1">Opción 1</MenuItem>
              <MenuItem value="opcion2">Opción 2</MenuItem>
              <MenuItem value="opcion3">Opción 3</MenuItem>
            </TextField>
            <TextField
              label="Folio documento"
              value={folioDocumento}
              onChange={(e) => setFolioDocumento(e.target.value)}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
                inputFormat="DD/MM/YYYY" // Formato día/mes/año
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              placeholder="Buscar proveedor por nombre"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button onClick={handleSearch} variant="contained" sx={{ mb: 2 }}>Buscar</Button>
            <Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}>
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
            <Button onClick={handleAgregarItem} variant="outlined" sx={{ mb: 2 }}>Agregar más</Button>
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
                          fullWidth
                          value={items[index]?.descripcion || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = { ...newItems[index], descripcion: e.target.value };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Cantidad"
                          type="number"
                          fullWidth
                          value={items[index]?.cantidad || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = { ...newItems[index], cantidad: e.target.value };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Total"
                          type="number"
                          fullWidth
                          value={items[index]?.total || ''}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index] = { ...newItems[index], total: e.target.value };
                            setItems(newItems);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="El campo está vacío"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        />
      </Box>
    </div>
  );
};

export default IngresoDocumentoProveedor;
