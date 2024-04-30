/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
function TablaNivel() {
  const [editableRows, setEditableRows] = useState([]);
  const [tableData, setTableData] = useState([
    { desde: '1', hasta: '5', valor: '20,000' },
    { desde: '2', hasta: '7', valor: '50,000' }
  ]);
  const [newRow, setNewRow] = useState({ desde: '', hasta: '', valor: '' });

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
    setTableData([...tableData, newRow]);
    setNewRow({ desde: '', hasta: '', valor: '' });
  };

  const handleDeleteRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleInputChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={12}  >
        <TableContainer component={Paper}
         sx={{ marginRight: "4px" }}>
        <h5>Precios por Unidad o kg</h5>
          <Table size="small">
            <TableHead>
             
              <TableRow>
                <TableCell>Desde</TableCell>
                <TableCell>Hasta</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center" contentEditable={editableRows.includes(index)}>
                    {row.desde}
                  </TableCell>
                  <TableCell align="center" contentEditable={editableRows.includes(index)}>
                    {row.hasta}
                  </TableCell>
                  <TableCell align="center" contentEditable={editableRows.includes(index)}>
                    {row.valor}
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
                      <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleEditRow(index)}
                        >
                          <AddCircleIcon/>
                        </Button>
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
                    name="desde"
                    value={newRow.desde}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="hasta"
                    value={newRow.hasta}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    type="text"
                    name="valor"
                    value={newRow.valor}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" size="small" onClick={handleAddRow}>
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
}

export default TablaNivel;
