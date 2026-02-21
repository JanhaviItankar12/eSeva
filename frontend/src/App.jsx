import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Auth/SignupForm";
import HomePage from "./Home/HomePage"
import GramSevakDashboard from "./Dashboard/GramSevak/GramSevakDashboard";
import LoginForm from "./Auth/LoginForm";
import CitizenDashboard from "./Dashboard/Citizen/CitizenDashboard";
import NewApplication from "./Dashboard/Citizen/NewApplication";
import ProfileSetting from "./Dashboard/Citizen/ProfileSetting";
import MyApplication from "./Dashboard/Citizen/MyApplication";

import ProtectedRoute from "./protect/ProtectedRoute";
import TrackApplication from "./Dashboard/Citizen/TrackApplication";



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
        <Route path="/citizen/dashboard/:id" element={
           <ProtectedRoute>
          <CitizenDashboard/>
           </ProtectedRoute>
          } />
        <Route path="/citizen/new-application/:id" element={
          <ProtectedRoute>
          <NewApplication/>
          </ProtectedRoute>} />
          
        <Route path="/citizen/profile/:id" element={
          <ProtectedRoute>
          <ProfileSetting/>
          </ProtectedRoute>} />
        <Route path="/citizen/my-applications/:id" element={
          <ProtectedRoute>
          <MyApplication/>
          </ProtectedRoute>
          } />
        <Route path="/citizen/track-applications/:id" element={
         <ProtectedRoute>
          <TrackApplication/>
        </ProtectedRoute>}
           />


        <Route path="/gramsevak/dashboard" element={<GramSevakDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;

