import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortOption, setSortOption] = useState('joined-newest');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:5000/api/users?_page=${currentPage}&_limit=${limit}`);
                const allUsersResponse = await axios.get(`http://localhost:5000/api/users`);

                setTotalPages(Math.ceil(allUsersResponse.data.length / limit));
                let filtered = res.data;

                if (searchTerm.trim()) {
                    filtered = filtered.filter(user =>
                        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (roleFilter !== 'all') {
                    filtered = filtered.filter(user => user.role === roleFilter);
                }

                switch (sortOption) {
                    case 'joined-newest':
                        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    case 'joined-oldest':
                        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        break;
                    case 'role-asc':
                        filtered.sort((a, b) => a.role.localeCompare(b.role));
                        break;
                    case 'role-desc':
                        filtered.sort((a, b) => b.role.localeCompare(a.role));
                        break;
                    default:
                        break;
                }

                setUsers(res.data);
                setFilteredUsers(filtered);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to fetch user data. Please check the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchTerm, roleFilter, sortOption]);

    const handleBlock = async (user) => {
        try {
            const newStatus = user.status === 'active' ? 'blocked' : 'active';
            const updatedUser = { ...user, status: newStatus };

            await axios.put(`http://localhost:5000/api/users/${user._id}/status`, { status: newStatus });

            setFilteredUsers(filteredUsers.map(u => (u._id === user._id ? updatedUser : u)));
            setUsers(users.map(u => (u._id === user._id ? updatedUser : u)));
        } catch (err) {
            console.error(`Error changing status for user ${user._id}:`, err);
            alert("Failed to update user status.");
        }
    };

    if (loading) return <div className="message">Loading user data...</div>;
    if (error) return <div className="message error">{error}</div>;

    return (
        <div className="user-management">
            <h1>User Management</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="joined-newest">Joined: Newest First</option>
                    <option value="joined-oldest">Joined: Oldest First</option>
                    <option value="role-asc">Role: A → Z</option>
                    <option value="role-desc">Role: Z → A</option>
                </select>
            </div>
<div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="message">No users found.</td>
                        </tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td className={`status ${user.status || 'active'}`}>
                                    {user.status || 'active'}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleBlock(user)}>
                                        {user.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            </div>

            <div className="pagination">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={currentPage === idx + 1 ? 'active' : ''}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
