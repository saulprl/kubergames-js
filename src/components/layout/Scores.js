import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const Scores = (props) => {
  const [scores, setScores] = useState([]);

  const fetchScores = useCallback(async () => {
    const res = await fetch(
      `http://api.kubergames.io/kubergames/${props.game}`
    );

    const data = await res.json();
    setScores(data.results);
  }, [props.game]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  let content = <Typography variant="body1">No scores found</Typography>;

  if (scores.length > 0) {
    content = scores.map((record, index) => (
      <ListItem
        key={index}
        secondaryAction={
          <Typography variant="body1">
            {record[`${props.scoreField}`]}
          </Typography>
        }
      >
        <ListItemIcon>
          <Chip variant="outlined" color="primary" label={index + 1} />
        </ListItemIcon>
        <ListItemText primary={record[`${props.nameField}`]} />
      </ListItem>
    ));
  }

  return <List>{content}</List>;
};

export default Scores;
