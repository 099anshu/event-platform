import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import RegisterEvent from './pages/RegisterEvent'; 
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddEvent from './pages/AddEvent'; // You'll create this next
import AddWinner from './pages/AddWinner'; // Optional
import EditWinner from './pages/EditWinner';
import WinnerGallery from './pages/WinnerGallery';
import ViewRegistrations from './pages/ViewRegistrations'; // Optional
import EditEvent from './pages/EditEvent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
// or correct path if it's in another folder



function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route 
          path="/register/:eventId" 
          element={
            <ProtectedRoute>
              <RegisterEvent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/add-event" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddEvent />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/edit-event/:eventId" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditEvent />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/winners" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <WinnerGallery />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/add-winner" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddWinner />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/edit-winner/:winnerId" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditWinner />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/registrations" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ViewRegistrations />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer/>
    </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
