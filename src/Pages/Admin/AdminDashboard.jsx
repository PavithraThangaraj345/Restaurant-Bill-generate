import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './AdminDashboard.css';
import { FaChair, FaBirthdayCake, FaBuilding, FaLandmark, FaUsers, FaCalendarAlt } from 'react-icons/fa';


ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    table: 0,
    party: 0,
    event: 0,
    private: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [userRes, tableRes, partyRes, privateRes, eventRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', config),
          axios.get('http://localhost:5000/api/reservations', config),
          axios.get('http://localhost:5000/api/partybookings', config),
          axios.get('http://localhost:5000/api/privatehallbookings', config),
          axios.get('http://localhost:5000/api/eventbookings', config),
        ]);

        const allBookings = [
          ...tableRes.data,
          ...partyRes.data,
          ...privateRes.data,
          ...eventRes.data,
        ];

        setStats({
          users: userRes.data.length,
          bookings: allBookings.length,
          table: tableRes.data.length,
          party: partyRes.data.length,
          event: eventRes.data.length,
          private: privateRes.data.length,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/signin');
  };

  const bookingPieChart = {
    labels: ['Table', 'Party', 'Event Hall', 'Private Hall'],
    datasets: [
      {
        label: 'Bookings Count',
        data: [stats.table, stats.party, stats.event, stats.private],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0'],
        borderColor: '#121212',
        borderWidth: 1,
      },
    ],
  };

  const revenuePieChart = {
    labels: ['Table', 'Party', 'Event Hall', 'Private Hall'],
    datasets: [
      {
        label: 'Estimated Revenue',
        data: [
          stats.table * 200,
          stats.party * 500,
          stats.event * 800,
          stats.private * 1000,
        ],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0'],
        borderColor: '#121212',
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/users">Users</NavLink>
          {/* <NavLink to="/admin/menus">Menus</NavLink> */}
          <NavLink to="/admin/employees">Employees</NavLink>
          <NavLink to="/admin/bookings">Bookings</NavLink>
          {/* <NavLink to="/admin/events">Events</NavLink> */}
          <NavLink to="/admin/bills">Billing</NavLink>
        </nav>
        <button onClick={handleLogout} className="admin-logout">Logout</button>
      </aside>

      <main className="admin-main">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stats-grid top-row">
  <div className="stat-card"><FaChair className="stat-icon" /> Tables: {stats.table}</div>
  <div className="stat-card"><FaBirthdayCake className="stat-icon" /> Parties: {stats.party}</div>
  <div className="stat-card"><FaBuilding className="stat-icon" /> Events: {stats.event}</div>
  <div className="stat-card"><FaLandmark className="stat-icon" /> Private Halls: {stats.private}</div>
  </div>
  <div className="stats-grid bottom-row">
  <div className="stat-card"><FaUsers className="stat-icon" /> Users: {stats.users}</div>
  <div className="stat-card"><FaCalendarAlt className="stat-icon" /> Bookings: {stats.bookings}</div>
  </div>
</div>



        <div className="admin-charts">
          <div className="chart-box">
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Booking Distribution</h4>
            <Pie data={bookingPieChart} />
          </div>

          <div className="chart-box">
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Revenue Distribution</h4>
            <Pie data={revenuePieChart} />
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
