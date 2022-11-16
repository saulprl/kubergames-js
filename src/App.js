import logo from "./logo.svg";
import "./App.css";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";

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
      <Box sx={{ height: "100%", width: "100%" }}>
        <Typography variant="h3">Welcome to Kubergames!</Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
