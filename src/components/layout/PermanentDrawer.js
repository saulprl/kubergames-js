import { useHistory } from "react-router-dom";

import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GamesIcon from "@mui/icons-material/Games";

const PermanentDrawer = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const drawerWidth = 240;

  const drawerButtons = [
    {
      text: "Inicio",
      icon: <HomeIcon />,
      onClick: (event) => {
        history.push("/home");
      },
      selected: /home/i.test(history.location.pathname),
    },
    {
      text: "Space Invaders",
      icon: <GamesIcon />,
      onClick: (event) => {
        history.push("/space-invaders");
      },
      selected: /space-invaders/i.test(history.location.pathname),
    },
    {
      text: "Snake Game",
      icon: <GamesIcon />,
      onClick: (event) => {
        history.push("/snake-game");
      },
      selected: /snake-game/i.test(history.location.pathname),
    },
    {
      text: "Buscaminas",
      icon: <GamesIcon />,
      onClick: (event) => {
        history.push("/minesweeper");
      },
      selected: /minesweeper/i.test(history.location.pathname),
    },
    {
      text: "Flappy Bird",
      icon: <GamesIcon />,
      onClick: (event) => {
        history.push("/flappy-bird");
      },
      selected: /flappy-bird/i.test(history.location.pathname),
    },
  ];

  const drawer = (
    <Box component="div" sx={{ width: "240px" }}>
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: theme.palette.primary.main,
        }}
      >
        <Typography variant="h6">Kubergames</Typography>
      </Toolbar>
      <Divider />
      {drawerButtons.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton selected={item.selected} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="nav" sx={{ width: `${drawerWidth}px`, flexShrink: 0 }}>
        <Drawer variant="permanent">{drawer}</Drawer>
      </Box>
    </Box>
  );
};

export default PermanentDrawer;
