import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";


const drawerWidth = 200;

const menuItems = [
  { text: "Home", link: "/", icon: <HomeIcon /> },
  { text: "Usuarios", link: "/usuarios", icon: <PeopleAltIcon /> },
  { text: "Precios", link: "/precios", icon: <PriceChangeIcon /> },
  { text: "Proveedores", link: "/proveedores", icon: <LocalShippingIcon /> },
  {
    text: "Productos",
    link: "/productos",
    icon: <CategoryIcon />,
    subMenuItems: [
      { text: "Categorias", link: "/categorias",icon: <CategoryIcon />},
      { text: "Sub-Categorias", link: "/subcategorias" },
      { text: "Familia", link: "/familias" },
      { text: "Sub-Familia", link: "/subfamilias" },
      // Add more sub-menu items as needed
    ],
  },
];

export default function PermanentDrawerLeft() {
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  const handleSubMenuClick = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Link
                to={item.link}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton onClick={item.text === "Productos" ? handleSubMenuClick : undefined}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.text === "Productos" ? (
                    openSubMenu ? <ExpandLess /> : <ExpandMore />
                  ) : null}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        {menuItems.find((item) => item.text === "Productos" && openSubMenu) && (
          <List component="div" disablePadding>
            {menuItems
              .find((item) => item.text === "Productos")
              .subMenuItems.map((subItem) => (
                <ListItem key={subItem.text} disablePadding>
                  <Link
                    to={subItem.link}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemButton>
                      <ListItemIcon />
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText primary={subItem.text} />
                      
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
          </List>
        )}
      </Drawer>
    </Box>
  );
}
