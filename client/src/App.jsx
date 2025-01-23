
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import AdminDashBoard from "./Pages/AdminDashBoard";


const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/adminDashBoard" element={<AdminDashBoard />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
