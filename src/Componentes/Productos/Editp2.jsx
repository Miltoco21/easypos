/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const Editp2 = ({ product, open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        {product && (
          <div>
            <TextField
              label="Product Name"
              defaultValue={product.nombre}
              // Add necessary handlers to update the product name
            />
            <TextField
              label="Product Description"
              defaultValue={product.descripcion}
              // Add necessary handlers to update the product description
            />
            {/* Include more fields for other product details */}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button  color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Editp2;
