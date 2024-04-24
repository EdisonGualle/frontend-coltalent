import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// import { axios } from "axios";

// window.axios = axios

// window.axios.defaults.baseURL = 'http://127.0.0.1:8000/'
// window.axios.defaults.headers.cammon['Accept']= 'application/json'
// window.axios.defaults.headers.cammon['Content-Type']= 'application/json'
// window.axios.defaults.headers.cammon['X-Requested-With']= 'XMLHttpRequest'
// window.axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
