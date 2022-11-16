import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Redirect, Route, Switch } from "react-router-dom";
import MainContent from "./components/layout/MainContent";
import PermanentDrawer from "./components/layout/PermanentDrawer";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#e91e63",
      },
      secondary: {
        main: "#8e24aa",
      },
      background: {
        default: "#0a1929",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PermanentDrawer />
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" exact>
          <MainContent>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Welcome to Kubergames!</Typography>
            </Box>
          </MainContent>
        </Route>
        <Route path="/space-invaders" exact>
          <MainContent>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Space Invaders</Typography>
            </Box>
          </MainContent>
        </Route>
        <Route path="/snake-game" exact>
          <MainContent>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Snake game</Typography>
            </Box>
          </MainContent>
        </Route>
        <Route path="/minesweeper" exact>
          <MainContent>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Minesweeper</Typography>
            </Box>
          </MainContent>
        </Route>
        <Route path="/flappy-bird" exact>
          <MainContent>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Flappy Bird</Typography>
            </Box>
          </MainContent>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
