import React, { useEffect, useState } from 'react';
import './Sidebar.css';

// Simple Sidebar that fetches 7-day forecast from Open-Meteo
export default function Sidebar() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadWeather(lat, lon) {
      setLoading(true);
      setError(null);
      try {
        // include weathercode and temperatures; timezone=auto keeps local dates
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        if (!mounted) return;
        // structure: data.daily.time (dates), temperature_2m_max/min arrays
        setForecast(data.daily);
        // attempt reverse geocoding to get a friendly location name
        try {
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en`;
          const gres = await fetch(geoUrl);
          if (gres.ok) {
            const gdata = await gres.json();
            const place = gdata.results && gdata.results[0];
            if (place) {
              const parts = [place.name, place.admin1, place.country].filter(Boolean);
              setLocationName(parts.join(', '));
            }
          }
        } catch (e) {
          // ignore geocoding errors — not critical
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load weather');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Try geolocation, fallback to a sensible default (London)
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        () => loadWeather(51.5074, -0.1278) // London fallback
      );
    } else {
      loadWeather(51.5074, -0.1278);
    }

    return () => { mounted = false; };
  }, []);

    function weatherCodeToIcon(code) {
      // lightweight mapping from Open-Meteo weathercode to emoji icons
      // https://open-meteo.com/en/docs
      if (code === 0) return '☀️'; // clear sky
      if (code === 1 || code === 2 || code === 3) return '⛅'; // partly cloudy
      if (code === 45 || code === 48) return '🌫️'; // fog
      if (code === 51 || code === 53 || code === 55) return '🌦️'; // drizzle
      if (code === 61 || code === 63 || code === 65) return '🌧️'; // rain
      if (code === 66 || code === 67) return '🌧️';
      if (code === 71 || code === 73 || code === 75) return '❄️'; // snow
      if (code === 77) return '❄️';
      if (code === 80 || code === 81 || code === 82) return '🌧️';
      if (code === 95 || code === 96 || code === 99) return '⛈️'; // thunder
      return '🌤️';
    }

    function renderDays() {
    if (!forecast) return null;
    const { time, temperature_2m_max, temperature_2m_min, weathercode } = forecast;
    return time.map((dateStr, i) => {
      // format weekday short
      const weekday = new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' });
      const maxC = temperature_2m_max[i];
      const minC = temperature_2m_min[i];
      // convert to Fahrenheit
      const maxF = Math.round((maxC * 9) / 5 + 32);
      const minF = Math.round((minC * 9) / 5 + 32);
      const code = weathercode ? weathercode[i] : null;
      const icon = weatherCodeToIcon(code);
      return (
        <div className="weather-day" key={dateStr}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="weather-icon">{icon}</div>
            <div className="day-label">{weekday}</div>
          </div>
          <div className="temp"><span className="temp-max">{maxF}°F</span> / <span className="temp-min">{minF}°F</span></div>
        </div>
      );
    });
  }

  return (
    <aside className="sidebar">
      <div className="weather-card">
        <h4 className="weather-title">Weekly Weather</h4>
        {locationName && <div className="weather-location">{locationName}</div>}
        {loading && <p className="weather-note">Loading…</p>}
        {error && <p className="weather-note">{error}</p>}
        <div className="weather-list">
          {forecast ? renderDays() : !loading && !error && (
            <div className="weather-day">No data yet</div>
          )}
        </div>
        <p className="weather-note">Weather data powered by Open-Meteo (no API key required).</p>
      </div>
    </aside>
  );
}
