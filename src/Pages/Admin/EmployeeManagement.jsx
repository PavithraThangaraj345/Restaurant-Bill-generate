import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeManagement.css'; // Assuming this provides your styling

// Assuming you have an Axios instance configured with your base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Update with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// A simple Message component for feedback
const Message = ({ type, message }) => {
    if (!message) return null;
    return (
        <div className={`message-container ${type}`}>
            {message}
        </div>
    );
};

const EmployeeManagement = () => {
    // These roles must match the enum in your backend model
    const roles = [
        'waiter', 'chef', 'masterchef', 'cashier', 'receptionist', 'cook',
        'dishwasher', 'cleaning staff', 'booking manager',
        'event coordinator', 'supervisor'
    ];

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        id: '',
        name: '',
        age: '',
        salary: '',
        bonus: '',
        email: '',
        role: roles[0],
        password: '',
        image: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');


    // Fetch employees on initial load
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You are not authenticated. Please log in as an admin.');
                setLoading(false);
                return;
            }
            const res = await api.get('/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        // Basic form validation for required fields
        if (!form.name || !form.email || !form.role || (!isEditing && !form.password)) {
            setMessage('Please fill in all required fields.');
            setMessageType('error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            if (isEditing) {
                // Ensure no undefined values are sent for non-updated fields
                const updatePayload = {
                    name: form.name,
                    age: form.age,
                    salary: form.salary,
                    bonus: form.bonus,
                    email: form.email,
                    role: form.role,
                    image: form.image
                };
                await api.put(`/employees/${form.id}`, updatePayload, config);
                setMessage('Employee updated successfully!');
                setMessageType('success');
            } else {
                await api.post('/employees', form, config);
                setMessage('Employee added successfully!');
                setMessageType('success');
            }
            setForm({ id: '', name: '', age: '', salary: '', bonus: '', email: '', role: roles[0], password: '', image: '' });
            setIsEditing(false);
            fetchEmployees();
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    const handleEdit = (employee) => {
        // Use employee._id for the form
        setForm({
            ...employee,
            id: employee._id,
            email: employee.user?.email || '',
            name: employee.name || '',
            age: employee.age || '',
            salary: employee.salary || '',
            bonus: employee.bonus || '',
            role: employee.role || roles[0],
            image: employee.image || '',
            password: ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (employeeId) => {
        setMessage('');
        setMessageType('');
        if (window.confirm('Are you sure you want to delete this employee? This will also downgrade their user account to customer role.')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                await api.delete(`/employees/${employeeId}`, config);
                setMessage('Employee deleted successfully!');
                setMessageType('success');
                fetchEmployees();
            } catch (err) {
                setMessage(`Error: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading employees...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="employee-container">
            <h2 className="form-title">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-grid">
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="password">Password {isEditing ? '(leave blank to keep current)' : '*'}</label>
                        <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required={!isEditing} />
                    </div>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <select id="role" name="role" value={form.role} onChange={handleChange}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="age">Age:</label>
                        <input type="number" id="age" name="age" value={form.age} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="salary">Salary:</label>
                        <input type="number" id="salary" name="salary" value={form.salary} onChange={handleChange} step="0.01" />
                    </div>
                    <div>
                        <label htmlFor="bonus">Bonus:</label>
                        <input type="number" id="bonus" name="bonus" value={form.bonus} onChange={handleChange} step="0.01" />
                    </div>
                    <div className="full-width">
                        <label htmlFor="image">Image:</label>
                        <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                        {form.image && <img src={form.image} alt="Preview" className="preview-image" />}
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn green">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
                    {isEditing && (
                        <button type="button" onClick={() => { setIsEditing(false); setForm({ id: '', name: '', age: '', salary: '', bonus: '', email: '', role: roles[0], password: '', image: '' }); }} className="btn gray">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <Message type={messageType} message={message} />

            <h3 className="list-title">Current Employees</h3>
            {employees.length === 0 ? (
                <p className="no-employees">No employees added yet.</p>
            ) : (
                <div className="table-container">
                    <div className="table-filters">
                        <label htmlFor="roleFilter">Filter by Role:</label>
                        <select
                            id="roleFilter"
                            value={selectedRoleFilter}
                            onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees
                                .filter(emp => selectedRoleFilter === 'all' || emp.role === selectedRoleFilter)
                                .map((emp) => (
                                    <tr key={emp._id}>
                                        <td><img src={emp.image || 'https://placehold.co/50x50'} alt={emp.name} className="table-img" /></td>
                                        <td>{emp.name}</td>
                                        <td>{emp.user?.email || 'N/A'}</td>
                                        <td>{emp.role}</td>
                                        <td>₹{emp.salary?.toFixed(2) || '0.00'}</td>
                                        <td>
                                            <button onClick={() => handleEdit(emp)} className="btn yellow small">Edit</button>
                                            <button onClick={() => handleDelete(emp._id)} className="btn red small">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;