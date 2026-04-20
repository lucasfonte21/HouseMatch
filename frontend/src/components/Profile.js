import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Profile.css';

function Profile() {
  const username = localStorage.getItem('username') || 'User';
  const [stats, setStats] = useState({ liked: 0, disliked: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch {
        // silently fail, zeros will show
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchLikedSongs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me/liked-songs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setLikedSongs(data);
      } catch {
        // silently fail
      } finally {
        setSongsLoading(false);
      }
    };

    fetchStats();
    fetchLikedSongs();
  }, []);

  return (
    <div className="profile-container">
      <Navbar />

      <div className="profile-content">

        {/* Avatar + name */}
        <div className="profile-header">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile-name">{username}</h1>
            <p className="profile-meta">Member since 2025 · House music enthusiast</p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-number">{statsLoading ? '—' : stats.liked}</span>
            <span className="stat-label">Liked</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{statsLoading ? '—' : stats.disliked}</span>
            <span className="stat-label">Passed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{statsLoading ? '—' : stats.total}</span>
            <span className="stat-label">Swiped</span>
          </div>
        </div>

        {/* Liked songs */}
        <section className="profile-section">
          <h2 className="profile-section-title">Liked Songs</h2>
          {songsLoading ? (
            <p className="profile-meta">Loading...</p>
          ) : likedSongs.length === 0 ? (
            <p className="profile-meta">No liked songs yet.</p>
          ) : (
            <div className="liked-songs-list">
              {likedSongs.map(song => (
                <div key={song._id} className="liked-song-card">
                  <div
                    className="liked-song-art"
                    style={song.artworkUrl ? { backgroundImage: `url(${song.artworkUrl})`, backgroundSize: 'cover' } : {}}
                  />
                  <div>
                    <p className="liked-song-title">{song.title}</p>
                    <p className="liked-song-artist">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Profile;
