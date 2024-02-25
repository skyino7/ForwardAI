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
