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

import './App.css';
import Banner from './Component/Banner';
import Navbar from './Component/Navbar';
import Offer from './Component/Offer';
import Choose from './Component/Choose';
import Clients from './Component/Clients';

function App() {
  return (
    <>
      <Navbar />
      <Banner />
      <Offer />
      <Choose />
      <Clients />
      {/* <h1>Forward AI+</h1> */}
    </>
  );
}

export default App;
