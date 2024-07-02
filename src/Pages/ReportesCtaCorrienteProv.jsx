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

const ReportesCtaCorrienteProv = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  const handleBuscarClick = () => {
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Proveedores/GetProveedorCompraByFecha`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      setData(response.data.proveedorCompraCabeceraReportes);
      console.log("respuesta Provedores", response.data);
    } catch (error) {
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const groupDataByProvider = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const providerIndex = acc.findIndex((item) => item.rut === curr.rut);
      if (providerIndex !== -1) {
        acc[providerIndex].transactions.push(curr);
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

  const handleHideZeroBalance = () => {
    setHideZeroBalance(!hideZeroBalance);
  };

  const groupedData = groupDataByProvider(data);

  const filteredData = groupedData.filter((provider) => {
    const lowercasedFilter = searchTerm.toLowerCase();

    return (
      provider.rut.toLowerCase().includes(lowercasedFilter) ||
      provider.razonSocial.toLowerCase().includes(lowercasedFilter)
    );
  });

  const sortedData = filteredData.sort((a, b) => a.rut.localeCompare(b.rut));

  const calculateSaldo = (total, pagos) => {
    const totalPagos = pagos.reduce((sum, pago) => sum + pago.montoPagado, 0);
    return total - totalPagos;
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
                sx={{ p: 2, mb: 4 }}
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
        <Button
          variant="contained"
          onClick={handleHideZeroBalance}
          color="secondary"
          sx={{ p: 2, mt: 4 }}
        >
          {hideZeroBalance ? "Mostrar Saldo Cero" : "Ocultar Saldo Cero"}
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
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Nombre Responsable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((provider) => (
                  <React.Fragment key={provider.rut}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(provider.rut)}
                        >
                          {openRows[provider.rut] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{provider.rut}</TableCell>
                      <TableCell>{provider.razonSocial}</TableCell>
                      <TableCell>
                        {provider.transactions[0].nombreResponsable}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRows[provider.rut]}
                          timeout="auto"
                          unmountOnExit
                        >
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
                                  <TableCell>Detalles</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {provider.transactions
                                  .filter(
                                    (transaction) =>
                                      !hideZeroBalance ||
                                      calculateSaldo(
                                        transaction.total,
                                        transaction.pagos
                                      ) !== 0
                                  )
                                  .map((transaction) => (
                                    <TableRow
                                      key={transaction.idCabeceraCompra}
                                    >
                                      <TableCell>

                                    
                                        {" "}
                                        {new Date(
                                          transaction.fechaIngreso
                                        ).toLocaleDateString("es-ES", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        {transaction.tipoDocumento}
                                      </TableCell>
                                      <TableCell>{transaction.folio}</TableCell>
                                      <TableCell> {transaction.pagos.length > 0 &&
                                          transaction.pagos.map((payment) => (
                                            <div key={payment.id}>
                                              {payment.montoPagado.toLocaleString("es-CL")} <br />
                                              {payment.metodoPago}
                                              <br />
                                              {new Date(payment.fechaPago).toLocaleDateString(
                                                "es-ES",
                                                {
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                }
                                              )}
                                            </div>
                                          ))}</TableCell>
                                      <TableCell>{transaction.total.toLocaleString("es-CL")}</TableCell>
              
                                      <TableCell>
                                        
                                        {calculateSaldo(
                                          transaction.total,
                                          transaction.pagos
                                        ).toLocaleString("es-CL")}
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleOpenDialog(
                                              transaction.detalles
                                            )
                                          }
                                        >
                                          Ver Detalles
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
          <DialogTitle>Detalles de los Productos</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aquí puedes ver los detalles de los productos seleccionados.
            </DialogContentText>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unidad</TableCell>
                  <TableCell>Costo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product.idDetalle}>
                    <TableCell>{product.codProducto}</TableCell>
                    <TableCell>{product.descripcionProducto}</TableCell>
                    <TableCell>{product.cantidad}</TableCell>
                    <TableCell>{product.precioUnidad}</TableCell>
                    <TableCell>{product.costo}</TableCell>
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

export default ReportesCtaCorrienteProv;
