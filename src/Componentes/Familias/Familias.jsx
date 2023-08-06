/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container } from "@mui/material";

import Nuevo from "./Nuevo";

const Familias = () => {
  const [data, setData] = useState([] || initialData);
  const [newFamilia, setNewFamilia] = useState("");

  const [initialData] = useState([
    {
      id: "1",
      name: "Familia 1",
      subProducts: [
        {
          id: "1",
          name: "Sub Familia 1",
          items: [
            {
              id: "1",
              name: "Item 1",
              price: 10,
            },
          ],
        },
      ],
    },
  ]);

  const handleAddProduct = () => {
    setData([...data, { id: generateId(), name: newFamilia, subProducts: [] }]);
    setNewFamilia("");
  };

  const handleAddSubProduct = (productId, subProductData) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === productId
          ? {
              ...product,
              subProducts: [
                ...(product.subProducts || []),
                { id: uuidv4(), ...subProductData, items: [] },
              ],
            }
          : product
      )
    );
  };

  const handleEditCell = (
    productId,
    subProductId,
    itemId,
    columnName,
    newValue
  ) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === productId
          ? {
              ...product,
              subProducts: product.subProducts.map((subProduct) =>
                subProduct.id === subProductId
                  ? {
                      ...subProduct,
                      items: subProduct.items.map((item) =>
                        item.id === itemId
                          ? { ...item, [columnName]: newValue }
                          : item
                      ),
                    }
                  : subProduct
              ),
            }
          : product
      )
    );
  };

  const handleDeleteCell = (productId, subProductId, itemId) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === productId
          ? {
              ...product,
              subProducts: (product.subProducts || []).map((subProduct) =>
                subProduct.id === subProductId
                  ? {
                      ...subProduct,
                      items: subProduct.items.filter(
                        (item) => item.id !== itemId
                      ),
                    }
                  : subProduct
              ),
            }
          : product
      )
    );
  };

  const handleAddItem = (productId, subProductId, itemData) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === productId
          ? {
              ...product,
              subProducts: product.subProducts.map((subProduct) =>
                subProduct.id === subProductId
                  ? {
                      ...subProduct,
                      items: [
                        ...(subProduct.items || []),
                        { ...itemData, id: generateId() },
                      ],
                    }
                  : subProduct
              ),
            }
          : product
      )
    );
  };

  const generateId = () => {
    return uuidv4();
  };

  return (
    <Container>
      <h1>Ingreso Familias</h1>

      <Nuevo />
    </Container>
  );
};

export default Familias;
