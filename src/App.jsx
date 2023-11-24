import { useEffect, useState } from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import SnakeGamePage from "./components/pages/SnakeGamePage";
import FlappyBirdPage from "./components/pages/FlappyBirdPage";
import MinesweeperPage from "./components/pages/MinesweeperPage";
import SpaceInvadersPage from "./components/pages/SpaceInvadersPage";
import MazePage from "./components/pages/maze-page";
import LangtonsPage from "./components/pages/langtons-page";

function App() {
  const [title, setTitle] = useState("Inicio");
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/home") {
      setTitle("Kubergames");
    }
    if (pathname === "/space-invaders") {
      setTitle("Space Invaders");
    }
    if (pathname === "/snake-game") {
      setTitle("Snake Game");
    }
    if (pathname === "/minesweeper") {
      setTitle("Buscaminas");
    }
    if (pathname === "/flappy-bird") {
      setTitle("Flappy Bird");
    }
  }, [pathname]);

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
      <Header title={title} />
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" exact>
          <MainContent>
            {/* <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Welcome to Kubergames!</Typography>
            </Box> */}
          </MainContent>
        </Route>
        <Route path="/space-invaders" exact>
          <MainContent>
            {/* <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Space Invaders</Typography>
            </Box> */}
            <SpaceInvadersPage />
          </MainContent>
        </Route>
        <Route path="/snake-game" exact>
          <MainContent>
            {/* <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Snake game</Typography>
            </Box> */}
            <SnakeGamePage />
          </MainContent>
        </Route>
        <Route path="/minesweeper" exact>
          <MainContent>
            {/* <Box sx={{ height: "100%", width: "100%" }}>
              <Typography variant="h3">Minesweeper</Typography>
            </Box> */}
            <MinesweeperPage />
          </MainContent>
        </Route>
        <Route path="/flappy-bird" exact>
          <MainContent>
            <FlappyBirdPage />
          </MainContent>
        </Route>
        <Route path="/maze-generator" exact>
          <MainContent>
            <MazePage />
          </MainContent>
        </Route>
        <Route path="/langtons-ant" exact>
          <MainContent>
            <LangtonsPage />
          </MainContent>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
