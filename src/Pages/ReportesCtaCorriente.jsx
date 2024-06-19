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
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";
import SideBar from "../Componentes/NavBar/SideBar";

const validateDateInput = (e) => {
  const allowedKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Tab",
  ];
  if (allowedKeys.includes(e.key)) return;

  const dateRegex = /^(\d{0,4})\/?(\d{0,2})\/?(\d{0,2})$/;
  const currentValue = e.target.value;
  const newValue = currentValue + e.key;

  if (!dateRegex.test(newValue)) {
    e.preventDefault();
  }
};

const ReportesCtaCorriente = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rut, setRut] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/ReporteClientes/GetClientesDeudasByFecha`,
        {
          params: {
            fechaDesde: startDate,
            fechaHasta: endDate,
            rut,
          },
        }
      );
      const groupedData = groupDataByClient(response.data.clienteDeudaByFechas);
      setData(groupedData);
      console.log("RESPONSE FECHAS", groupedData);
    } catch (error) {
      setError("Error fetching data");
    }
    setLoading(false);
  };

  const groupDataByClient = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const clientIndex = acc.findIndex(
        (item) => item.rut === curr.rut
      );
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

  const handleSearch = () => {
    fetchData();
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [rowId]: !prevOpenRows[rowId],
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa Rut</InputLabel>
            <TextField
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa fecha de Inicio (AAAA/MM/DD)</InputLabel>
            <TextField
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="AAAA/MM/DD"
              fullWidth
              onKeyDown={validateDateInput}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa fecha de Termino (AAAA/MM/DD)</InputLabel>
            <TextField
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="AAAA/MM/DD"
              fullWidth
              onKeyDown={validateDateInput}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <InputLabel sx={{ margin: 1.5 }}></InputLabel>
            <Button
              sx={{ width: "40%" }}
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            message={error}
          />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Rut</TableCell>
                  <TableCell>Razon Social</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((client) => (
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
                                  <TableCell>Productos</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {client.transactions.map((transaction) => (
                                  <TableRow key={transaction.id}>
                                    <TableCell>{new Date(transaction.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell>{transaction.descripcionComprobante}</TableCell>
                                    <TableCell>{transaction.nroComprobante}</TableCell>
                                    <TableCell>{transaction.total}</TableCell>
                                    <TableCell>
                                      {transaction.clientePagarDeudasTransFerencias.map((payment, index) => (
                                        <div key={index}>
                                          {payment.metodoPago} - {payment.montoPagado}
                                        </div>
                                      ))}
                                      <div>
                                        <strong>Total Abono: {transaction.clientePagarDeudasTransFerencias.reduce(
                                          (sum, payment) => sum + payment.montoPagado,
                                          0
                                        )}</strong>
                                      </div>
                                    </TableCell>
                                    <TableCell>ABONO -CARGO</TableCell>
                                    <TableCell>
                                      {transaction.clienteVentaDetalles.map((product, index) => (
                                        <div key={index}>
                                          {product.descripcionProducto} - {product.cantidad} x {product.precioUnidad}
                                        </div>
                                      ))}
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
      </Grid>
    </div>
  );
};

export default ReportesCtaCorriente;
