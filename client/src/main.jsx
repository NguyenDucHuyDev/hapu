import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from 'react-redux'
import {store}  from './redux/store/store'
import App from './App'
import "./assets/styles/globals.css"
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
      <App />
    </Provider>
  </BrowserRouter>,
)
