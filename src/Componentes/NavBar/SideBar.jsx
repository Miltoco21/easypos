/* eslint-disable no-unused-vars */
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';



const drawerWidth = 200;

const menuItems = [
  { text: "Home", link: "/",icon:<HomeIcon/> },
  { text: "Usuarios", link: "/usuarios" ,icon:<PeopleAltIcon/>},
  { text: "Precios", link: "/precios",icon:<PriceChangeIcon/> },
  { text: "Proveedores", link: "/proveedores",icon:<LocalShippingIcon/> },
];

export default function PermanentDrawerLeft() {
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
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        
      </Drawer>
    </Box>
  );
}
