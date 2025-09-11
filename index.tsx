import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';

const appRootElement = document.getElementById('root');
if (!appRootElement) {
  throw new Error("Could not find app root element to mount to");
}
const appRoot = ReactDOM.createRoot(appRootElement);
appRoot.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);
