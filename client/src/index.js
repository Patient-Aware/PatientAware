import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import  Home, { onAntigenFormSubmit } from './components/Home';
import OngoingTest, { loader as ongoingTestLoader } from './components/OngoingTest';
import TestResults, { testResultsLoader } from './components/TestResults';
import PastResults, { pastResultsLoader } from './components/PastResults';

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
        loader: ongoingTestLoader,
        element: <OngoingTest />
      },
      {
        path: "results",
        loader: testResultsLoader,
        element: <TestResults />
      },
      {
        path: 'past-results',
        loader: pastResultsLoader,
        element: <PastResults />
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
