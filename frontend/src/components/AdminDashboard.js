import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [songsLoading, setSongsLoading] = useState(true);
  const [error, setError] = useState('');
  const [songsError, setSongsError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        //Could create another route for pre-query optimization
        const res = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data);
      } 
      catch (err) {
        setError(err.message || 'Something went wrong.');
      } 
      finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/songs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch songs');
        setSongs(data);
      } 
      catch (err) {
        setSongsError(err.message || 'Failed to load songs.');
      } 
      finally {
        setSongsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handleDeleteSong = async (songId, songTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${songTitle}"? This will also remove all votes for this song.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/songs/${songId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete song');
      }

      setSongs(songs.filter(song => song._id !== songId));
      alert('Song deleted successfully');
    } 
    catch (err) {
      alert(err.message || 'Failed to delete song');
    }
  };
// Make sure the DB/BE is running, no placeholder data 
  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Registered users</p>

        {loading && <p className="admin-status">Loading...</p>}
        {error && <p className="admin-status admin-error">{error}</p>}

        {!loading && !error && (
          <div className="admin-table-wrapper">
            //Code segment below from W3School HTML Tutorial
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-empty">No users found.</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`admin-role admin-role--${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="admin-subtitle" style={{ marginTop: '48px' }}>Song Management</p>

        {songsLoading && <p className="admin-status">Loading songs...</p>}
        {songsError && <p className="admin-status admin-error">{songsError}</p>}

        {!songsLoading && !songsError && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Likes</th>
                  <th>Dislikes</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-empty">No songs found.</td>
                  </tr>
                ) : (
                  songs.map(song => (
                    <tr key={song._id}>
                      <td>{song.title}</td>
                      <td>{song.artist || 'Unknown'}</td>
                      <td>{song.likes || 0}</td>
                      <td>{song.dislikes || 0}</td>
                      <td>{song.submittedBy?.username || 'Unknown'}</td>
                      <td>{new Date(song.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteSong(song._id, song.title)}
                          className="admin-delete-btn"
                          title="Delete song"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
