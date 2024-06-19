import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Paper,
  MenuItem,
  InputLabel,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

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

  const dateRegex = /^(\d{0,4})-?(\d{0,2})-?(\d{0,2})$/;
  const currentValue = e.target.value;
  const newValue = currentValue + e.key;

  if (!dateRegex.test(newValue)) {
    e.preventDefault();
  }
};

const SearchListDocumento = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    idCabeceraCompra: 0,
    rut: "",
    tipoDocumento: "",
    fechaIngreso: "",
    folio: "",

    total: 0,
    proveedorCompraDetalleUpdates: [],
    proveedorCompraPagoUpdates: [],
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [openProduct, setOpenProduct] = useState(false);

  const [searchTermProd, setSearchTermProd] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(
    editFormData.proveedorCompraDetalleUpdates || []
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Proveedores/GetProveedorCompraByFecha`,
        {
          params: {
            fechaDesde: startDate,
            fechaHasta: endDate,
          },
        }
      );
      setData(response.data.proveedorCompraCabeceraReportes);
    } catch (error) {
      setError("Error fetching data");
    }
    setLoading(false);
  };
  console.log("DAtos fechas", data);
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://www.easyposdev.somee.com/api/Proveedores/DeleteProveedorCompra`,
        {
          params: {
            idCabeceraCompra: compraToDelete.idCabeceraCompra,
          },
        }
      );
      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error al eliminar el documento");
      setSnackbarOpen(true);
    }
  };

  const handleEdit = async () => {
    console.log("Datos antes de enviar:", editFormData); // Imprimir los datos antes de enviar

    try {
      const response = await axios.put(
        `https://www.easyposdev.somee.com/api/Proveedores/PutProveedorCompra`,
        editFormData
      );

      console.log("Respuesta del servidor:", response.data); // Imprimir la respuesta del servidor
      setSnackbarMessage(response.data.descripcion);
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error al editar el documento:", error); // Imprimir el error en caso de que ocurra
      setSnackbarMessage("Error al editar el documento");
      setSnackbarOpen(true);
    }
  };

  const filteredData = data.filter((compra) => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (compra && compra.rut && compra.razonSocial) {
      const rut = compra.rut.toString().toLowerCase();
      const razonSocial = compra.razonSocial.toString().toLowerCase();

      return (
        rut.includes(lowercasedFilter) || razonSocial.includes(lowercasedFilter)
      );
    }
    return false;
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (compra) => {
    setSelectedCompra(compra);
    setOpenDialog(true);
  };
  const handleOpenProduct = () => {
    setOpenProduct(true);
  };
  const handleCloseProduct = () => {
    setOpenProduct(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompra(null);
  };

  const handleOpenDeleteDialog = (compra) => {
    setCompraToDelete(compra);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCompraToDelete(null);
  };

  const handleOpenEditDialog = (compra) => {
    setEditFormData({
      idCabeceraCompra: compra.idCabeceraCompra,
      tipoDocumento: compra.tipoDocumento,
      rut: compra.rut,
      folio: compra.folio,
      codigoProveedor: compra.codigoProveedor,
      total: compra.total,
      fechaIngreso: compra.fechaIngreso,
      proveedorCompraDetalleUpdates: compra.detalles.map((detalle) => ({
        idDetalle: detalle.idDetalle,
        codProducto: detalle.codProducto,
        descripcionProducto: detalle.descripcionProducto,
        cantidad: detalle.cantidad,
        precioUnidad: detalle.precioUnidad,
      })),
      proveedorCompraPagoUpdates: compra.pagos.map((pago) => ({
        idPago: pago.idPago,
        fechaIngreso: pago.fechaPago,
        total: 0,
        codigoUsuario: pago.codigoUsuario,
        montoPagado: pago.montoPagado,
        metodoPago: pago.metodoPago,
      })),
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleBuscarClick = () => {
    fetchData();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditDetailChange = (index, field, value) => {
    const newDetails = [...editFormData.proveedorCompraDetalleUpdates];
    newDetails[index][field] = value;
    setEditFormData({
      ...editFormData,
      proveedorCompraDetalleUpdates: newDetails,
    });
  };

  const handleEditPaymentChange = (index, field, value) => {
    const newPayments = [...editFormData.proveedorCompraPagoUpdates];
    newPayments[index][field] = value;
    setEditFormData({
      ...editFormData,
      proveedorCompraPagoUpdates: newPayments,
    });
  };

  const handleNumericKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es un número, backspace o delete
    if (
      !/\d/.test(key) && // números
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  const handleTextKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es alfanumérico o uno de los caracteres permitidos
    if (
      !/^[a-zA-Z0-9]$/.test(key) && // letras y números
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };
  const handleEmailKeyDown = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    // Prevenir espacios en cualquier parte del correo
    if (charCode === 32) {
      // 32 es el código de la tecla espacio
      event.preventDefault();
    }
  };
  const handleRUTKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Permitir números (0-9), guion (-), backspace y delete
    if (
      !isNaN(key) || // números
      key === "Backspace" || // backspace
      key === "Delete" || // delete
      (key === "-" && !input.includes("-")) // guion y no hay guion previamente
    ) {
      // Permitir la tecla
    } else {
      // Prevenir cualquier otra tecla
      event.preventDefault();
    }

    // Prevenir espacios iniciales y asegurar que el cursor no esté en la posición inicial
    if (
      key === " " &&
      (input.length === 0 || event.target.selectionStart === 0)
    ) {
      event.preventDefault();
    }
  };

  const handleTextOnlyKeyDown = (event) => {
    const key = event.key;
    const input = event.target.value;

    // Verifica si el carácter es una letra (mayúscula o minúscula), espacio, backspace o delete
    if (
      !/[a-zA-Z]/.test(key) && // letras mayúsculas y minúsculas
      key !== " " && // espacio
      key !== "Backspace" && // backspace
      key !== "Delete" // delete
    ) {
      event.preventDefault();
    }

    // Previene espacios iniciales y al final de la cadena
    if (key === " " && (input.length === 0 || input.endsWith(" "))) {
      event.preventDefault();
    }
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    setGrandTotal(total);
  };

  ////////////BUSQUEDA PRODUCTO///////
  const handleSearchButtonClick = async () => {
    if (searchTermProd.trim() === "") {
      setSearchedProducts([]);
      setSnackbarMessage("El campo de búsqueda está vacío");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByDescripcion?descripcion=${searchTermProd}&codigoCliente=${0}`
      );

      if (response.data && response.data.cantidadRegistros > 0) {
        setSearchedProducts(response.data.productos);
        setSnackbarMessage(`Productos encontrados`);
      } else {
        setSearchedProducts([]);
        setSnackbarMessage(
          `No se encontraron resultados para "${searchTermProd}"`
        );
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setSnackbarMessage("Error al buscar el producto");
      setSnackbarOpen(true);
    }
  };

  // const handleAddProductToSales = (product) => {
  //   const existingProductIndex = selectedProducts.findIndex(
  //     (p) => p.id === product.idProducto
  //   );

  //   if (existingProductIndex !== -1) {
  //     const updatedProducts = selectedProducts.map((p, index) => {
  //       if (index === existingProductIndex) {
  //         const updatedQuantity = p.cantidad + 1;
  //         return {
  //           ...p,
  //           cantidad: updatedQuantity,
  //           total: updatedQuantity * p.precioCosto,
  //         };
  //       }
  //       return p;
  //     });
  //     setSelectedProducts(updatedProducts);
  //   } else {
  //     const newProduct = {
  //       id: product.idProducto,
  //       nombre: product.nombre,
  //       cantidad: 1,
  //       precio: product.precioCosto,
  //       total: product.precioCosto,
  //       precioCosto: product.precioCosto,
  //     };
  //     setSelectedProducts([...selectedProducts, newProduct]);
  //   }

  //   setSearchedProducts([]);
  // };

  const handleAddProductToSales = (product) => {
    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.id === product.idProducto
    );
  
    let updatedProducts;
    if (existingProductIndex !== -1) {
      updatedProducts = selectedProducts.map((p, index) => {
        if (index === existingProductIndex) {
          const updatedQuantity = p.cantidad + 1;
          return {
            ...p,
            cantidad: updatedQuantity,
            total: updatedQuantity * p.precioCosto,
          };
        }
        return p;
      });
    } else {
      const newProduct = {
        id: product.idProducto,
        nombre: product.nombre,
        cantidad: 1,
        precio: product.precioCosto,
        total: product.precioCosto,
        precioCosto: product.precioCosto,
      };
      updatedProducts = [...selectedProducts, newProduct];
    }
  
    setSelectedProducts(updatedProducts);
  
    // Update the edit form data
    const updatedDetails = [...editFormData.proveedorCompraDetalleUpdates];
    const existingDetailIndex = updatedDetails.findIndex(
      (detail) => detail.idProducto === product.idProducto
    );
  
    if (existingDetailIndex !== -1) {
      updatedDetails[existingDetailIndex].cantidad += 1;
      updatedDetails[existingDetailIndex].total =
        updatedDetails[existingDetailIndex].cantidad *
        updatedDetails[existingDetailIndex].precioUnidad;
    } else {
      updatedDetails.push({
        idProducto: product.idProducto,
        descripcionProducto: product.nombre,
        cantidad: 1,
        precioUnidad: product.precioCosto,
        total: product.precioCosto,
      });
    }
  
    setEditFormData({
      ...editFormData,
      proveedorCompraDetalleUpdates: updatedDetails,
    });
  
    setSearchedProducts([]);
    handleCloseProduct();
    setSearchTermProd("");
    setSelectedProducts([]);

  };


  const handleQuantityChange = (value, index) => {
    const updatedProducts = [...selectedProducts];
    const parsedValue = parseInt(value);

    if (isNaN(parsedValue) || parsedValue < 0) {
      updatedProducts[index].cantidad = 0;
      updatedProducts[index].total = 0;
    } else {
      updatedProducts[index].cantidad = parsedValue;
      updatedProducts[index].total =
        parsedValue * updatedProducts[index].precio;
    }

    setSelectedProducts(updatedProducts);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const grandTotal = selectedProducts.reduce(
    (total, product) => total + product.total,
    0
  );

  ///////////FIN BUSQUEDA PRODUCTO///////
  const handleDeleteDetail = (index) => {
    const updatedDetails = editFormData.proveedorCompraDetalleUpdates.filter(
      (detail, detailIndex) => detailIndex !== index
    );
    setEditFormData({
      ...editFormData,
      proveedorCompraDetalleUpdates: updatedDetails,
    });
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Documentos de Compra" />
      </Tabs>
      <div role="tabpanel" hidden={selectedTab !== 0}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Fecha Inicio (AAAA-MM-DD)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onKeyDown={validateDateInput}
              placeholder="AAAA-MM-DD"
              margin="dense"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Fecha Término (AAAA-MM-DD)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onKeyDown={validateDateInput}
              placeholder="AAAA-MM-DD"
              margin="dense"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button sx={{ p: 2, mb: 4 }}
            variant="contained" onClick={handleBuscarClick} fullWidth>
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
            onClose={handleSnackbarClose}
          />
        ) : (
          <>
            <Grid>
              <TextField
                sx={{ width: 500 }}
                label="Buscar por RUT o Razón Social"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Grid>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>RUT</TableCell>
                    <TableCell>Razón Social</TableCell>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Folio</TableCell>
                    <TableCell>Fecha Ingreso</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((compra) => (
                    <TableRow key={compra.idCabeceraCompra}>
                      <TableCell>{compra.idCabeceraCompra}</TableCell>
                      <TableCell>{compra.rut}</TableCell>
                      <TableCell>{compra.razonSocial}</TableCell>
                      <TableCell>{compra.tipoDocumento}</TableCell>
                      <TableCell>{compra.folio}</TableCell>
                      <TableCell>
                        {new Date(compra.fechaIngreso).toLocaleDateString(
                          "es-ES"
                        )}
                      </TableCell>
                      <TableCell>{compra.total}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDialog(compra)}
                        >
                          Detalle
                        </Button>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(compra)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenEditDialog(compra)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Detalles del Documento</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>
                    <strong>RUT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Razón Social</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tipo Documento</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Folio</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha Ingreso</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedCompra?.rut}</TableCell>
                  <TableCell>{selectedCompra?.razonSocial}</TableCell>
                  <TableCell>{selectedCompra?.tipoDocumento}</TableCell>
                  <TableCell>{selectedCompra?.folio}</TableCell>
                  <TableCell>
                    {new Date(selectedCompra?.fechaIngreso).toLocaleDateString(
                      "es-ES"
                    )}
                  </TableCell>
                  <TableCell>{selectedCompra?.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            Detalle de productos :
          </div>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unidad</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCompra?.detalles.map((detalle) => (
                  <TableRow key={detalle.idDetalle}>
                    <TableCell>{detalle.descripcionProducto}</TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>{detalle.precioUnidad}</TableCell>
                    <TableCell>
                      {detalle.cantidad * detalle.precioUnidad}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            Detalles de Pagos :
          </div>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, maxWidth: "90%", margin: "auto" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "gainsboro" }}>
                  <TableCell>Monto Pagado</TableCell>
                  <TableCell>Método de Pago</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCompra?.pagos.map((pagos) => (
                  <TableRow key={pagos.idPago}>
                    <TableCell>{pagos.montoPagado}</TableCell>
                    <TableCell>{pagos.metodoPago}</TableCell>
                    <TableCell>
                      {new Date(pagos.fechaPago).toLocaleDateString("es-ES")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Documento</DialogTitle>
        <DialogContent>
          <TextField
            name="tipoDocumento" // Asegúrate de que el nombre coincide con el campo en editFormData
            margin="dense"
            select
            label="Tipo de documento"
            value={editFormData.tipoDocumento}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Factura">Factura</MenuItem>
            <MenuItem value="Boleta">Boleta</MenuItem>
            <MenuItem value="Ticket">Ticket</MenuItem>
            <MenuItem value="Ingreso Interno">Ingreso Interno</MenuItem>
          </TextField>
          <TextField
            fullWidth
            id="rut"
            label="ej: 11111111-1"
            name="rut"
            autoComplete="rut"
            autoFocus
            value={editFormData.rut}
            onChange={handleEditFormChange}
            onKeyDown={handleRUTKeyDown}
          />

          <TextField
            margin="dense"
            name="folio"
            label="Folio"
            value={editFormData.folio}
            onChange={handleEditFormChange}
            onKeyDown={handleNumericKeyDown}
            fullWidth
          />

          <TextField
            margin="dense"
            name="total"
            label="Total"
            type="number"
            value={editFormData.total}
            onChange={handleEditFormChange}
            fullWidth
            onKeyDown={handleNumericKeyDown}
            
          />
          <TextField
            margin="dense"
            name="fechaIngreso"
            label="Fecha ingreso"
            type="date" // Cambia el tipo a date para mostrar solo la fecha
            InputLabelProps={{
              shrink: true,
            }}
            value={
              editFormData.fechaIngreso
                ? new Date(editFormData.fechaIngreso)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleEditFormChange}
            fullWidth
          />

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unidad</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editFormData.proveedorCompraDetalleUpdates.map(
                  (detalle, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{width:"30%"}}>
                        <TextField
                          margin="dense"
                          label="Descripción"
                          value={detalle.descripcionProducto}
                          onChange={(e) =>
                            handleEditDetailChange(
                              index,
                              "descripcionProducto",
                              e.target.value
                            )
                          }
                          fullWidth
                          inputProps={{
                           
                            readOnly:true
                          }}

                        />
                      </TableCell>
                      <TableCell sx={{width:"30%"}}>
                        <TextField
                          margin="dense"
                          label="Cantidad"
                
                          value={detalle.cantidad}
                          onChange={(e) =>
                            handleEditDetailChange(
                              index,
                              "cantidad",
                              e.target.value
                            )
                          }
                          fullWidth
                          onKeyDown={handleNumericKeyDown}
                        
                        />
                      </TableCell>
                      <TableCell  sx={{width:"30%"}}>
                        <TextField
                       
                          margin="dense"
                          label="Precio Unidad"
                         
                          value={detalle.precioUnidad}
                          onChange={(e) =>
                            handleEditDetailChange(
                              index,
                              "precioUnidad",
                              e.target.value
                            )
                          }
                          fullWidth
                          inputProps={{
                           
                            readOnly:true
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {detalle.cantidad * detalle.precioUnidad}
                      </TableCell>
                      <TableCell >
                        <Grid sx={{display:"flex"}}> <IconButton onClick={handleOpenProduct}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteDetail(index)}>
                          <DeleteIcon />
                        </IconButton></Grid>
                       
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {" "}
                  <TableCell>Monto Pagado</TableCell>
                  <TableCell>Método Pago</TableCell>
                  <TableCell>Fecha Pago</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editFormData.proveedorCompraPagoUpdates.map((pago, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        margin="dense"
                        label="Monto Pagado"
                        type="number"
                        value={pago.montoPagado}
                        onChange={(e) =>
                          handleEditPaymentChange(
                            index,
                            "montoPagado",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        margin="dense"
                        label="Método Pago"
                        value={pago.metodoPago}
                        onChange={(e) =>
                          handleEditPaymentChange(
                            index,
                            "metodoPago",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        margin="dense"
                        label="Fecha Pago"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={
                          pago.fechaPago
                            ? new Date(pago.fechaPago)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleEditPaymentChange(
                            index,
                            "fechaPago",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        margin="dense"
                        label="total"
                        type="number"
                        value={pago.total}
                        onChange={(e) =>
                          handleEditPaymentChange(
                            index,
                            "total",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEdit} color="primary">
            EDITAR
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este documento?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained"color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProduct} onClose={handleCloseProduct}>
        <DialogTitle>Selecciona producto</DialogTitle>
        <DialogContent>
          <div style={{ alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder="Buscar producto por descripción"
              value={searchTermProd}
              onChange={(e) => setSearchTermProd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchButtonClick();
                }
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSearchButtonClick}
              sx={{ mb: 2 }}
            >
              Buscar
            </Button>
            <TableContainer component={Paper} style={{ maxHeight: 200 }}>
              <Table>
                <TableBody>
                  {searchedProducts.map((product) => (
                    <TableRow key={product.idProducto}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell>Plu: {product.idProducto}</TableCell>
                      <TableCell>Precio Costo: {product.precioCosto}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleAddProductToSales(product)}
                          variant="contained"
                          color="secondary"
                        >
                          Agregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} style={{ maxHeight: 200 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio Costo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell>{product.precioCosto}</TableCell>
                      <TableCell>
                        <TextField
                          value={product.cantidad}
                          onChange={(e) =>
                            handleQuantityChange(e.target.value, index)
                          }
                          InputProps={{
                            maxLength: 3,
                          }}
                        />
                      </TableCell>
                      <TableCell>{product.total}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteProduct(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid gap={3}sx={{ display: "flex", justifyContent:"space-arround" }}>
              <TextField
                label="Total"
                value={grandTotal}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 2 }}
              />
              <Button variant="contained"
                onClick={() => handleAddProductToSales(product)}
               color="secondary"
              sx={{ width:"60%", mt:2, }}>Agregar producto</Button>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchListDocumento;
