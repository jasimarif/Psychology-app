import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Login, Signup, LandingPage, Dashboard, Questionnaire, Profile, Psychologists, PsychologistProfile, MyBookings} from "./pages";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components";
import { useAuth } from "./context/AuthContext";

// Component to redirect logged-in users from public pages
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : children;
}

function App() {

  return (
   <AuthProvider>
     <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Layout><Questionnaire /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/browse-psychologists" element={<ProtectedRoute><Layout><Psychologists /></Layout></ProtectedRoute>} />
        <Route path="/psychologist/:id" element={<ProtectedRoute><Layout><PsychologistProfile /></Layout></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      </Routes>
     </Router>
   </AuthProvider>
  )
}

export default App
