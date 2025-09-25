import { useState } from "react";
import Navbar from "./components/Navbar";
import {
  Box,
  createTheme,
  CssBaseline,
  type PaletteMode,
  ThemeProvider,
} from "@mui/material";
import Todoform from "./components/Todoform";
import TodoItems from "./components/TodoItems";
import { Toaster } from "react-hot-toast";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

function App() {
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("theme") as PaletteMode) || "dark"
  );

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const toggleMode = () => {
    setMode((prev) => {
      const nextMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextMode);
      return nextMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <CssBaseline />
      <Navbar mode={mode} toggleMode={toggleMode} />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        marginTop={6}
      >
        <Todoform />
      </Box>
      <TodoItems />
    </ThemeProvider>
  );
}

export default App;
