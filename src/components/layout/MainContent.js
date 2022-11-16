import { Box } from "@mui/material";

const MainContent = (props) => {
  return (
    <Box
      sx={{
        width: `calc(100% - 240)`,
        ml: `240px`,
      }}
    >
      {props.children}
    </Box>
  );
};

export default MainContent;
