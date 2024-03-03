// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Confirmation from "./pages/Confirmation";
import VerificationPending from "./pages/VerificationPending";
import Dashboard from "./admin/Dashboard";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch authentication status when the component mounts
    fetch('/isAuthenticated')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch(error => {
        console.error('Error fetching authentication status:', error);
      });
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/Dashboard" element={<Dashboard />} /> Adjusted path */}

          <Route path="/Dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

          {/* {isAuthenticated ? (
            <Route path="/Dashboard" element={<Dashboard />} />
          ) : (
            <Navigate to="/login" />
          )} */}

          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/VerificationPending" element={<VerificationPending />} />
          {/* <Route path="/verify/:token"></Route> */}
          {/* <Route index element={<Features/>} />
          <Route index element={<Solutions/>} />
          <Route index element={<Contact/>} />
          <Route index element={<Signup/>} />  */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
