import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import  Home, { onAntigenFormSubmit } from './components/Home';
import OngoingTest from './components/OngoingTest';
import TestResults from './components/TestResults';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { 
        index: true, 
        element: <Home/>,
        action: onAntigenFormSubmit 
      },
      {
        path: "in-progress",
        element: <OngoingTest />
      },
      {
        path: "results",
        element: <TestResults />
      }
    ]
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
