import {
  Box,
  Button,
  Card,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";

import useScores from "../../hooks/useScores";

const Scores = (props) => {
  const { fetchScores, isLoading, scores, error } = useScores(props.game);

  let content;

  if (isLoading) {
    content = [...Array(10).keys()].map((i) => (
      <Skeleton
        key={i}
        component="li"
        animation="pulse"
        variant="rounded"
        height={36}
        sx={{
          mb: "0.5rem",
          animationDelay: `${i * 0.05}s`,
          animationDuration: "1s",
        }}
      />
    ));
  }

  if (!isLoading && error) {
    content = <Typography variant="body1">{error}</Typography>;
  }

  if (!isLoading && !error && scores.length === 0) {
    content = <Typography variant="body1">Sin registros</Typography>;
  }

  if (!isLoading && !error && scores.length > 0) {
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
        disabled={isLoading}
        sx={{ width: "95%", borderRadius: "16px" }}
      >
        Actualizar
      </Button>
      <List sx={{ width: "95%" }}>{content}</List>
    </Box>
  );
};

export default Scores;
