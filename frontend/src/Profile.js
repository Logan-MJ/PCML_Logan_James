import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_PROFILE_URL = 'http://localhost:8000/garage/api/profile/';

function getCookie(name) {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', first_name: '', last_name: '', email: '', bio: '', profile_image: null });
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const res = await fetch(API_PROFILE_URL, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
            if (mounted) {
              // API may return profile_image and user fields; preserve local bio if present
              const stored = JSON.parse(localStorage.getItem('pcml_profile') || 'null') || {};
              const merged = { bio: stored.bio || '', profile_image: data.profile_image || stored.profile_image || null, ...data };
              setProfile(merged);
              localStorage.setItem('pcml_profile', JSON.stringify(merged));
              if (data.username) localStorage.setItem('pcml_user', data.username);
            }
          return;
        }
      } catch (e) {
        // ignore network errors
      }

      // fallback to local storage
      try {
        const stored = JSON.parse(localStorage.getItem('pcml_profile') || 'null');
        if (mounted && stored) setProfile(stored);
      } catch (e) {
        // ignore
      }
    }

    fetchProfile();

    return () => { mounted = false };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setSelectedFile(f || null);
    if (f) {
      // show preview locally
      const preview = URL.createObjectURL(f);
      setProfile(prev => ({ ...prev, profile_image: preview }));
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    // If a file is selected, upload as multipart/form-data
    let options = {
      method: 'PUT',
      headers: {
        'X-CSRFToken': csrftoken || ''
      },
      credentials: 'include'
    };

    if (selectedFile) {
      const form = new FormData();
      form.append('first_name', profile.first_name || '');
      form.append('last_name', profile.last_name || '');
      form.append('email', profile.email || '');
      form.append('bio', profile.bio || '');
      form.append('image', selectedFile);
      options.body = form;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ first_name: profile.first_name, last_name: profile.last_name, email: profile.email, bio: profile.bio });
    }

    fetch(API_PROFILE_URL, options).then(async res => {
      if (res.ok) {
        const data = await res.json();
        // Merge server response with local bio and image
        const merged = { bio: profile.bio || '', profile_image: data.profile_image || profile.profile_image || null, ...data };
        localStorage.setItem('pcml_profile', JSON.stringify(merged));
        if (data.username) localStorage.setItem('pcml_user', data.username);
        window.dispatchEvent(new CustomEvent('pcml_login', { detail: data.username }));
        setMessage('Profile saved to server.');
        setTimeout(() => setMessage(''), 3000);
      } else if (res.status === 401) {
        // Not authenticated - redirect to login
        navigate('/login');
      } else {
        // fallback to local save
        localStorage.setItem('pcml_profile', JSON.stringify(profile));
        if (profile.username) {
          localStorage.setItem('pcml_user', profile.username);
          window.dispatchEvent(new CustomEvent('pcml_login', { detail: profile.username }));
        }
        setMessage('Saved locally (server save failed).');
        setTimeout(() => setMessage(''), 3000);
      }
    }).catch(() => {
      // Save locally including bio
      localStorage.setItem('pcml_profile', JSON.stringify(profile));
      if (profile.username) {
        localStorage.setItem('pcml_user', profile.username);
        window.dispatchEvent(new CustomEvent('pcml_login', { detail: profile.username }));
      }
      setMessage('Saved locally (network error).');
      setTimeout(() => setMessage(''), 3000);
    });
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-lg mx-auto card">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        {message && <div className="mb-4 text-sm text-green-700">{message}</div>}
        <form onSubmit={handleSave} className="car-form">
          <h3 className="car-form-title">Edit Profile</h3>

          <div className="car-form-group">
            <label className="car-form-label">Username</label>
            <input name="username" value={profile.username} onChange={handleChange} className="car-form-input" />
          </div>

          <div className="car-form-group">
            <label className="car-form-label">First name</label>
            <input name="first_name" value={profile.first_name} onChange={handleChange} className="car-form-input" />
          </div>

          <div className="car-form-group">
            <label className="car-form-label">Last name</label>
            <input name="last_name" value={profile.last_name} onChange={handleChange} className="car-form-input" />
          </div>

          <div className="car-form-group">
            <label className="car-form-label">Email</label>
            <input name="email" value={profile.email} onChange={handleChange} className="car-form-input" />
          </div>

          <div className="car-form-group">
            <label className="car-form-label">Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} className="car-form-input" rows={4} />
          </div>

          <div className="car-form-group">
            <label className="car-form-label">Profile Picture</label>
            {profile.profile_image && (
              <div style={{ marginBottom: 8 }}>
                <img src={profile.profile_image} alt="Profile" style={{ maxWidth: 120, maxHeight: 120, display: 'block', borderRadius: 6 }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <button type="submit" className="car-form-button">Save</button>
            <button type="button" onClick={() => navigate('/')} className="car-form-button" style={{ background: '#e5e7eb', color: '#111827', marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
