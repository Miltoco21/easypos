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
  IconButton,
  Collapse,
  Box,
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

const RankingVentas = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openRows, setOpenRows] = useState({});

  const handleBuscarClick = () => {
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/ReporteVentas/ReporteVentasPorTipoComprobanteYMetodoPagoGET`,
        {
          params: {
            fechaDesde: startDate ? startDate.format("YYYY-MM-DD") : "",
            fechaHasta: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      const groupedData = groupBy(
        response.data.reporteVentasPorTipoComprobanteYMetodoPagos || []
      );
      setData(groupedData);
      console.log("respuesta ranking data", groupedData);
    } catch (error) {
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const groupBy = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.metodoPago]) {
        acc[item.metodoPago] = {
          transactions: [],
          totalCantidad: 0,
          totalSuma: 0,
        };
      }
      acc[item.metodoPago].transactions.push(item);
      acc[item.metodoPago].totalCantidad += item.cantidad;
      acc[item.metodoPago].totalSuma += item.sumaTotal;
      return acc;
    }, {});
  };

  const toggleRow = (metodoPago) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [metodoPago]: !prevOpenRows[metodoPago],
    }));
  };

  const calculateTotalSuma = () => {
    return Object.values(data).reduce((acc, item) => acc + item.totalSuma, 0);
  };

  const calculatePercentage = (totalSuma, grandTotal) => {
    return (totalSuma / grandTotal) * 100;
  };

  const grandTotalSuma = calculateTotalSuma();

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

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {!loading && (
            <Grid item xs={12}>
              <Paper sx={{ mb: 2 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <strong>Total : </strong>
                          {grandTotalSuma.toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell>
                          <strong>Total Participación: </strong>
                          100%
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          )}

          {loading ? (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          ) : (
            Object.keys(data).map((metodoPago) => (
              <Grid item xs={12} key={metodoPago}>
                <Paper sx={{ mb: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(metodoPago)}
                            >
                              {openRows[metodoPago] ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <strong>{metodoPago}</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Total Cantidad: </strong>
                            {data[metodoPago].totalCantidad}
                          </TableCell>
                          <TableCell>
                            <strong>Valor: </strong>
                            {data[metodoPago].totalSuma.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell >
                            <strong> Porcentaje Participación: </strong>
                            {Math.round(
                              calculatePercentage(
                                data[metodoPago].totalSuma,
                                grandTotalSuma
                              ) * 100
                            ) / 100}
                            %
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse
                              in={openRows[metodoPago]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={1}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{backgroundColor:"gainsboro"}}>
                                      <TableCell>Fecha</TableCell>
                                      <TableCell>Tipo Comprobante</TableCell>
                                      <TableCell>Cantidad</TableCell>
                                      <TableCell>Valor</TableCell>
                                      <TableCell>
                                        Porcentaje Participación
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {data[metodoPago].transactions &&
                                      data[metodoPago].transactions.map(
                                        (row, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{row.fecha}</TableCell>
                                            <TableCell>
                                              {row.tipoComprobante}
                                            </TableCell>
                                            <TableCell>
                                              {row.cantidad}
                                            </TableCell>
                                            <TableCell>
                                              {row.sumaTotal.toLocaleString("es-CL")}
                                            </TableCell>
                                            <TableCell>
                                              {Math.round(
                                                (row.sumaTotal /
                                                  grandTotalSuma) *
                                                  10000
                                              ) / 100}
                                              %
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Grid>
    </div>
  );
};

export default RankingVentas;
