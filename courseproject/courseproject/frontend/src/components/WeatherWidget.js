/**
 * Weather Widget Component
 * Displays weather information for a location
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!latitude || !longitude) {
        setLoading(false);
        return;
      }

      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      // ✅ Proper check
      if (!apiKey) {
        setError('Weather API key not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );

        setWeather({
          temp: Math.round(response.data.main.temp),
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          city: response.data.name,
        });

        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="weather-widget">
        <p>Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <p style={{ color: '#999' }}>{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-widget">
      <h3>Current Weather</h3>
      <div className="weather-info">
        <div>
          <div className="weather-temp">{weather.temp}°C</div>
          <div style={{ textTransform: 'capitalize', color: '#666' }}>
            {weather.description}
          </div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {weather.city}
          </div>
        </div>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            style={{ width: '80px', height: '80px' }}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
