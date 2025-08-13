// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage';
import ChatIcon from './components/ChatIcon';

// User Context
import { UserProvider, useUser } from './context/UserContext.jsx'; 

// Page Imports
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import Menu from './Pages/Menu';
import Menu2 from './Pages/Menu2';
import Menu3 from './Pages/Menu3';
import Menu4 from './Pages/Menu4';
import About from './Pages/About';
import SignIn from './Pages/Signin';
import SignUp from './Pages/Signup';
import TableReserve from './Pages/TableReserve';
import PartyBooking from './Pages/PartyBooking';
import PrivateHall from './Pages/PrivateHall';
import EventHall from './Pages/EventHall';
import Profile from './Pages/Profile';

// Admin Layout and Pages
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserManagement from './Pages/Admin/UserManagement';
import MenuManagement from './Pages/Admin/MenuManagement';
import BookingManagement from './Pages/Admin/BookingManagement';
import EmployeeManagement from './Pages/Admin/EmployeeManagement';
import EventManagement from './Pages/Admin/EventManagement';
import Billing from './Pages/Admin/Billing';

// Role-based Route Protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/profile" />;
  }

  return children;
};

function App() {
    return (
        <UserProvider>
            <Router>
                <AppContent />
            </Router>
        </UserProvider>
    );
}

function AppContent() {
    const { user } = useUser();
    const isAdmin = user && user.role === 'admin';

    return (
        <>
            {!isAdmin && <Navbar />}

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu2" element={<Menu2 />} />
                <Route path="/menu3" element={<Menu3 />} />
                <Route path="/menu4" element={<Menu4 />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/party-booking" element={<PartyBooking />} />
                <Route path="/private-hall" element={<PrivateHall />} />
                <Route path="/event-hall" element={<EventHall />} />
                <Route path="/chat" element={!isAdmin ? <ChatPage /> : <Navigate to="/admin/dashboard" />} />


                {/* User Protected Routes */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute allowedRoles={['user']}>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/table-reserve"
                    element={
                        <PrivateRoute allowedRoles={['user']}>
                            <TableReserve />
                        </PrivateRoute>
                    }
                />

                {/* Nested Admin Dashboard & Pages */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard" element={<div></div>} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="menus" element={<MenuManagement />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="bookings" element={<BookingManagement />} />
                    <Route path="events" element={<EventManagement />} />
                    <Route path="bills" element={<Billing />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {!isAdmin && <Footer />}
            {!isAdmin && <ChatIcon />}
        </>
    );
}

export default App;