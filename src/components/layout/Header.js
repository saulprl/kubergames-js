import PermanentDrawer from "./PermanentDrawer";

const Header = (props) => {
  return (
    <>
      <PermanentDrawer />
      {/* <header>
        <AppBar
          position="fixed"
          sx={{
            width: "calc(100% - 240px)",
            ml: "240px",
            background: theme.palette.primary.main,
          }}
        >
          <Toolbar variant="dense">
            <Typography variant="h6">{props.title}</Typography>
          </Toolbar>
        </AppBar>
      </header> */}
    </>
  );
};

export default Header;
