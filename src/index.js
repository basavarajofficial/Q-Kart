import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import theme from "./theme";
// Notistack is a react library for rendering notifications in React applications, 
// and a "snackbar provider" could be a component or context provider that manages the state and rendering of these notifications.

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
        </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
   document.getElementById('root')
);
