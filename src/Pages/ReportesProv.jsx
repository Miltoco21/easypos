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
  Checkbox,
  InputLabel,
  MenuItem
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";


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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [paymentOrigin, setPaymentOrigin] = useState(null);
  const [montoAPagar, setMontoAPagar] = useState("");

  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [openChequeModal, setOpenChequeModal] = useState(false);
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedBanco, setSelectedBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [nroDocumento, setNroDocumento] = useState(""); 
  const [serieCheque, setSerieCheque] = useState(""); 




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
    fetchProveedores();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchProveedores();
  //   }, 3000); // Fetch users every 3 seconds

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, []);

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

  // const handleOpenPaymentProcess = (origin, total) => {
  //   setCantidadPagada(total);
  //   setTotalDeuda(total);
  //   setMetodoPago("");
  //   setPaymentOrigin(origin);
  //   setOpenPaymentProcess(true);
  // };
  const handleOpenPaymentProcess = (origin, total) => {
    
    if (origin === "detalle") {
      setMontoAPagar(selectedProveedor.total);
      setCantidadPagada(selectedProveedor.total)
    }
    if (origin === "totalProveedores") {
      setMontoAPagar(selectedTotal)
      setCantidadPagada(selectedTotal)
    }

    console.log(montoAPagar);

     // Resetear la cantidad pagada al abrir el diálogo
    setMetodoPago("");
    setOpenPaymentProcess(true);
  };
  
  

  const handleClosePaymentProcess = () => {
    setOpenPaymentProcess(false);
  };

 
const getTotalSelected = () => {
  if (paymentOrigin === "detalleProveedor" && selectedProveedor) {
    return selectedProveedor.total;
  } else {
    return groupedProveedores.reduce((acc, proveedor) => acc + proveedor.total, 0);
  }
};
  const calcularVuelto = () => {
    return metodoPago === "EFECTIVO" && cantidadPagada > montoAPagar
      ? cantidadPagada - montoAPagar
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
      montoPagado: compraDeudaIds
        .reduce((total, compra) => total + compra.total, 0)
        .toString(),
      metodoPago: metodoPago,
      requestProveedorCompraPagar: "valor requerido", // Ajusta el valor según lo que requiera el servidor
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
      fetchProveedores();
      setMontoAPagar(0);
      setCantidadPagada(0);
      /// Cierra el diálogo de proceso de pago
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

  const totalGeneral = proveedores.reduce(
    (acc, proveedor) => acc + proveedor.total,
    0
  );

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = groupedProveedores.map((proveedor) => proveedor.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedIds((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedIds((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const selectedTotal = groupedProveedores
    .filter((proveedor) => selectedIds.includes(proveedor.id))
    .reduce((total, proveedor) => total + proveedor.total, 0);

  const allSelected = selectedIds.length === groupedProveedores.length;
  const [cantidadPagada, setCantidadPagada] = useState(selectedTotal || 0);

  let documentCounters = {};
  proveedores.forEach((proveedor) => {
    const tipoDocumento = proveedor.tipoDocumento.toUpperCase();
    if (!documentCounters[tipoDocumento]) {
      documentCounters[tipoDocumento] = 0;
    }
    documentCounters[tipoDocumento]++;
  });

  const groupedByRut = proveedores.reduce((groups, proveedor) => {
    const rut = proveedor.rut;
    if (!groups[rut]) {
      groups[rut] = [];
    }
    groups[rut].push(proveedor);
    return groups;
  }, {});
  const documentCountsByRut = {};

  Object.keys(groupedByRut).forEach((rut) => {
    const proveedoresGrupo = groupedByRut[rut];
    const counters = proveedoresGrupo.reduce((counters, proveedor) => {
      const tipoDocumento = proveedor.tipoDocumento.toUpperCase();
      if (!counters[tipoDocumento]) {
        counters[tipoDocumento] = 0;
      }
      counters[tipoDocumento]++;
      return counters;
    }, {});

    documentCountsByRut[rut] = counters;
  });

  const [order, setOrder] = useState({
    field: "",
    direction: "asc",
  });

  function handleSort(field) {
    let newDirection = "asc";
    if (order.field === field && order.direction === "asc") {
      newDirection = "desc";
    }

    setOrder({
      field,
      direction: newDirection,
    });

    // Ordena los proveedores directamente aquí
    const sortedProveedores = [...proveedores].sort((a, b) => {
      if (a[field] < b[field]) {
        return newDirection === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return newDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    setProveedores(sortedProveedores);
  }

  let sortedProveedores = [...proveedores];

  if (order.field) {
    sortedProveedores.sort((a, b) => {
      if (a[order.field] < b[order.field]) {
        return order.direction === "asc" ? -1 : 1;
      }
      if (a[order.field] > b[order.field]) {
        return order.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  //////Transferencias//////
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };
  const handleChequeModalOpen = () => {
    setMetodoPago("CHEQUE"); // Establece el método de pago como "Transferencia"
    setOpenChequeModal(true);
    setCantidadPagada(getTotalSelected());
  };
  const handleChequeModalClose = () => {
    
    setOpenChequeModal(false);
    
  };

  const tiposDeCuenta = {
    "Cuenta Corriente": "Cuenta Corriente",
    "Cuenta de Ahorro": "Cuenta de Ahorro",
    "Cuenta Vista": "Cuenta Vista",
    "Cuenta Rut": "Cuenta Rut",
    "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
    "Cuenta de Inversión": "Cuenta de Inversión",
  };
  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };
  const bancosChile = [
    { id: 1, nombre: "Banco de Chile" },
    { id: 2, nombre: "Banco Santander Chile" },
    { id: 3, nombre: "Banco Estado" },
    { id: 4, nombre: "Scotiabank Chile" },
    { id: 5, nombre: "Banco BCI" },
    { id: 6, nombre: "Banco Itaú Chile" },
    { id: 7, nombre: "Banco Security" },
    { id: 8, nombre: "Banco Falabella" },
    { id: 9, nombre: "Banco Ripley" },
    { id: 10, nombre: "Banco Consorcio" },
    { id: 11, nombre: "Banco Internacional" },
    { id: 12, nombre: "Banco Edwards Citi" },
    { id: 13, nombre: "Banco de Crédito e Inversiones" },
    { id: 14, nombre: "Banco Paris" },
    { id: 15, nombre: "Banco Corpbanca" },
    { id: 16, nombre: "Banco BICE" },

    // Agrega más bancos según sea necesario
  ];

  const handleBancoChange = (event) => {
    setSelectedBanco(event.target.value);
  };
  const hoy = dayjs();
  const inicioRango = dayjs().subtract(1, "week"); // Resta 1 semanas
  const handlePayment = async () => {
    try {
      setLoading(true);
  
      let endpoint =
        "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaByIdCliente";
  
      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente";
  
        if (
          nombre === "" ||
          rut === "" ||
          selectedBanco === "" ||
          tipoCuenta === "" ||
          nroCuenta === "" ||
          fecha === "" ||
          nroOperacion === ""
        ) {
          setTransferenciaError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        }
  
        if (nombre === "") {
          setTransferenciaError("Por favor, ingresa el nombre.");
          setLoading(false);
          return;
        }
        if (rut === "") {
          setTransferenciaError("Por favor, ingresa el RUT.");
          setLoading(false);
          return;
        }
        if (!validarRutChileno(rut)) {
          setTransferenciaError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        }
  
        if (selectedBanco === "") {
          setTransferenciaError("Por favor, selecciona el banco.");
          setLoading(false);
          return;
        }
  
        if (tipoCuenta === "") {
          setTransferenciaError("Por favor, selecciona el tipo de cuenta.");
          setLoading(false);
          return;
        }
  
        if (nroCuenta === "") {
          setTransferenciaError("Por favor, ingresa el número de cuenta.");
          setLoading(false);
          return;
        }
  
        if (fecha === "") {
          setTransferenciaError("Por favor, selecciona la fecha.");
          setLoading(false);
          return;
        }
  
        if (nroOperacion === "") {
          setTransferenciaError("Por favor, ingresa el número de operación.");
          setLoading(false);
          return;
        }
      }
  
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      } else setError("");
  
      const selectedDeudas = deudaData.filter((deuda) => deuda.selected);
  
      const deudaIds = selectedDebts.map((deuda) => ({
        idCuentaCorriente: deuda.id,
        idCabecera: deuda.idCabecera,
        total: deuda.total,
      }));
  
      const requestBody = {
        deudaIds: deudaIds,
        montoPagado: getTotalSelected(),
        metodoPago: metodoPago,
        idUsuario: selectedClient.codigoCliente,
        transferencias: {
          idCuentaCorrientePago: 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        },
      };
  
      console.log("Request Body:", requestBody);
  
      const response = await axios.post(endpoint, requestBody);
  
      console.log("Response:", response.data);
      console.log("ResponseStatus:", response.data.statusCode);
      ///acciones post pago////
      if (response.data.statusCode === 200) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        handleClosePaymentDialog();
        setCantidadPagada(0);
        resetDeudaData();
  
        setTimeout(() => {
          handleClosePaymentProcess();
        }, 2000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
  <TableRow sx={{ backgroundColor: "gainsboro"}}>
    <TableCell></TableCell>
    <TableCell onClick={() => handleSort("rut")}>
      RUT
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "rut" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "rut" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell onClick={() => handleSort("razonSocial")}>
      Razon Social
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "razonSocial" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "razonSocial" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell onClick={() => handleSort("tipoDocumento")}>
      Tipo Documento
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "tipoDocumento" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "tipoDocumento" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell onClick={() => handleSort("folio")}>
      Folio
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "folio" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "folio" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell onClick={() => handleSort("fechaIngreso")}>
      Fecha
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "fechaIngreso" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "fechaIngreso" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell onClick={() => handleSort("total")}>
      Total
      <ArrowUpwardIcon
        fontSize="small"
        style={{
          color: order.field === "total" && order.direction === "asc" ? "black" : "dimgrey",
        }}
      />
      <ArrowDownwardIcon
        fontSize="small"
        style={{
          color: order.field === "total" && order.direction === "desc" ? "black" : "dimgrey",
        }}
      />
    </TableCell>
    <TableCell>Acciones</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
              {Object.entries(groupedByRut).map(
                ([rut, proveedoresGrupo], index) => (
                  <>
                    {/* Filas para proveedores de este RUT */}
                    {proveedoresGrupo.map((proveedor, index) => (
                      <React.Fragment key={index}>
                        {index === 0 ||
                        proveedor.rut !== proveedoresGrupo[index - 1].rut ? (
                          <TableRow sx={{ borderRadius: "10px", boxShadow: 1 }}>
                            <TableCell></TableCell>
                            <TableCell>
                              <strong>{proveedor.rut}</strong></TableCell>
                            <TableCell>
                              <strong> {proveedor.razonSocial}</strong>
                            </TableCell>
                            <TableCell>
                              <strong>
                                {" "}
                                Facturas:{" "}
                                {documentCountsByRut[rut]["FACTURA"] || 0}
                              </strong>
                              <br />
                              <strong>
                                {" "}
                                Boletas:{" "}
                                {documentCountsByRut[rut]["BOLETA"] || 0}
                              </strong>
                              <br />
                              <strong>
                                Tickets:{" "}
                                {documentCountsByRut[rut]["TICKET"] || 0}
                              </strong>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <strong>Total :$ {proveedor.total}</strong>
                            </TableCell>
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
                          <TableCell>${proveedor.total}</TableCell>
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
                  </>
                )
              )}
              {/* Fila del total general */}
              <TableRow>
                <TableCell colSpan={5}></TableCell>
                <TableCell>
                  <strong>Total General:$</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalGeneral}</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
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
                      <TableCell>${selectedProveedor.total}</TableCell>
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
                            <TableCell>${detalle.costo}</TableCell>
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
                    handleOpenPaymentProcess("detalle", selectedProveedor.total)
                  }
                
                >
                  Pagar Total $ ({selectedProveedor.total})
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedIds.length > 0 &&
                            selectedIds.length < groupedProveedores.length
                          }
                          checked={allSelected}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Tipo Documento</TableCell>
                      <TableCell>Folio</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedProveedores.map((proveedor) => (
                      <TableRow key={proveedor.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedIds.includes(proveedor.id)}
                            onChange={(event) =>
                              handleSelectOne(event, proveedor.id)
                            }
                          />
                        </TableCell>
                        <TableCell>{proveedor.tipoDocumento}</TableCell>
                        <TableCell>{proveedor.folio}</TableCell>
                        <TableCell>
                          {dayjs(proveedor.fechaIngreso).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell> ${proveedor.total}</TableCell>
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
                  Total Deuda : {selectedTotal}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleOpenPaymentProcess("totalProveedores", selectedTotal)
                  }
                >
                  Pagar Total ${selectedTotal}
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
                // value={getTotalSelected()}
                value={ montoAPagar }
              
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
                value={Math.max(0, montoAPagar - cantidadPagada)}
               
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
                    handleChequeModalOpen();
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
                    handleTransferenciaModalOpen();
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

      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError}</p>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                name="nombre"
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "nombre")}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                name="rut"
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "rut")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
              <TextField
                select
                label="Banco"
                value={selectedBanco}
                onChange={handleBancoChange}
                fullWidth
              >
                {bancosChile.map((banco) => (
                  <MenuItem key={banco.id} value={banco.nombre}>
                    {banco.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
              Ingresa Tipo de Cuenta{" "}
              </InputLabel>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                  Selecciona Fecha{" "}
                </InputLabel>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={fecha}
                  onChange={(newValue) => {
                    setFecha(newValue);
                  }}
                  minDate={inicioRango}
                  maxDate={hoy}
                  textField={(params) => (
                    <TextField
                      {...params}
                      label="Ingresa Fecha"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formatFecha(fecha)}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Operación
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Numero Operación"
                variant="outlined"
                type="number"
                fullWidth
                value={nroOperacion}
                onChange={(e) => setNroOperacion(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || cantidadPagada <= 0}
                onClick={handlePayment}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openChequeModal}
        onClose={handleChequeModalClose}
      >
        <DialogTitle>Cheque</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError}</p>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                name="nombre"
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "nombre")}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                name="rut"
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "rut")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
              <TextField
                select
                label="Banco"
                value={selectedBanco}
                onChange={handleBancoChange}
                fullWidth
              >
                {bancosChile.map((banco) => (
                  <MenuItem key={banco.id} value={banco.nombre}>
                    {banco.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Serie de Cheque
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Serie de  Cheque"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={serieCheque}
                onChange={(e) => setSerieCheque(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                name="numeroCuenta"
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroCuenta")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InputLabel sx={{ marginBottom: "4%" }}>
                  Selecciona Fecha{" "}
                </InputLabel>
                <DatePicker
                  format="DD-MM-YYYY"
                  value={fecha}
                  onChange={(newValue) => {
                    setFecha(newValue);
                  }}
                  minDate={inicioRango}
                  maxDate={hoy}
                  textField={(params) => (
                    <TextField
                      {...params}
                      label="Ingresa Fecha"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formatFecha(fecha)}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Documento
              </InputLabel>
              <TextField
                name="numeroDocumento"
                label="Numero Documento"
                variant="outlined"
                type="number"
                fullWidth
                value={nroDocumento}
                onChange={(e) => setNroDocumento(e.target.value)}
                onKeyDown={(event) => handleKeyDown(event, "numeroDocumento")}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || cantidadPagada <= 0}
                onClick={handlePayment}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChequeModalClose}>Cerrar</Button>
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
