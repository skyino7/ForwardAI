// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./admin/Dashboard";
import Confirmation from "./pages/Confirmation";
import VerificationPending from "./pages/VerificationPending ";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/Confirmation" Component={Confirmation} />
          <Route path="/VerificationPending" Component={VerificationPending} />
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
