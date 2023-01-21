import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const Scores = (props) => {
  const [scores, setScores] = useState([]);
  const host = process.env.API_URL;

  let content = <Typography variant="body1">Sin registros</Typography>;

  const fetchScores = useCallback(async () => {
    const res = await fetch(`${host}/kubergames/${props.game}`);

    const data = await res.json();
    setScores(data.scores);
  }, [props.game, host]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  if (scores.length > 0) {
    content = scores.map((record, index) => (
      <Card
        key={index}
        variant="outlined"
        sx={{
          background: "#0a1929",
          borderRadius: "16px",
          mb: "0.5rem",
          width: "100%",
        }}
      >
        <ListItem
          // key={index}
          sx={{ width: "100%" }}
          secondaryAction={
            <Typography variant="body1">{record.score}</Typography>
          }
        >
          <ListItemIcon>
            <Chip variant="contained" color="primary" label={index + 1} />
          </ListItemIcon>
          <ListItemText primary={record.name} />
        </ListItem>
      </Card>
    ));
  }

  return (
    <Box
      sx={{
        width: "100%",
        mt: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={fetchScores}
        sx={{ width: "95%", borderRadius: "16px" }}
      >
        Actualizar
      </Button>
      <List sx={{ width: "95%" }}>{content}</List>
    </Box>
  );
};

export default Scores;
