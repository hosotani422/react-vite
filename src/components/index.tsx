import '@/assets/style/tailwind.css';
import "@/locales/i18next";
import "@/utils/base/events";
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactRouter from 'react-router-dom';
import Util from "@/utils/base/util";
import PageApp from '@/components/app';

ReactDOM.createRoot(Util.getById(`root`)).render(
  <React.StrictMode>
    <ReactRouter.BrowserRouter>
      <PageApp />
    </ReactRouter.BrowserRouter>
  </React.StrictMode>,
);
