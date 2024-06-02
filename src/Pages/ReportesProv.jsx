import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";
import dayjs from "dayjs"; // To format date

const ReportesProv = () => {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState([]);
  const [openPagar, setOpenPagar] = useState(false);
  const [groupedProveedores, setGroupedProveedores] = useState([]);
  const [openPaymentProcess, setOpenPaymentProcess] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cantidadPagada, setCantidadPagada] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [paymentOrigin, setPaymentOrigin] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get(
        "https://www.easyposdev.somee.com/api/Proveedores/GetProveedorCompra"
      );
      const sortedProveedores =
        response.data.proveedorCompra.proveedorCompraCabeceras.sort((a, b) => {
          if (a.rut < b.rut) return -1;
          if (a.rut > b.rut) return 1;
          return 0;
        });
      setProveedores(sortedProveedores);
      console.log(sortedProveedores);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProveedores();
    }, 3000); // Fetch users every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleClickOpen = (proveedor) => {
    setSelectedProveedor(proveedor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProveedor(null);
  };

  const handlePagarOpen = (rut) => {
    const filteredProveedores = proveedores.filter(
      (proveedor) => proveedor.rut === rut
    );
    setGroupedProveedores(filteredProveedores);
    setOpenPagar(true);
  };

  const handlePagarClose = () => {
    setOpenPagar(false);
    setGroupedProveedores([]);
  };

  const handleOpenPaymentProcess = (origin, total) => {
    setCantidadPagada(total);
    setMetodoPago("");
    setPaymentOrigin(origin);
    setOpenPaymentProcess(true);
  };

  const handleClosePaymentProcess = () => {
    setOpenPaymentProcess(false);
  };

  const getTotalSelected = () => {
    return selectedProveedor && selectedProveedor.total ? selectedProveedor.total : 0;
  };
  

  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > getTotalSelected()
      ? cantidadPagada - getTotalSelected()
      : 0;
  };

  const handlePago = async () => {
    setLoading(true);
  
    let compraDeudaIds = [];
  
    // Si hay un proveedor seleccionado, agregamos su detalle de compra
    if (selectedProveedor) {
      compraDeudaIds.push({
        idProveedorCompraCabecera: selectedProveedor.id,
        total: parseInt(Math.round(selectedProveedor.total)),
      });
    }
  
    // Si hay proveedores agrupados, agregamos sus detalles de compra
    if (groupedProveedores.length > 0) {
      groupedProveedores.forEach((proveedor) => {
        compraDeudaIds.push({
          idProveedorCompraCabecera: proveedor.id,
          total: parseInt(Math.round(proveedor.total)),
        });
      });
    }
  
    if (compraDeudaIds.length === 0) {
      alert("No hay solicitudes de pago válidas para procesar.");
      setLoading(false);
      return;
    }
  
    // Construye el objeto de datos de pago
    const pagoData = {
      fechaIngreso: new Date().toISOString(),
      codigoUsuario: 0, // Ajusta según tu lógica
      codigoSucursal: 0, // Ajusta según tu lógica
      puntoVenta: "string", // Ajusta según tu lógica
      compraDeudaIds: compraDeudaIds,
      montoPagado: compraDeudaIds.reduce((total, compra) => total + compra.total, 0).toString(),
      metodoPago: metodoPago,
      requestProveedorCompraPagar: 'valor requerido', // Ajusta el valor según lo que requiera el servidor
    };
  
    try {
      // Realiza la llamada a la API utilizando Axios
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Proveedores/AddProveedorCompraPagar",
        pagoData
      );
  
      // Maneja la respuesta según tu lógica
      console.log("Respuesta de pago:", response.data);
      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);
  
      // Cierra el diálogo de proceso de pago
      handleClose();
      setTimeout(() => {
        handleClosePaymentProcess();
      }, 3000);
    } catch (error) {
      // Maneja los errores
      console.error("Error al procesar el pago:", error);
      setError("Error al procesar el pago. Inténtalo de nuevo más tarde.");
    } finally {
      // Finaliza la carga y actualiza el estado
      setLoading(false);
    }
  };
  
  // const handlePago = async () => {
  //   setLoading(true);
  
  //   // Construye el array de compraDeudaIds basado en el proveedor seleccionado o todos los proveedores
  //   const compraDeudaIds = selectedProveedor
  //     ? [
  //         {
  //           idProveedorCompraCabecera: selectedProveedor.id,
  //           total: Math.round(selectedProveedor.total).toString(), // Convertir a entero y luego a cadena
  //         },
  //       ]
  //     : groupedProveedores.map((proveedor) => ({
  //         idProveedorCompraCabecera: proveedor.id,
  //         total: Math.round(proveedor.total).toString(), // Convertir a entero y luego a cadena
  //       }));
  
  //   if (compraDeudaIds.length === 0) {
  //     alert("No hay solicitudes de pago válidas para procesar.");
  //     setLoading(false);
  //     return;
  //   }
  
  //   // Filtra los IDs de compra válidos
  //   const validCompraDeudaIds = compraDeudaIds.filter(
  //     (compra) => compra !== null
  //   );
  
  //   // Calcula el total del pago
  //   const totalPago = validCompraDeudaIds.reduce(
  //     (total, compra) => total + parseInt(compra.total), // Convertir de cadena a entero
  //     0
  //   );
  
  //   if (validCompraDeudaIds.length === 0) {
  //     alert("No hay solicitudes de pago válidas para procesar.");
  //     setLoading(false);
  //     return;
  //   }
  
  //   // Construye el objeto de datos de pago
  //   const pagoData = {
  //     fechaIngreso: new Date().toISOString(),
  //     codigoUsuario: 0, // Ajusta según tu lógica
  //     codigoSucursal: 0, // Ajusta según tu lógica
  //     puntoVenta: "string", // Ajusta según tu lógica
  //     compraDeudaIds: validCompraDeudaIds,
  //     montoPagado: totalPago.toString(), // Convertir a cadena
  //     metodoPago: metodoPago,
  //   };
  
  //   try {
  //     // Realiza la llamada a la API utilizando Axios
  //     const response = await axios.post(
  //       "https://www.easyposdev.somee.com/api/Proveedores/AddProveedorCompraPagar",
  //       pagoData
  //     );
  
  //     // Maneja la respuesta según tu lógica
  //     console.log("Respuesta de pago:", response.data);
  //     setSnackbarMessage(response.data.descripcion);
  //     setSnackbarOpen(true);
  
  //     // Cierra el diálogo de proceso de pago
  //     handleClose();
  //     setTimeout(() => {
  //       handleClosePaymentProcess();
  //     }, 3000);
  //   } catch (error) {
  //     // Maneja los errores
  //     console.error("Error al procesar el pago:", error);
  //     setError("Error al procesar el pago. Inténtalo de nuevo más tarde.");
  //   } finally {
  //     // Finaliza la carga y actualiza el estado
  //     setLoading(false);
  //   }
  // };
  
  
  
  

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Razon Social</TableCell>
                <TableCell>Tipo Documento</TableCell>
                <TableCell>Folio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor, index) => (
                <React.Fragment key={index}>
                  {index === 0 ||
                  proveedor.rut !== proveedores[index - 1].rut ? (
                    // Muestra el RUT solo si es el primero de su grupo
                    <TableRow sx={{ borderRadius: "10px", boxShadow: 1 }}>
                      <TableCell></TableCell>
                      <TableCell>{proveedor.rut}</TableCell>
                      <TableCell>{proveedor.razonSocial}</TableCell>
                      {/* Celdas restantes */}
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button
                          sx={{ width: "80%" }}
                          variant="contained"
                          color="secondary"
                          onClick={() => handlePagarOpen(proveedor.rut)}
                        >
                          Pagar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  <TableRow key={proveedor.id}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{proveedor.razonSocial}</TableCell>
                    <TableCell>{proveedor.tipoDocumento}</TableCell>
                    <TableCell>{proveedor.folio}</TableCell>
                    <TableCell>
                      {dayjs(proveedor.fechaIngreso).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{proveedor.total}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="space-between">
                        <Button
                          sx={{ width: "80%" }}
                          variant="contained"
                          onClick={() => handleClickOpen(proveedor)}
                        >
                          Detalle
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Proveedor</DialogTitle>
        <DialogContent dividers>
          {selectedProveedor && (
            <div>
              <Paper>
                <Box
                  display="flex"
                  p={1.5}
                  gap={2}
                  bgcolor={"#f5f5f5"}
                  borderRadius={1}
                  sx={{ alignItems: "center" }}
                >
                  <Box>
                    <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "#696c6f" }}>
                      ID: {selectedProveedor.razonSocial}
                      <br />
                      {selectedProveedor.rut}
                    </Typography>
                  </Box>
                  <Grid item xs={12}></Grid>
                </Box>
              </Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha de ingreso</TableCell>
                      <TableCell>Tipo de documento</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {dayjs(selectedProveedor.fechaIngreso).format(
                          "DD-MM-YYYY"
                        )}
                      </TableCell>
                      <TableCell>{selectedProveedor.tipoDocumento}</TableCell>
                      <TableCell>{selectedProveedor.folio}</TableCell>
                      <TableCell>{selectedProveedor.total}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Detalles de Compra:
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unidad</TableCell>
                      <TableCell>Costo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProveedor.proveedorCompraDetalles &&
                      selectedProveedor.proveedorCompraDetalles.map(
                        (detalle) => (
                          <TableRow key={detalle.codProducto}>
                            <TableCell>{detalle.descripcionProducto}</TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            <TableCell>{detalle.precioUnidad}</TableCell>
                            <TableCell>{detalle.costo}</TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6">
                  Total Deuda : ${selectedProveedor.total}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handleOpenPaymentProcess}
                  onClick={() =>
                    handleOpenPaymentProcess(
                      "detalleProveedor",
                      selectedProveedor.total
                    )
                  }
                >
                  Pagar Total ({selectedProveedor.total})
                </Button>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPagar}
        onClose={handlePagarClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pagos del Proveedor</DialogTitle>
        <DialogContent dividers>
          {groupedProveedores.length > 0 && (
            <div>
              <Typography variant="h6">
                Proveedor: {groupedProveedores[0].razonSocial}
              </Typography>
              <Typography variant="subtitle1">
                RUT: {groupedProveedores[0].rut}
              </Typography>
              <Typography variant="h6" style={{ marginTop: "16px" }}>
                Compras:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo Documento</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedProveedores.map((proveedor) => (
                      <TableRow key={proveedor.id}>
                        <TableCell>{proveedor.tipoDocumento}</TableCell>
                        <TableCell>{proveedor.folio}</TableCell>
                        <TableCell>
                          {dayjs(proveedor.fechaIngreso).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>{proveedor.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6">
                  Total Deuda :
                  {groupedProveedores.reduce(
                    (total, proveedor) => total + proveedor.total,
                    0
                  )}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleOpenPaymentProcess(
                      "totalProveedores",
                      groupedProveedores.reduce(
                        (acc, proveedor) => acc + proveedor.total,
                        0
                      )
                    )
                  }
                  // onClick={handleOpenPaymentProcess}
                >
                  Pagar Total (
                  {groupedProveedores.reduce(
                    (total, proveedor) => total + proveedor.total,
                    0
                  )}
                  )
                </Button>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePagarClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPaymentProcess} onClose={handleClosePaymentProcess}>
        <DialogTitle>Procesamiento de Pago</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} item xs={12} md={6} lg={12}>
            <Grid item xs={12} md={12} lg={12}>
              {error && (
                <Grid item xs={12}>
                  <Typography variant="body1" color="error">
                    {error}
                  </Typography>
                </Grid>
              )}
              <TextField
                sx={{ marginBottom: "5%" }}
                margin="dense"
                label="Monto a Pagar"
                variant="outlined"
                value={
                  paymentOrigin === "detalleProveedor" && selectedProveedor
                    ? selectedProveedor.total
                    : groupedProveedores.reduce(
                        (acc, proveedor) => acc + proveedor.total,
                        0
                      )
                }
                
                fullWidth
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Cantidad pagada"
                value={cantidadPagada}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value.trim()) {
                    setCantidadPagada(0);
                  } else {
                    setCantidadPagada(parseFloat(value));
                  }
                }}
                disabled={metodoPago !== "EFECTIVO"} // Deshabilitar la edición excepto para el método "EFECTIVO"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 9,
                }}
              />
              <TextField
                margin="dense"
                fullWidth
                type="number"
                label="Por pagar"
                value={
                  paymentOrigin === "detalleProveedor" && selectedProveedor
                    ? Math.max(0, selectedProveedor.total - cantidadPagada)
                    : Math.max(
                        0,
                        groupedProveedores.reduce(
                          (acc, proveedor) => acc + proveedor.total,
                          0
                        ) - cantidadPagada
                      )
                }
                InputProps={{ readOnly: true }}
              />
              {calcularVuelto() > 0 && (
                <TextField
                  margin="dense"
                  fullWidth
                  type="number"
                  label="Vuelto"
                  value={calcularVuelto()}
                  InputProps={{ readOnly: true }}
                />
              )}
            </Grid>

            <Grid
              container
              spacing={2}
              item
              sm={12}
              md={12}
              lg={12}
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Typography sx={{ marginTop: "7%" }} variant="h6">
                Selecciona Método de Pago:
              </Typography>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="efectivo-btn"
                  fullWidth
                  disabled={loading} // Deshabilitar si hay una carga en progreso
                  variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                  onClick={() => {
                    setMetodoPago("EFECTIVO");
                  }}
                >
                  Efectivo
                </Button>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="credito-btn"
                  variant={metodoPago === "CHEQUE" ? "contained" : "outlined"}
                  onClick={() => {
                    setMetodoPago("CHEQUE");
                    setCantidadPagada(
                      paymentOrigin === "detalleProveedor"
                        ? selectedProveedor.total
                        : groupedProveedores.reduce(
                            (acc, proveedor) => acc + proveedor.total,
                            0
                          )
                    );
                  }}
                  fullWidth
                  disabled={loading} // Deshabilitar si hay una carga en progreso
                >
                  CHEQUE
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  id="transferencia-btn"
                  fullWidth
                  sx={{ height: "100%" }}
                  variant={
                    metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                  }
                  onClick={() => {
                    setMetodoPago("TRANSFERENCIA");
                    setCantidadPagada(
                      paymentOrigin === "detalleProveedor"
                        ? selectedProveedor.total
                        : groupedProveedores.reduce(
                            (acc, proveedor) => acc + proveedor.total,
                            0
                          )
                    );
                  }}
                  disabled={loading} // Deshabilitar si hay una carga en progreso
                >
                  Transferencia
                </Button>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button
                  sx={{ height: "100%" }}
                  variant="contained"
                  fullWidth
                  color="secondary"
                  disabled={!metodoPago || cantidadPagada <= 0 || loading}
                  onClick={handlePago}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} /> Procesando...
                    </>
                  ) : (
                    "Pagar"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentProcess} disabled={loading}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ReportesProv;
