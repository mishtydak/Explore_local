/**
 * Weather Widget Component
 * Displays weather information for a location using Open-Meteo API
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

      try {
        // Open-Meteo API doesn't require an API key
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature&timezone=auto`
        );

        const current = response.data.current;
        
        // Map Open-Meteo weather codes to descriptions and icons
        const weatherCodeMap = {
          0: { description: 'Clear sky', icon: '☀️' },
          1: { description: 'Mainly clear', icon: '🌤️' },
          2: { description: 'Partly cloudy', icon: '⛅' },
          3: { description: 'Overcast', icon: '☁️' },
          45: { description: 'Fog', icon: '🌫️' },
          48: { description: 'Depositing rime fog', icon: '🌫️' },
          51: { description: 'Light drizzle', icon: '🌦️' },
          53: { description: 'Moderate drizzle', icon: '🌦️' },
          55: { description: 'Dense drizzle', icon: '🌦️' },
          56: { description: 'Light freezing drizzle', icon: '🌧️' },
          57: { description: 'Dense freezing drizzle', icon: '🌧️' },
          61: { description: 'Slight rain', icon: '🌧️' },
          63: { description: 'Moderate rain', icon: '🌧️' },
          65: { description: 'Heavy rain', icon: '🌧️' },
          66: { description: 'Light freezing rain', icon: '🌧️' },
          67: { description: 'Heavy freezing rain', icon: '🌧️' },
          71: { description: 'Slight snow fall', icon: '❄️' },
          73: { description: 'Moderate snow fall', icon: '❄️' },
          75: { description: 'Heavy snow fall', icon: '❄️' },
          77: { description: 'Snow grains', icon: '❄️' },
          80: { description: 'Slight rain showers', icon: '🌦️' },
          81: { description: 'Moderate rain showers', icon: '🌦️' },
          82: { description: 'Violent rain showers', icon: '🌧️' },
          85: { description: 'Slight snow showers', icon: '❄️' },
          86: { description: 'Heavy snow showers', icon: '❄️' },
          95: { description: 'Thunderstorm', icon: '⛈️' },
          96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
          99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
        };

        const weatherInfo = weatherCodeMap[current.weather_code] || { description: 'Unknown', icon: '❓' };

        setWeather({
          temp: current.temperature_2m,
          apparentTemp: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          description: weatherInfo.description,
          icon: weatherInfo.icon,
          location: response.data.timezone
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
            Feels like: {weather.apparentTemp}°C
          </div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Humidity: {weather.humidity}%
          </div>
        </div>
        <div style={{ fontSize: '3rem' }}>
          {weather.icon}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;