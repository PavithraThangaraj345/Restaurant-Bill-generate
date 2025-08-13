// src/components/AdminBookingManagement.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingManagement.css";

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState({
        reservations: [],
        partyBookings: [],
        privateHallBookings: [],
        eventHallBookings: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const fetchAllBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const [
                reservationsRes,
                partyBookingsRes,
                privateHallBookingsRes,
                eventHallBookingsRes,
            ] = await Promise.all([
                axios.get("http://localhost:5000/api/reservations", config),
                axios.get("http://localhost:5000/api/partybookings", config),
                axios.get("http://localhost:5000/api/privatehallbookings", config),
                axios.get("http://localhost:5000/api/eventbookings", config),
            ]);

            setBookings({
                reservations: reservationsRes.data || [],
                partyBookings: partyBookingsRes.data || [],
                privateHallBookings: privateHallBookingsRes.data || [],
                eventHallBookings: eventHallBookingsRes.data || [],
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Failed to fetch bookings. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const handleBookingAction = async (bookingId, bookingType, action) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            if (action === 'confirm') {
                await axios.put(`http://localhost:5000/api/${bookingType}/confirm/${bookingId}`, {}, config);
            } else if (action === 'deny') {
                await axios.delete(`http://localhost:5000/api/${bookingType}/deny/${bookingId}`, config);
            }

            setMessage(`${bookingType.replace('bookings', ' booking')} ${action === 'confirm' ? 'confirmed' : 'denied'} successfully!`);
            fetchAllBookings(); // Refresh the list
        } catch (error) {
            console.error(`Error ${action}ing booking:`, error);
            setMessage(`Failed to ${action} booking. Please try again.`);
        }
    };

    const renderBookingList = (title, data, fields, bookingType) => (
        <div className="booking-card">
            <h2 className="section-title">{title}</h2>
            {data.length === 0 ? (
                <p className="empty-msg">No {title} found.</p>
            ) : (
                <div className="table-container">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                {fields.map((field) => (
                                    <th key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</th>
                                ))}
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((booking) => (
                                <tr key={booking._id}>
                                    {fields.map((field) => (
                                        <td key={field}>{booking[field]}</td>
                                    ))}
                                    <td>
                                        <span className={`status-badge ${booking.paymentStatus?.toLowerCase().replace(/\s/g, '-')}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleBookingAction(booking._id, bookingType, 'confirm')}
                                                className="btn confirm"
                                                disabled={!(booking.paymentStatus && (booking.paymentStatus === 'Advance Paid' || booking.paymentStatus.includes('Pending')))}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleBookingAction(booking._id, bookingType, 'deny')}
                                                className="btn deny"
                                                disabled={!(booking.paymentStatus && (booking.paymentStatus === 'Advance Paid' || booking.paymentStatus.includes('Pending')))}
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    if (loading) {
        return <div className="loading-msg">Loading bookings...</div>;
    }

    if (error) {
        return <div className="error-msg">{error}</div>;
    }

    return (
        <div className="admin-booking-management">
            <h1 className="page-title">📋 Booking Management</h1>

            {message && (
                <div className="success-msg">{message}</div>
            )}

            {renderBookingList("Table Reservations", bookings.reservations, ["name", "email", "date", "time", "people", "amount", "paymentStatus"], "reservations")}

            {renderBookingList("Party Hall Bookings", bookings.partyBookings, ["name", "email", "date", "timeSlot", "guests", "amount", "paymentStatus"], "partybookings")}

            {renderBookingList("Private Hall Bookings", bookings.privateHallBookings, ["name", "email",  "date", "time", "guests", "amount", "paymentStatus"], "privatehallbookings")}

            {renderBookingList("Event Hall Bookings", bookings.eventHallBookings, ["name", "email", "phone", "date", "time", "guests", "occasion", "amount", "paymentStatus"], "eventbookings")}
        </div>
    );
};

export default AdminBookingManagement;
