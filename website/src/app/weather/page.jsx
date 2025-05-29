"use client"
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, Snowflake, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY
const BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setlocation] = useState('London')

  const fetchWeatherData = async (location = 'London') => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather and 3-day forecast
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=yes&alerts=yes`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      setCurrentWeather(data.current);
      setForecast(data.forecast);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setlocation(searchQuery.trim())
      fetchWeatherData(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const getWeatherIcon = (condition, isDay = 1) => {
    const code = condition?.code || 1000;
    
    if (code === 1000) return isDay ? <Sun className="w-8 h-8 text-yellow-500" /> : <Sun className="w-8 h-8 text-yellow-300" />;
    if ([1003, 1006, 1009].includes(code)) return <Cloud className="w-8 h-8 text-gray-500" />;
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if ([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1261, 1264].includes(code)) return <Snowflake className="w-8 h-8 text-blue-300" />;
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return <Zap className="w-8 h-8 text-purple-500" />;
    
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const formatHourlyData = () => {
    if (!forecast?.forecastday?.[0]?.hour) return [];
    
    return forecast.forecastday[0].hour.slice(0, 24).map(hour => ({
      time: new Date(hour.time).getHours() + ':00',
      temp: Math.round(hour.temp_c),
      humidity: hour.humidity,
      windSpeed: hour.wind_kph
    }));
  };

  const formatDailyData = () => {
    if (!forecast?.forecastday) return [];
    
    return forecast.forecastday.map(day => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
      avgTemp: Math.round(day.day.avgtemp_c),
      humidity: day.day.avghumidity
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Dashboard</h1>
          <p className="text-gray-600">Get detailed weather information and forecasts</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a city..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {currentWeather && (
          <>
            {/* Current Weather Card */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-4  gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-lg text-gray-600">Current Location</span>
                      <div className="text-lg text-gray-700 underline"> {location} </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      {getWeatherIcon(currentWeather.condition, currentWeather.is_day)}
                      <div className="ml-4">
                        <div className="text-5xl font-bold text-gray-800">{Math.round(currentWeather.temp_c)}°C</div>
                        <div className="text-gray-600">{currentWeather.condition.text}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Feels like {Math.round(currentWeather.feelslike_c)}°C
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Humidity</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{currentWeather.humidity}%</div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Wind className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Wind</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(currentWeather.wind_kph)} km/h</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Eye className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Visibility</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{currentWeather.vis_km} km</div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Gauge className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Pressure</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{Math.round(currentWeather.pressure_mb)} mb</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="max-w-6xl mx-auto mb-8 grid lg:grid-cols-2 gap-8">
              {/* Hourly Temperature Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">24-Hour Temperature</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatHourlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '14px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#1d4ed8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Forecast Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">3-Day Forecast</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatDailyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '14px'
                      }} 
                    />
                    <Bar dataKey="maxTemp" fill="#ef4444" name="Max Temp" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="minTemp" fill="#3b82f6" name="Min Temp" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Forecast Cards */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">3-Day Detailed Forecast</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {forecast?.forecastday?.map((day, index) => (
                  <div key={day.date} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="flex justify-center mb-4">
                        {getWeatherIcon(day.day.condition)}
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-1">
                        {Math.round(day.day.maxtemp_c)}°
                      </div>
                      <div className="text-lg text-gray-600 mb-2">
                        {Math.round(day.day.mintemp_c)}°
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.day.condition.text}
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chance of rain</span>
                        <span className="font-medium">{day.day.daily_chance_of_rain}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Humidity</span>
                        <span className="font-medium">{day.day.avghumidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wind</span>
                        <span className="font-medium">{Math.round(day.day.maxwind_kph)} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UV Index</span>
                        <span className="font-medium">{day.day.uv}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;