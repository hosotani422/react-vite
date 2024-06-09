import '@/styles/tailwind.css';
import "@/locales/i18next";
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactRouter from 'react-router-dom';
import PageApp from '@/components/app';
import app from "@/stores/page/app";

ReactDOM.createRoot(app.refer.getById(`root`)).render(
  <React.StrictMode>
    <ReactRouter.BrowserRouter>
      <PageApp />
    </ReactRouter.BrowserRouter>
  </React.StrictMode>,
);
