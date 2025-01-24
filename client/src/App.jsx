
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import AdminDashBoard from "./Pages/AdminDashBoard";
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import AdminUpdate from "./Pages/AdminUpdate";
import ResetPassword from "./Pages/ResetPassword";




const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/adminDashBoard" element={<AdminDashBoard />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminUpdate" element={<AdminUpdate />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
