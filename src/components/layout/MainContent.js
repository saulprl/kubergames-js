import { Box } from "@mui/material";

const MainContent = (props) => {
  return (
    <Box
      sx={{
        width: "calc(100% - 240)",
        ml: "240px",
        mt: "48px",
        pt: "1rem",
        pl: "1rem",
        pr: "1rem",
      }}
    >
      {props.children}
    </Box>
  );
};

export default MainContent;
