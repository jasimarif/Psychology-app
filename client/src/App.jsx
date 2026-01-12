import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Login, Signup, ForgotPassword, LandingPage, Dashboard, Questionnaire, Profile, Psychologists, PsychologistProfile, MyBookings, RecommendedPsychologists, NotFound, AboutUs} from "./pages";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import BookingSuccess from "./pages/Bookings/BookingSuccess";
import BookingCancelled from "./pages/Bookings/BookingCancelled";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : children;
}

function App() {

  return (
   <AuthProvider>
     <Toaster position="top-right" />
     <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Layout><Questionnaire /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/browse-psychologists" element={<ProtectedRoute><Layout><Psychologists /></Layout></ProtectedRoute>} />
        <Route path="/recommended-psychologists" element={<ProtectedRoute><Layout><RecommendedPsychologists /></Layout></ProtectedRoute>} />
        <Route path="/psychologist/:id" element={<ProtectedRoute><Layout><PsychologistProfile /></Layout></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} />
        <Route path="/booking-success" element={<ProtectedRoute><Layout><BookingSuccess /></Layout></ProtectedRoute>} />
        <Route path="/booking-cancelled" element={<ProtectedRoute><Layout><BookingCancelled /></Layout></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
     </Router>
   </AuthProvider>
  )
}

export default App
