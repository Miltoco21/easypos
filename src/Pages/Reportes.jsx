import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../Componentes/NavBar/SideBar";

const Reportes = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      title: "Cuentas Corrientes Clientes",
      path: "/reportes/cuentacorrienteclientes",
      data: [
        { name: "Cliente 1", amount: "$1000" },
        { name: "Cliente 2", amount: "$2000" },
      ],
    },
    {
      title: "Cuentas Corrientes Proveedores",
      path: "/reportes/cuentacorrienteproveedores",
      data: [
        { name: "Proveedor 1", amount: "$1500" },
        { name: "Proveedor 2", amount: "$2500" },
      ],
    },
    {
      title: "Ranking de Venta",
      path: "/reportes/rankingventas",
      data: [
        { name: "Venta 1", amount: "$3000" },
        { name: "Venta 2", amount: "$4000" },
      ],
    },
    {
      title: "Ranking de Venta de Productos",
      path: "/reportes/rankingproductos",
      data: [
        { name: "Producto 1", amount: "$500" },
        { name: "Producto 2", amount: "$600" },
      ],
    },
    {
      title: "Libro Ventas",
      path: "/reportes/rankinglibroventas",
      data: [
        { name: "Libro 1", amount: "$700" },
        { name: "Libro 2", amount: "$800" },
      ],
    },
    {
      title: "Libro Compras",
      path: "/reportes/rankinglibrocompras",
      data: [
        { name: "Compra 1", amount: "$900" },
        { name: "Compra 2", amount: "$1000" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
          Reportes
        </Typography>
        <Grid container alignItems="center" spacing={1} sx={{ flexGrow: 1, p: 2 }}>
          {reportCards.map((report, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card sx={{ margin: 2, height: "auto" }}>
                <CardContent>
                  {/* <Typography variant="h5" component="div" sx={{ backgroundColor: "gainsboro" }}>
                    {report.title}
                  </Typography> */}
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ mt: 2 }}>
                          <TableCell fullWidth > {report.title}</TableCell>
                          {/* <TableCell align="right">Amount</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      <Button
                      fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate(report.path)}
                  >
                    Ver reportes
                  </Button>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
               
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Reportes;
