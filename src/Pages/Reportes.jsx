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
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SideBar from "../Componentes/NavBar/SideBar";
import axios from "axios";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Reportes = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Grid component="main" sx={{ flexGrow: 1, p: 3 }}>
      </Grid>
       
    </div>
  )
}

export default Reportes