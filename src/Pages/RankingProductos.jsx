import React, { useState } from "react";
import {
  Grid,
  Button,
  Snackbar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";

const RankingProductos = () => {
  const apiUrl = import.meta.env.VITE_URL_API2;
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tipo, setTipo] = useState("Productos");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const params = {
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipo: tipo.toString(),
    };
    
    console.log("Iniciando fetchData con params:", params);
    
    try {
      const url = `https://www.easypos.somee.com/api/ReporteVentas/ReporteVentasRankingProductoGET`;
      console.log("URL being fetched:", url);
      
      const response = await axios.get(url, { params });
      
      console.log("Respuesta del servidor:", response);
      
      if (response.data) {
        setCantidad(response.data.cantidad);
        if (response.data.cantidad > 0 && response.data.reporteVentaRankingProductos) {
          setData(response.data.reporteVentaRankingProductos);
          console.log("Datos recibidos:", response.data.reporteVentaRankingProductos);
          setSnackbarMessage(`Se encontraron ${response.data.cantidad} resultados.`);
        } else {
          setData([]);
          setSnackbarMessage("No se encontraron resultados.");
        }
      } else {
        console.warn("La respuesta no contiene datos:", response);
        setData([]);
        setSnackbarMessage("No se encontraron resultados.");
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
    }
    
    setSnackbarOpen(true);
    setLoading(false);
  };

  const handleBuscarClick = () => {
    fetchData();
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  value={tipo}
                  label="Tipo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <MenuItem value="Productos">Productos</MenuItem>
                  <MenuItem value="Marca">Marca</MenuItem>
                  <MenuItem value="Familia">Familia</MenuItem>
                  <MenuItem value="SubFamilia">Sub Familia</MenuItem>
                </Select>
              </FormControl>
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
        {loading ? (
          <CircularProgress />
        ) : cantidad === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Código Producto</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio Costo</TableCell>
                  <TableCell>Precio Venta</TableCell>
                  <TableCell>Stock Actual</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Suma Total</TableCell>
                  <TableCell>Ranking</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((producto) => (
                  <TableRow key={producto.codigoProducto}>
                    <TableCell>{producto.codigoProducto}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>{producto.precioCosto.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{producto.precioVenta.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{producto.stockActual.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{producto.cantidad.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{producto.sumaTotal.toLocaleString("es-CL")}</TableCell>
                    <TableCell>{producto.ranking.toLocaleString("es-CL")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default RankingProductos;
