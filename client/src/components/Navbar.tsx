import { AppBar, Toolbar, Typography, IconButton, type PaletteMode } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface NavbarProps  {
    mode : PaletteMode,
    toggleMode:() => void
}

export default function Navbar({ mode, toggleMode } : NavbarProps) {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div className="logo">
          <FormatListBulletedIcon />
          <Typography variant="h6" fontWeight={700}>Taskify</Typography>
        </div>
        <IconButton color="inherit" onClick={toggleMode}>
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
