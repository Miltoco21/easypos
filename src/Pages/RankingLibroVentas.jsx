/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Snackbar,
  FormControl,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";

const RankingLibroVentas = () => {
  const apiUrl = import.meta.env.VITE_URL_API2;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tipo, setTipo] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalValues, setTotalValues] = useState(0);
  const [totalIVA, setTotalIVA] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const params = {
      fechadesde: startDate ? startDate.format("YYYY-MM-DD") : "",
      fechahasta: endDate ? endDate.format("YYYY-MM-DD") : "",
      tipoComprobante: tipo.join(","),
    };

    console.log("Iniciando fetchData con params:", params);

    try {
      const url = `${apiUrl}/ReporteVentas/ReporteLibroIVA`;
      console.log("URL being fetched:", url);

      const response = await axios.get(url, { params });

      console.log("Respuesta del servidor:", response);

      if (response.data) {
        setCantidad(response.data.cantidad);

        if (response.data.cantidad > 0 && response.data.ventaCabeceraReportes) {
          setData(response.data.ventaCabeceraReportes);
          console.log("Datos recibidos:", response.data.ventaCabeceraReportes);

          const totalValue = response.data.ventaCabeceraReportes.reduce(
            (sum, item) => sum + item.total,
            0
          );
          const totalIVA = response.data.ventaCabeceraReportes
            .filter((item) => item.tipoComprobante !== 0)
            .reduce((sum, item) => sum + item.montoIVA, 0);

          setSnackbarMessage(
            `Se encontraron ${response.data.cantidad} resultados.`
          );
          setTotalValues(totalValue);
          setTotalIVA(totalIVA);
        } else {
          setData([]);
          setSnackbarMessage("No se encontraron resultados.");
          setTotalValues(0);
          setTotalIVA(0);
        }
      } else {
        console.warn("La respuesta no contiene datos:", response);
        setData([]);
        setSnackbarMessage("No se encontraron resultados.");
        setTotalValues(0);
        setTotalIVA(0);
      }
    } catch (error) {
      console.error("Error al buscar datos:", error);
      setError("Error fetching data");
      setSnackbarMessage("Error al buscar los datos");
      setTotalValues(0);
      setTotalIVA(0);
    }

    setSnackbarOpen(true);
    setLoading(false);
  };

  const handleBuscarClick = () => {
    if (!startDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de inicio.");
      setSnackbarOpen(true);
      return;
    }

    if (!endDate) {
      setSnackbarMessage("Por favor, seleccione la fecha de término.");
      setSnackbarOpen(true);
      return;
    }

    if (tipo.length === 0) {
      setSnackbarMessage(
        "Por favor, seleccione al menos un tipo de comprobante."
      );
      setSnackbarOpen(true);
      return;
    }

    fetchData();
  };

  const handleDialogOpen = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    setTipo((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Grid>
          <Typography
            variant="h4"
            component="div"
            sx={{ mb: 4, justifyContent: "center", textAlign: "center" }}
          >
            Libro de Ventas
          </Typography>

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
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(1)}
                        onChange={handleCheckboxChange}
                        value={1}
                      />
                    }
                    label="Boleta"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(0)}
                        onChange={handleCheckboxChange}
                        value={0}
                      />
                    }
                    label="Ticket"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipo.includes(2)}
                        onChange={handleCheckboxChange}
                        value={2}
                      />
                    }
                    label="Factura"
                  />
                </FormControl>
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
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <p>Total Valores: {totalValues.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} md={3}>
              <p>Total IVA: {totalIVA.toLocaleString("es-CL")}</p>
            </Grid>
            <Grid item xs={12} md={3}>
              <p>Cantidad Encontrados: {cantidad.toLocaleString("es-CL")}</p>
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
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Folio Documento</TableCell>
                  <TableCell>Valor Neto</TableCell>
                  <TableCell>IVA DF</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((producto) => (
                  <TableRow key={producto.idCabecera}>
                    <TableCell>
                      {new Date(producto.fechaIngreso).toLocaleDateString(
                        "es-CL"
                      )}
                    </TableCell>
                    <TableCell>{producto.descripcionComprobante}</TableCell>
                    <TableCell>
                      {producto.nroComprobante.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.montoNeto.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.montoIVA.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      {producto.total.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDialogOpen(producto)}
                      >
                        Detalles
                      </Button>
                    </TableCell>
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
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detalles</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Folio Documento</TableCell>
                      <TableCell>Método de Pago</TableCell>

                      <TableCell>rdcTransactionId </TableCell>

                      <TableCell>Valor Neto</TableCell>
                      <TableCell>IVA DF</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {new Date(
                          selectedProduct.fechaIngreso
                        ).toLocaleDateString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.descripcionComprobante}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.nroComprobante.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.metodoPago.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.rdcTransactionId.toLocaleString(
                          "es-CL"
                        )}
                      </TableCell>

                      <TableCell>
                        {selectedProduct.montoNeto.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.montoIVA.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        {selectedProduct.total.toLocaleString("es-CL")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              Datos de Productos
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "gainsboro" }}>
                      <TableCell>Código Producto</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Precio Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Costo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProduct.ventaDetalleReportes.map(
                      (detalle, index) => (
                        <TableRow key={index}>
                          <TableCell>{detalle.codProducto}</TableCell>
                          <TableCell>{detalle.descripcion}</TableCell>
                          <TableCell>
                            {detalle.precioUnidad.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell>
                            {detalle.cantidad.toLocaleString("es-CL")}
                          </TableCell>
                          <TableCell>
                            {detalle.costo.toLocaleString("es-CL")}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RankingLibroVentas;
