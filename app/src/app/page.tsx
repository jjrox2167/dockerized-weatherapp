'use client';

import { JSX, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
}

export default function WeatherDashboard() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


const fetchWeather = async () => {
  if (!city) return;

  const apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

  if (!apiKey) {
    console.error('❌ Missing API key in env');
    setError('Weather service is not configured. Please try again later.');
    return;
  }

  setLoading(true);
  setError('');
  setWeather(null);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (response.ok) {
      setWeather(data);
    } else {
      setError(data.message || 'Failed to fetch weather data.');
    }
  } catch (err) {
    console.error('Error fetching weather data:', err);
    setError('Failed to fetch weather data. Please try again.');
  } finally {
    setLoading(false);
  }
};



  const getWeatherIcon = (main?: string): JSX.Element => {
    switch (main?.toLowerCase()) {
      case 'clear':
        return <Sun className="w-24 h-24 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="w-24 h-24 text-blue-400" />;
      case 'clouds':
        return <Cloud className="w-24 h-24 text-gray-400" />;
      default:
        return <Cloud className="w-24 h-24 text-gray-400" />;
    }
  };

  // Removed unused handleKeyPress function

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Weather Dashboard
          </h1>
          <p className="text-white text-lg opacity-90">
            Get real-time weather information for any city
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              disabled={loading}
            />
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* API Key Notice */}
        {!weather && !error && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 mb-8 text-white text-center">
            <p className="text-lg font-semibold mb-2">Demo App Setup</p>
            <p className="text-sm opacity-90">
              To use this app, get a free API key from{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                OpenWeatherMap
              </a>
              {' '}and replace &apos;demo&apos; in the code with your key.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur-md text-white rounded-3xl p-6 mb-8 text-center shadow-lg">
            <p className="text-lg font-semibold">{error}</p>
            <p className="text-sm mt-2 opacity-90">
              Make sure you&apos;ve added a valid API key and the city name is correct.
            </p>
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Main Weather Info */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                {weather.name}, {weather.sys.country}
              </h2>
              <div className="flex justify-center mb-4">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div className="text-7xl font-bold text-white mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <p className="text-2xl text-white capitalize">
                {weather.weather[0].description}
              </p>
              <p className="text-white opacity-75 mt-2">
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <Wind className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm opacity-75">Wind Speed</p>
                <p className="text-white text-xl font-semibold">
                  {weather.wind.speed} m/s
                </p>
              </div>

              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <Droplets className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm opacity-75">Humidity</p>
                <p className="text-white text-xl font-semibold">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <Gauge className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm opacity-75">Pressure</p>
                <p className="text-white text-xl font-semibold">
                  {weather.main.pressure} hPa
                </p>
              </div>

              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <Eye className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm opacity-75">Visibility</p>
                <p className="text-white text-xl font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}