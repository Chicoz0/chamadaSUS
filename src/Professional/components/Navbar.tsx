import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import logo from "../../assets/e-sus3.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img
          alt="logo e-sus"
          src={logo}
          style={{ display: "flex", height: "70px", width: "150px" }}
        />
        <Box
          sx={{
            display: "flex",
            direction: "row",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ color: "black", fontSize: ".9rem" }}>
              Francisco de Paula Lemos
            </Typography>
            <Typography
              sx={{ color: "black", fontSize: ".9rem", fontWeight: "bold" }}
            >
              Local "demo" na APS
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: "black" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
