import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Confirmation from "./pages/Confirmation";
import VerificationPending from "./pages/VerificationPending";
import Dashboard from "./admin/Dashboard";
import ClientForm from "./admin/Components/ClientForm";
import TableList from "./admin/Components/Tables";
import TableDetails from "./admin/Components/TableDetails";
import QueryBuilder from "./admin/Components/QueryBuilder";
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import NotFound from "./pages/NotFound";
import UploadCsv from "./admin/Components/UploadCsv";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch authentication status when the component mounts
    fetch('/isAuthenticated')
      .then(response => {
        if (response.ok) {
          console.log(response.json);
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/VerificationPending" element={<VerificationPending />} />

          {/* <Route path="/Dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/ClientForm" element={isAuthenticated ? <ClientForm /> : <Navigate to="/login" />} />
          <Route exact path="/TableList" element={isAuthenticated ? <TableList /> : <Navigate to="/login" />} />
          <Route path="/tables/:tableName" element={isAuthenticated ? <TableDetails /> : <Navigate to="/login" />} /> */}

          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ClientForm" element={<ClientForm />} />
          <Route exact path="/TableList" element={<TableList />} />
          <Route path="/tables/:tableName" element={<TableDetails />} />


              {/* <QueryBuilder /> */}

          <Route path="/QueryBuilder" element={<QueryBuilder />} />
          <Route path="/UploadCsv" element={<UploadCsv />} />
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
