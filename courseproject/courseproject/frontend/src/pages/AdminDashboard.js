/**
 * Admin Dashboard Page
 * Admin-only page for managing the platform
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDuplicates,
} from '../services/placeService';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, duplicatesData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getDuplicates(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setDuplicates(duplicatesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage platform statistics, users, and content</p>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #eee' }}>
        <button
          onClick={() => setActiveTab('stats')}
          className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`btn ${activeTab === 'duplicates' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Duplicates ({duplicates.length})
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div>
          <h2>Platform Statistics</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalPlaces}</div>
              <div className="stat-label">Total Places</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalDuplicates}</div>
              <div className="stat-label">Duplicates</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalActivities}</div>
              <div className="stat-label">Total Activities</div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Places by Category</h3>
            <div className="card" style={{ padding: '1.5rem' }}>
              {stats.placesByCategory?.map((item) => (
                <div key={item._id} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item._id}</span>
                  <span style={{ fontWeight: 'bold' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Recent Places</h3>
            <div className="card" style={{ padding: '1.5rem' }}>
              {stats.recentPlaces?.map((place) => (
                <div key={place._id} style={{ marginBottom: '0.5rem' }}>
                  {place.name} - {new Date(place.createdAt).toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>All Users</h2>
          <div className="card" style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{user.username}</td>
                    <td style={{ padding: '1rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        style={{ padding: '0.5rem' }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.9rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'duplicates' && (
        <div>
          <h2>Duplicate Places</h2>
          {duplicates.length > 0 ? (
            <div className="card" style={{ padding: '1.5rem' }}>
              {duplicates.map((duplicate) => (
                <div key={duplicate._id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                  <h4>{duplicate.name}</h4>
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>{duplicate.description}</p>
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>
                    Duplicate of: {duplicate.duplicateOf?.name || 'Unknown'}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>
                    Uploaded by: {duplicate.uploaderName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              No duplicate places found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

