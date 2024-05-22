/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Snackbar,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Checkbox,
  DialogActions,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditarProveedor from "./EditarProveedor"; // Assuming you have this component
import PaymentsIcon from "@mui/icons-material/Payments";

const ITEMS_PER_PAGE = 10;

const SearchListProveedores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermProveedores, setSearchTermProveedores] = useState(""); // Separate state for proveedores search
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProveedorData, setEditProveedorData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageProveedores, setPageProveedores] = useState([]);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedProvedoor, setSelectedProvedoor] = useState("");
  const [proveedorCompras, setProveedorCompras] = useState([]);
  const [montoPagado, setMontoPagado] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);

  const [codigoProveedor, setCodigoProveedor] = useState("");
  const [proveedorData, setProveedorData] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalGeneral, setTotalGeneral] = useState(0);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProveedorToDelete, setSelectedProveedorToDelete] =
    useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCheckboxChange = (event, id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    setSelectedItems(newSelected);
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    setSelectedItems(
      event.target.checked ? proveedorData.map((compra) => compra.id) : []
    );
  };

  const calculateTotal = () => {
    let total = 0;
    if (proveedorData) {
      proveedorData.forEach((compra) => {
        if (selectedItems.includes(compra.id)) {
          const monto = parseFloat(compra.total);
          if (!isNaN(monto)) {
            total += monto;
          }
        }
      });
    }
    return total;
  };

  useEffect(() => {
    const total = calculateTotal();
    setTotalGeneral(total);
  }, [selectedItems, proveedorData]);

  const buscarProveedor = () => {
    const proveedorEncontrado = proveedorCompras.filter(
      (compra) => compra.codigoProveedor === parseInt(codigoProveedor)
    );
    setProveedorData(proveedorEncontrado);
    console.log("proveedorData", proveedorData);
  };
  const handleChange = (event) => {
    setCodigoProveedor(event.target.value);
  };
  const [
    filteredProveedoresByResponsable,
    setFilteredProveedoresByResponsable,
  ] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // useEffect(() => {
  //   if (proveedores) {
  //     setTotalPages(Math.ceil(proveedores.length / ITEMS_PER_PAGE));
  //   }
  // }, [proveedores]);

  useEffect(() => {
    if (proveedores) {
      const filtered = proveedores.filter((proveedor) =>
        proveedor.nombreResponsable
          .toLowerCase()
          .includes(searchTermProveedores.toLowerCase())
      );
      setPageProveedores(
        filtered.slice(
          ITEMS_PER_PAGE * (currentPage - 1),
          ITEMS_PER_PAGE * currentPage
        )
      );
    }
  }, [proveedores, searchTermProveedores, currentPage]);

  ///////proveedores data
  useEffect(() => {
    async function fetchProveedores() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Proveedores/GetAllProveedores"
        );
        console.log("API response:", response.data.proveedores);
        setProveedores(response.data.proveedores);
        setFilteredProveedores(
          response.data.proveedores.slice(0, ITEMS_PER_PAGE)
        );
        setPageCount(response.data.proveedores.length);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProveedores();
  }, [refresh]);

  useEffect(() => {
    const provedorSeleccionado = proveedorCompras.filter(
      (compra) => compra.codigoProveedor === selectedProvedoor.codigoProveedor
    );
    setProveedorData(provedorSeleccionado);
  }, [proveedorCompras, selectedProvedoor]);

  const fetchComprasProvedeedor = async () => {
    try {
      const response = await axios.get(
        "https://www.easyposdev.somee.com/api/Proveedores/GetProveeedorCompra"
      );
      console.log(
        "ComprasProvedeedor:",
        response.data.proveedorCompra.proveedorCompraCabeceras
      );
      setProveedorCompras(
        response.data.proveedorCompra.proveedorCompraCabeceras
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComprasProvedeedor();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}-${month < 10 ? "0" + month : month}-${year}`;
  };
  const handlePago = (selectedItems) => {
    if (selectedItems.length === 0) {
      alert("No hay elementos seleccionados para pagar.");
      return;
    }

    const compraDeudaIds = selectedItems.map((id) => {
      const compra = proveedorData.find((c) => c.id === id);
      if (!compra) {
        console.error(`Compra con ID ${id} no encontrada en proveedorData.`);
        return null;
      }
      return {
        idProveedorCompraCabecera: compra.id,
        total: compra.total,
      };
    });

    const validCompraDeudaIds = compraDeudaIds.filter(
      (compra) => compra !== null
    );

    if (validCompraDeudaIds.length === 0) {
      alert("No hay solicitudes de pago válidas para procesar.");
      return;
    }

    const pagoData = {
      fechaIngreso: new Date().toISOString(),
      codigoUsuario: 0,
      codigoSucursal: 0,
      puntoVenta: "string",
      compraDeudaIds: validCompraDeudaIds,
      montoPagado: validCompraDeudaIds.reduce(
        (total, compra) => total + compra.total,
        0
      ),
      metodoPago: "Efectivo",
    };

    axios
      .post(
        "https://www.easyposdev.somee.com/api/Proveedores/AddProveeedorCompraPagar",
        pagoData
      )
      .then((response) => {
        if (
          response.status === 201 &&
          response.data.descripcion === "Compra pagar realizada con exito."
        ) {
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);
          console.log("respuesta 201", response.data.descripcion);

          fetchComprasProvedeedor();

          setSelectAll(false);
          setSelectedItems([]);

          setTimeout(() => {
            setOpenPaymentDialog(false);
          }, "3000");
        } else {
          setSnackbarMessage(
            "Pago realizado, pero con problemas en la respuesta del servidor"
          );
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error realizando el pago:", error);
        setSnackbarMessage("Error realizando el pago");
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    setProveedores(); // Initial fetch of sub-families
  }, [refresh]);
  ///////Codigo de busqueda
  useEffect(() => {
    if (Array.isArray(proveedores)) {
      const filtered = proveedores.filter((proveedor) =>
        proveedor.nombreResponsable
          .toLowerCase()
          .includes(searchTermProveedores.toLowerCase())
      );
      setPageProveedores(filtered.slice(0, ITEMS_PER_PAGE));
      setPageCount(filtered.length);
      setCurrentPage(1); // Reset current page when the search term changes
    }
  }, [searchTermProveedores, proveedores]);

  const handleSearchProveedores = (event) => {
    setSearchTermProveedores(event.target.value);
  };

  const handleEdit = (proveedor) => {
    setEditProveedorData(proveedor);
    setOpenEditModal(true);
    setIsEditSuccessful(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);

    setFilteredProveedores(filteredItems.slice(0, ITEMS_PER_PAGE));
    setTotalPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };
  const setPageCount = (proveedoresCount) => {
    setTotalPages(Math.ceil(proveedoresCount / ITEMS_PER_PAGE));
  };
  const updatePageData = () => {
    if (proveedores) {
      setFilteredProveedores(
        proveedores.slice(
          ITEMS_PER_PAGE * (currentPage - 1),
          ITEMS_PER_PAGE * currentPage
        )
      );
    }
  };
  useEffect(() => {
    updatePageData();
  }, [proveedores, searchTerm, currentPage, filteredProveedores]);

  useEffect(() => {
    if (isEditSuccessful) {
      setOpenEditModal(false); // Close the modal on successful edit
      setIsEditSuccessful(false); // Reset success state
    }
  }, [isEditSuccessful]);

  const onEditSuccess = () => {
    setIsEditSuccessful(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenPaymentDialog = (provedoor) => {
    setSelectedProvedoor(provedoor);
    setOpenPaymentDialog(true);
    console.log("selectedProveedor:", provedoor);
    // Filtrar los datos de proveedorCompras según el código de proveedor seleccionado
    const provedorSeleccionado = proveedorCompras.filter(
      (compra) => compra.codigoProveedor === provedoor.codigoProveedor
    );
    console.log("Proveedor Compras Filtrados:", provedorSeleccionado);
    setProveedorData(provedorSeleccionado);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };
  const handleDeleteDialogOpen = (proveedor) => {
    setSelectedProveedorToDelete(proveedor);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://www.easyposdev.somee.com/api/Proveedores/DeleteProveedor/${selectedProveedorToDelete.codigoProveedor}`
      );
      setRefresh((prevRefresh) => !prevRefresh);
      setOpenDeleteDialog(false);
      alert("Proveedor eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando el proveedor:", error);
      alert("Error eliminando el proveedor");
    }
  };
  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Proovedores" />
          {/* <Tab label="Clientes" /> */}
        </Tabs>
        <div style={{ p: 2, mt: 4 }} role="tabpanel" hidden={selectedTab !== 0}>
          <TextField
            label="Buscar..."
            value={searchTermProveedores}
            onChange={handleSearchProveedores}
            margin="dense"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Proveedor</TableCell>
                <TableCell>Razón Social</TableCell>

                <TableCell>Responsable</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Forma de pago</TableCell>
                <TableCell>Página</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProveedores?.map((proveedor) => (
                <TableRow key={proveedor.codigoProveedor}>
                  <TableCell>{proveedor.codigoProveedor}</TableCell>
                  <TableCell>
                    {proveedor.razonSocial} <br />
                    <span style={{ color: "purple" }}>{proveedor.email}</span>
                    {proveedor.correo}
                    <br />
                    {proveedor.rut}
                  </TableCell>

                  <TableCell>
                    {proveedor.nombreResponsable}
                    <br />
                    {proveedor.correoResponsable}
                    <br />
                    {proveedor.telefonoResponsable}
                    <br />
                  </TableCell>
                  <TableCell>
                    {proveedor.sucursal}
                    <br />
                    {proveedor.direccion}
                    <br />
                    {proveedor.comuna}
                    <br />
                  </TableCell>
                  <TableCell>{proveedor.formaPago}</TableCell>
                  <TableCell>{proveedor.pagina}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(proveedor)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon
                        onClick={() => handleDeleteDialogOpen(proveedor)}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenPaymentDialog(proveedor)}
                    >
                      <PaymentsIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Box sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Box>
      <EditarProveedor
        open={openEditModal}
        handleClose={handleCloseEditModal}
        proveedor={editProveedorData}
        fetchProveedores={setProveedores}
        onEditSuccess={() => setIsEditSuccessful(true)} // New addition
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pago Cuenta Proveedores</DialogTitle>
        <DialogContent>
          <div>
            <Paper>
              <Grid sx={{ display: "flex" }}>
                <Grid sx={{ margin: 3 }}>
                  <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                </Grid>
                <Grid sx={{ margin: 3 }}>
                  <Typography variant="body2" sx={{ color: "#696c6f" }}>
                    Provedoor: {selectedProvedoor.nombreResponsable}
                    <br />
                    RUT: {selectedProvedoor.rut}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </TableCell>
                  <TableCell>Fecha de ingreso</TableCell>
                  <TableCell>Tipo de documento</TableCell>
                  <TableCell>Folio</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proveedorData &&
                  proveedorData.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(compra.id)}
                          onChange={(event) =>
                            handleCheckboxChange(event, compra.id)
                          }
                        />
                      </TableCell>
                      <TableCell>{formatDate(compra.fechaIngreso)}</TableCell>
                      <TableCell>{compra.tipoDocumento}</TableCell>
                      <TableCell>{compra.folio}</TableCell>
                      <TableCell>{compra.total}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Typography variant="h6" gutterBottom>
              Monto total a pagar: {totalGeneral}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button onClick={() => handlePago(selectedItems)} color="primary">
            Pagar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar al proveedor seleccionado?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={handleDelete} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchListProveedores;
