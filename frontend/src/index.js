import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MainTable from "./Table";
import HumanCreator from "./HumanCreator";
import CoordCreator from "./CoordCreator";
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div style={{display: 'flex'}}>
      <HumanCreator/>
      <CoordCreator/>
      </div>
      <MainTable/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
