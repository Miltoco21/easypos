import React, { useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  InputLabel,
  Collapse,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import SideBar from "../Componentes/NavBar/SideBar";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ReportesCtaCorriente = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rut, setRut] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermFolio, setSearchTermFolio] = useState("");
  const [hideZeroSaldo, setHideZeroSaldo] = useState(false);

  const handleBuscarClick = () => {
    fetchData();
  };


  const apiUrl = import.meta.env.VITE_URL_API2;
  console.log("apiUrl",apiUrl);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API2}/ReporteClientes/GetClientesDeudasByFecha`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      setData(response.data.clienteDeudaByFechas);
      console.log("respuesta fechasS", response.data);
    } catch (error) {
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const groupDataByClient = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const clientIndex = acc.findIndex((item) => item.rut === curr.rut);
      if (clientIndex !== -1) {
        acc[clientIndex].transactions.push(curr);
      } else {
        acc.push({
          rut: curr.rut,
          razonSocial: curr.razonSocial,
          transactions: [curr],
        });
      }
      return acc;
    }, []);
    return groupedData;
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [rowId]: !prevOpenRows[rowId],
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (products) => {
    setSelectedProducts(products);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProducts([]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSearchFolio = (value) => {
    setSearchTermFolio(value);
  };

  const groupedData = groupDataByClient(data);

  const filteredData = groupedData.filter((client) => {
    const lowercasedFilter = searchTerm.toLowerCase();

    return (
      client.rut.toLowerCase().includes(lowercasedFilter) ||
      client.razonSocial.toLowerCase().includes(lowercasedFilter)
    );
  });

  const sortedData = filteredData.sort((a, b) => a.rut.localeCompare(b.rut));

  const calculateSaldo = (total, pagos) => {
    const totalPagos = pagos.reduce((sum, pago) => sum + pago.montoPagado, 0);
    return total - totalPagos;
  };

  const toggleHideZeroSaldo = () => {
    setHideZeroSaldo((prev) => !prev);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      sx: { mb: 2 },
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Término"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      sx: { mb: 2 },
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                sx={{ p: 2, mb: 3 }}
                variant="contained"
                onClick={handleBuscarClick}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Buscar por RUT o Razón Social"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Button onClick={toggleHideZeroSaldo}variant="contained" color="secondary"    sx={{ p: 2, mt: 4 }}>
          {hideZeroSaldo ? "Mostrar Saldos en Cero" : "Ocultar Saldos en Cero"}
        </Button>

        {loading ? (
          <CircularProgress />
        ) : error ? (
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
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Rut</TableCell>
                  <TableCell>Razon Social</TableCell>
                  <TableCell>Nombre Cliente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((client) => (
                  <React.Fragment key={client.rut}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(client.rut)}
                        >
                          {openRows[client.rut] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{client.rut}</TableCell>
                      <TableCell>{client.razonSocial}</TableCell>
                      <TableCell>{client.transactions[0].nombreApellidoCliente}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={openRows[client.rut]} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Table size="small" aria-label="transactions">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha</TableCell>
                                  <TableCell>Tipo Documento</TableCell>
                                  <TableCell>Folio</TableCell>
                                  <TableCell>Cargo</TableCell>
                                  <TableCell>Abono</TableCell>
                                  <TableCell>Saldo</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {client.transactions
                                  .filter(
                                    (transaction) =>
                                      !hideZeroSaldo ||
                                      calculateSaldo(
                                        transaction.total,
                                        transaction.clienteDeudasPagadas
                                      ) !== 0
                                  )
                                  .map((transaction) => (
                                    <TableRow key={transaction.id}>
                                      <TableCell>
                                        {new Date(transaction.fechaIngreso).toLocaleDateString(
                                          "es-ES",
                                          {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          }
                                        )}
                                      </TableCell>
                                      <TableCell>{transaction.descripcionComprobante}</TableCell>
                                      <TableCell>{transaction.nroComprobante}</TableCell>
                                      <TableCell>{transaction.total.toLocaleString("es-CL")}</TableCell>
                                      <TableCell>
                                        {transaction.clienteDeudasPagadas.length > 0 &&
                                          transaction.clienteDeudasPagadas.map((payment) => (
                                            <div key={payment.id}>
                                              {payment.montoPagado.toLocaleString("es-CL")} <br />
                                              {payment.metodoPago}
                                              <br />
                                              {new Date(payment.fechaIngreso).toLocaleDateString(
                                                "es-CL",
                                                {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                }
                                              )}
                                            </div>
                                          ))}
                                      </TableCell>
                                      <TableCell>
                                        {calculateSaldo(
                                          transaction.total,
                                          transaction.clienteDeudasPagadas
                                        ).toLocaleString("es-CL")}
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="contained"
                                          onClick={() => handleOpenDialog(transaction.productos)}
                                        >
                                          Detalles
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Detalles de Productos</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aquí están los detalles de los productos seleccionados:
            </DialogContentText>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.descripcionProducto}</TableCell>
                    <TableCell>{product.cantidad}</TableCell>
                    <TableCell>{product.precioUnidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default ReportesCtaCorriente;
