/* eslint-disable no-unused-vars */

import React, { useState } from "react";

import Buscador from "./Buscador";
import Buscador2 from "./Buscador2";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TablaNivel from "./TablaNivel";

import Textarea from "@mui/joy/Textarea";
import PercentIcon from "@mui/icons-material/Percent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import axios from "axios";

import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import TablaPrecios from "./TablaPrecios";

const defaultTheme = createTheme();

const PreciosGenerales = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "900vh", width: "150vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={8}
          md={12}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 2,
              mx: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h4>Precios Generales</h4>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={11}>
                  <Buscador />
                  <br />
                  <Buscador2 />
                  <br />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" sx={{ marginRight: "8px" }}>
                      Precio de costo
                    </Typography>
                    <TextField id="precioCosto" size="small" />{" "}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Button
                      size="md"
                      variant="contained"
                      sx={{ marginRight: "8px" }}
                    >
                      Agregar
                      <PercentIcon />
                    </Button>
                    <TextField id="porcentaje" size="small" />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center">
                    <Button
                      size="md"
                      variant="contained"
                      sx={{ marginRight: "8px" }}
                    >
                      Agregar <AttachMoneyIcon />
                    </Button>
                    <TextField id="precio" size="small" />
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginTop: "15px" }}
                  >
                    <Typography variant="body1" sx={{ marginRight: "8px" }}>
                      Precio final de venta{" "}
                    </Typography>
                    <TextField id="precioCosto" size="small" /> <br />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginTop: "15px" }}
                  >
                    <TablaNivel />
                    <TablaPrecios/>
                  </Box>
                </Grid>
              </Grid>

              <Button
                type="submit"
                size="md"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                guardar Precio
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default PreciosGenerales;
