import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import SideBar from "../Componentes/NavBar/SideBar";

const ReporteCtaCorriente = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rut, setRut] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
           
          },
        }
      );
      setData(response.data.clienteDeudaByFechas);
      console.log(response.data.clienteDeudaByFechas)
    } catch (error) {
      setError("Error fetching data");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchData();
  };

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

    const dateRegex = /^(\d{1,2})\/?(\d{1,2})?\/?(\d{1,4})?$/;
    const currentValue = e.target.value;
    const newValue = currentValue + e.key;

    if (!dateRegex.test(newValue)) {
      e.preventDefault();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa Rut</InputLabel>
            <TextField
              label=""
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa fecha de Inicio</InputLabel>
            <TextField
              label="Desde"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              fullWidth
              onKeyDown={validateDateInput}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <InputLabel sx={{ margin: 1.5 }}>Ingresa fecha de Termino</InputLabel>
            <TextField
              label="Hasta"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="DD/MM/YYYY"
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
                  <TableCell>Rut</TableCell>
                  <TableCell>Razon Social</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo Documento</TableCell>
                  <TableCell>Folio</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Abono</TableCell>
                  <TableCell>Pagado</TableCell>
                  <TableCell>Parcial</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Productos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.rut}</TableCell>
                    <TableCell>{row.razonSocial}</TableCell>
                    <TableCell>{new Date(row.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{row.descripcionComprobante}</TableCell>
                    <TableCell>{row.nroComprobante}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>
                      {row.clientePagarDeudasTransFerencias.map((payment, index) => (
                        <div key={index}>
                          {payment.metodoPago} - {payment.montoPagado}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{row.pagado ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.parcial ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.totalPagadoParcial}</TableCell>
                    <TableCell>
                      {row.clienteVentaDetalles.map((product, index) => (
                        <div key={index}>
                          {product.descripcionProducto} - {product.cantidad} x {product.precioUnidad}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </div>
  );
};

export default ReporteCtaCorriente;
