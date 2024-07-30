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
import PolylineIcon from '@mui/icons-material/Polyline';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FactCheckIcon from '@mui/icons-material/FactCheck';



const drawerWidth = 240;

const menuItems = [
  { text: "Home", link: "/", icon: <HomeIcon /> },
  { text: "Usuarios", link: "/usuarios", icon: <PeopleAltIcon /> },
  { text: "Precios", link: "/precios", icon: <PriceChangeIcon /> },
  {
    text: "Proveedores",
    link: "/proveedores",
    icon: <LocalShippingIcon />,
    subMenuItems: [
      { text: "Ingreso Documento", link: "/proveedores/ingresodocumento", icon: <ReceiptIcon /> },
      { text: "Documentos por pagar ", link: "/proveedores/reportes", icon: <ReceiptIcon /> },
    ],
  },
  { text: "Clientes", link: "/clientes", icon: <GroupsIcon/>, subMenuItems: [
    
    { text: "Documentos por cobrar", link: "/clientes/reportes", icon: <ReceiptIcon /> },
  ], },
  
  {
    text: "Productos",
    link: "/productos",
    icon: <CategoryIcon />,
    subMenuItems: [
      { text: "Categorias", link: "/productos/categorias",icon: <CategoryIcon />},
      { text: "Sub-Categorias", link: "/productos/subcategorias",icon: <PolylineIcon /> },
      { text: "Familia", link: "/productos/familias",icon:<StackedBarChartIcon/> },
      { text: "Sub-Familia", link: "/productos/subfamilias",icon:<SchemaOutlinedIcon/> },
      // Add more sub-menu items as needed
    ],
  },
  {
    text: "Reportes",
    link: "/reportes",
    icon: <FactCheckIcon />,
    subMenuItems: [
      { text: "Cuentas corrientes clientes", link: "/reportes/cuentacorrienteclientes",icon: <SummarizeIcon />},
      { text: "Cuentas corrientes proveedores", link: "/reportes/cuentacorrienteproveedores",icon: <SummarizeIcon />},
      { text: "Ranking de Venta", link: "/reportes/rankingventas",icon: <SummarizeIcon />},
      { text: "Ranking de Venta de Productos", link: "/reportes/rankingproductos",icon: <SummarizeIcon />},
      { text: "Libro de Ventas", link: "/reportes/rankinglibroventas",icon: <SummarizeIcon />},
      { text: "Libro de Compras", link: "/reportes/rankinglibrocompras",icon: <SummarizeIcon />},


    
    ],
  },
];

export default function PermanentDrawerLeft() {
  const [openSubMenu, setOpenSubMenu] = React.useState({});

  const handleSubMenuClick = (text) => {
    setOpenSubMenu((prevOpenSubMenu) => ({
      ...prevOpenSubMenu,
      [text]: !prevOpenSubMenu[text],
    }));
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
           
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <Link
                  to={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton onClick={() => handleSubMenuClick(item.text)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subMenuItems ? (
                      openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />
                    ) : null}
                  </ListItemButton>
                </Link>
              </ListItem>
              {item.subMenuItems && openSubMenu[item.text] && (
                <List component="div" disablePadding>
                  {item.subMenuItems.map((subItem) => (
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
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
