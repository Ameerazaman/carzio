import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './components/user/LandingPage';
import Login from './components/user/Login';
import Signup from './components/user/Signups';
import Otp from './components/user/Otp';
import Home from './components/user/Home';
import ProviderLogin from './components/provider/ProviderLogin';
import ProviderSignup from './components/provider/ProviderSignup';
import ProviderHome from './components/provider/ProviderHome';
import ProviderOtp from './components/provider/ProviderOtp';



function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/home" element={<Home />} />



          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/signup" element={<ProviderSignup />} />
          <Route path="/provider/Home" element={<ProviderHome />} />
          <Route path="/provider/otp" element={<ProviderOtp/>} />
          

        </Routes>
      </Router>

    </div>
  );
}

export default App;