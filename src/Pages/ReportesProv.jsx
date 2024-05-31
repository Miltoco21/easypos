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
  Typography
} from "@mui/material";

import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";
import dayjs from "dayjs"; // To format date

const ReportesProv = () => {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Proveedores/GetProveedorCompra"
        );
        const sortedProveedores = response.data.proveedorCompra.proveedorCompraCabeceras.sort((a, b) => {
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

    fetchProveedores();
  }, []);

  const handleClickOpen = (proveedor) => {
    setSelectedProveedor(proveedor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProveedor(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
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
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.id}</TableCell>
                  <TableCell>{proveedor.rut}</TableCell>
                  <TableCell>{proveedor.razonSocial}</TableCell>
                  <TableCell>{proveedor.tipoDocumento}</TableCell>
                  <TableCell>{proveedor.folio}</TableCell>
                  <TableCell>{dayjs(proveedor.fechaIngreso).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{proveedor.total}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleClickOpen(proveedor)}>
                      Acciones
                    </Button>
                  </TableCell>
                </TableRow>
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
              <Typography variant="h6">Proveedor: {selectedProveedor.razonSocial}</Typography>
              <Typography variant="subtitle1">RUT: {selectedProveedor.rut}</Typography>
              <Typography variant="subtitle1">Tipo Documento: {selectedProveedor.tipoDocumento}</Typography>
              <Typography variant="subtitle1">Folio: {selectedProveedor.folio}</Typography>
              <Typography variant="subtitle1">Fecha: {dayjs(selectedProveedor.fechaIngreso).format('DD-MM-YYYY')}</Typography>
              <Typography variant="subtitle1">Total: {selectedProveedor.total}</Typography>
              <Typography variant="h6" style={{ marginTop: '16px' }}>Detalles de Compra:</Typography>
              {selectedProveedor.proveedorCompraDetalles && selectedProveedor.proveedorCompraDetalles.map((detalle) => (
                <div key={detalle.codProducto} style={{ marginBottom: '8px' }}>
                  <Typography variant="body2">
                    {detalle.descripcionProducto} - Cantidad: {detalle.cantidad} - Precio Unidad: {detalle.precioUnidad} - Costo: {detalle.costo}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportesProv;
