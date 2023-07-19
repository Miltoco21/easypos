/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TablaPrecios = () => {
  const [editableRows, setEditableRows] = useState([]);
  const [tableData, setTableData] = useState([
    { id: 1, detalle: "1", mayor1: "5", mayor2: "20,000", mayor3: "22" },
  ]);
  const [newRow, setNewRow] = useState({
    detalle: "",
    mayor1: "",
    mayor2: "",
    mayor3: "",
  });

  const handleEditRow = (index) => {
    if (!editableRows.includes(index)) {
      setEditableRows([...editableRows, index]);
    }
  };

  const handleSaveRow = (index) => {
    if (editableRows.includes(index)) {
      setEditableRows(editableRows.filter((rowIndex) => rowIndex !== index));
    }
  };

  const handleAddRow = () => {
    const newId = tableData.length + 1;
    setTableData([...tableData, { id: newId, ...newRow }]);

    setNewRow({ detalle: "", mayor1: "", mayor2: "", mayor3: "" });
  };

  const handleDeleteRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleInputChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={14}>
        <TableContainer component={Paper}>
          <h5>Por Lista de Precios</h5>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Detalle</TableCell>
                <TableCell>Mayor 1</TableCell>
                <TableCell>Mayor 2</TableCell>
                <TableCell>Mayor 3</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    align="center"
                    contentEditable={editableRows.includes(index)}
                  >
                    {row.detalle}
                  </TableCell>
                  <TableCell
                    align="center"
                    contentEditable={editableRows.includes(index)}
                  >
                    {row.mayor1}
                  </TableCell>
                  <TableCell
                    align="center"
                    contentEditable={editableRows.includes(index)}
                  >
                    {row.mayor2}
                  </TableCell>
                  <TableCell
                    align="center"
                    contentEditable={editableRows.includes(index)}
                  >
                    {row.mayor3}
                  </TableCell>
                  <TableCell align="center">
                    {editableRows.includes(index) ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSaveRow(index)}
                      >
                        <CheckCircleIcon/> {/* Guardar */}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleEditRow(index)}
                        >
                          <AddCircleIcon/>
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      <DeleteIcon/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="detalle"
                    value={newRow.detalle}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="mayor1"
                    value={newRow.mayor1}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="mayor2"
                    value={newRow.mayor2}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="mayor3"
                    value={newRow.mayor3}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddRow}
                  >
                    Crear
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default TablaPrecios;
