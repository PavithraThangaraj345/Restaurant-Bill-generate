import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Billinf.css';
import { useNavigate, useParams } from 'react-router-dom';

const Billing = () => {
    const navigate = useNavigate();
    const { bookingId: urlBookingId, bookingType: urlBookingType } = useParams();
    const [bills, setBills] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        totalAmount: '',
        items: '',
        bookingType: '',
        bookingId: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    // Helper function to format the booking type string
    const formatBookingType = (type) => {
        if (!type) return 'N/A';
        const formattedType = type
            .replace(/booking|reservation/g, '')
            .trim()
            .split(/(?=[A-Z])/)
            .join(' ');
        
        return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
    };

    // Fetch all bookings from all endpoints to populate the select dropdown
    const fetchAllBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const endpoints = [
                // Ensure these URLs match your server.js routes exactly.
                { type: 'Reservation', url: 'http://localhost:5000/api/reservations' },
                { type: 'PartyBooking', url: 'http://localhost:5000/api/partybookings' },
                { type: 'PrivateHallBooking', url: 'http://localhost:5000/api/privatehallbookings' },
                { type: 'EventBooking', url: 'http://localhost:5000/api/eventbookings' },
            ];



            const responses = await Promise.all(endpoints.map(ep => axios.get(ep.url, config)));

            let allBookings = [];
            responses.forEach((res, index) => {
                const bookingType = endpoints[index].type;
                // Add the booking type to each booking object
                allBookings = allBookings.concat(res.data.map(b => ({ ...b, bookingType: bookingType })));
            });
            setBookings(allBookings);

            if (urlBookingId && urlBookingType) {
                const preselectedBooking = allBookings.find(b => b._id === urlBookingId && b.bookingType === urlBookingType);
                if (preselectedBooking) {
                    setFormData({
                        customerName: preselectedBooking.name,
                        customerEmail: preselectedBooking.email,
                        totalAmount: preselectedBooking.amount,
                        items: '',
                        bookingType: preselectedBooking.bookingType,
                        bookingId: preselectedBooking._id,
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching all bookings:', err);
        }
    };
    
    // Fetch all bills to display in the table
    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/bills', config);
            setBills(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bills:', err);
            setError('Failed to fetch bills. Please try again.');
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchBills();
        fetchAllBookings();
    }, [urlBookingId, urlBookingType]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingSelect = (e) => {
        const selectedBookingId = e.target.value;
        const selectedBooking = bookings.find(b => b._id === selectedBookingId);
        
        if (selectedBooking) {
            setFormData(prev => ({
                ...prev,
                customerName: selectedBooking.name,
                customerEmail: selectedBooking.email,
                totalAmount: selectedBooking.amount,
                bookingType: selectedBooking.bookingType,
                bookingId: selectedBooking._id,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                customerName: '',
                customerEmail: '',
                totalAmount: '',
                bookingType: '',
                bookingId: '',
            }));
        }
    };
    
    const handleGenerateBill = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }
    
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const itemsArray = formData.items.split(',').map(item => item.trim());
    
            await axios.post('http://localhost:5000/api/bills', {
                ...formData,
                items: itemsArray,
                totalAmount: parseFloat(formData.totalAmount),
                createdAt: new Date(),
                bookingType: formData.bookingType || 'general',
                bookingId: formData.bookingId || null,
            }, config);
    
            setFormData({ customerName: '', customerEmail: '', totalAmount: '', items: '', bookingType: '', bookingId: '' });
            alert('Bill generated successfully!');
            fetchBills();
        } catch (err) {
            console.error('Error generating bill:', err);
            alert('Failed to generate bill. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrintBill = (bill) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Bill #${bill._id.slice(-6)}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; color: #333; }
                    .bill-header { text-align: center; margin-bottom: 20px; }
                    .bill-details p { margin: 5px 0; }
                    .bill-items table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .bill-items th, .bill-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .bill-items th { background-color: #f2f2f2; }
                    .bill-total { text-align: right; margin-top: 20px; font-size: 1.2em; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="bill-header">
                    <h1>Your Restaurant Bill</h1>
                    <p>Bill ID: #${bill._id.slice(-6)}</p>
                </div>
                <div class="bill-details">
                    <p><strong>Customer Name:</strong> ${bill.customerName}</p>
                    <p><strong>Customer Email:</strong> ${bill.customerEmail}</p>
                    <p><strong>Booking Type:</strong> ${formatBookingType(bill.bookingType)}</p>
                    <p><strong>Booking ID:</strong> ${bill.bookingId || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="bill-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bill.items.map(item => `<tr><td>${item}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="bill-total">
                    <p>Total Amount: ₹${bill.totalAmount.toFixed(2)}</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return <div className="text-center text-gray-400 p-8">Loading bills...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <h1 className="text-4xl font-extrabold text-center text-red-600 mb-10">💰 Billing Management</h1>
            {/* Bill Generation Form */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Generate New Bill</h2>
                <form onSubmit={handleGenerateBill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        name="bookingId"
                        value={formData.bookingId}
                        onChange={handleBookingSelect}
                        className="p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Select a Booking (Optional)</option>
                        {bookings.map(booking => (
                            <option key={booking._id} value={booking._id}>
                                {formatBookingType(booking.bookingType)} - {booking.name} ({new Date(booking.date).toLocaleDateString()})
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Customer Name"
                        required
                        className="p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="Customer Email"
                        required
                        className="p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <textarea
                        name="items"
                        value={formData.items}
                        onChange={handleChange}
                        placeholder="Bill Items (e.g., Pizza, Pasta, Coke)"
                        required
                        className="col-span-1 md:col-span-2 p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 h-24"
                    ></textarea>
                    <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        placeholder="Total Amount (₹)"
                        required
                        className="col-span-1 md:col-span-2 p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                        type="submit"
                        className="col-span-1 md:col-span-2 p-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition duration-200"
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Bill'}
                    </button>
                </form>
            </div>
            {/* Bills List */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Generated Bills</h2>
                {bills.length === 0 ? (
                    <p className="text-gray-400">No bills found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bill ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {bills.map((bill) => (
                                    <tr key={bill._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{bill._id.slice(-6)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{bill.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {formatBookingType(bill.bookingType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{bill.bookingId ? bill.bookingId.slice(-6) : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">₹{bill.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{new Date(bill.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            <button
                                                onClick={() => handlePrintBill(bill)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-200"
                                            >
                                                Print
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Billing;