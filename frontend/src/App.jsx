import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Auth/SignupForm";
import HomePage from "./Home/HomePage"
import GramSevakDashboard from "./Dashboard/GramSevak/GramSevakDashboard";
import LoginForm from "./Auth/LoginForm";
import CitizenDashboard from "./Dashboard/Citizen/CitizenDashboard";
import NewApplication from "./Dashboard/Citizen/NewApplication";
import ProfileSetting from "./Dashboard/Citizen/ProfileSetting";
import MyApplication from "./Dashboard/Citizen/MyApplication";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/login" element={<LoginForm/>} />

        {/* Protected routes */}

        {/* citizen routes */}
        <Route path="/citizen/dashboard/:id" element={<CitizenDashboard/>} />
        <Route path="/citizen/new-application/:id" element={<NewApplication/>} />
        <Route path="/citizen/profile/:id" element={<ProfileSetting/>} />
        <Route path="/citizen/my-applications/:id" element={<MyApplication/>} />
        


        <Route path="/gramsevak/dashboard" element={<GramSevakDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;

