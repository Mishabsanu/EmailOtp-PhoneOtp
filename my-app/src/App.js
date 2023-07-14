import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Dashboard from "./page/Dashboard";
import MailVerify from "./components/MailVerify/MailVerify";
import MailOtp from "./components/MailOtp/MailOtp";
import PhoneVerify from "./components/PhoneVerify/PhoneVerify";
import PhoneOtp from "./components/PhoneOtp/PhoneOtp";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
function App() {
  const token = useSelector(state=>state.token)
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };
  return (
    <div className="App">
      <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!token ? <Signup/>: <Navigate to="/" />} />
            <Route  path="/" element={token ? <Dashboard />: <Navigate to="/login" />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} /> */}
        <Route path="/mailOtp" element={<MailOtp />} />
        <Route path="/sendMailOtp" element={<MailVerify />} />
        <Route path="/sendPhoneOtp" element={<PhoneVerify />} />
        <Route path="/phoneOtp" element={<PhoneOtp />} />
      </Routes>
    </div>
  );
}

export default App;
