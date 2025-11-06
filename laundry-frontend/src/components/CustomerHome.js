import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function CustomerHome() {
  const [customerName, setCustomerName] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [bestDay, setBestDay] = useState(null);
  const [showHourly, setShowHourly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    // Get API key from environment variable (REACT_APP_OPENWEATHER_API_KEY)
    // If you don't have an API key, it will use demo data instead
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    
      // If no API key is set, use demo weather data immediately
      if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
        console.log('No OpenWeatherMap API key found. Using demo weather data.');
        setDemoWeather();
        return;
      }

    try {
      // Fetch both current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: 'Manila,PH',
            appid: apiKey,
            units: 'metric'
          }
        }),
        axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            q: 'Manila,PH',
            appid: apiKey,
            units: 'metric',
            cnt: 40 // Get more data for hourly forecast
          }
        })
      ]);
      setCurrentWeather(currentResponse.data);
      setWeather(forecastResponse.data);
      findBestLaundryDay(forecastResponse.data.list);
    } catch (error) {
      console.log('Weather API error:', error.response?.status === 401 
        ? 'Invalid API key. Using demo weather data.' 
        : 'Weather API unavailable. Using demo weather data.');
      // Set demo weather data if API fails
      setDemoWeather();
    }
  };

  const setDemoWeather = () => {
    const today = new Date();
    const sunriseDate = new Date(today);
    sunriseDate.setHours(6, 0, 0, 0);
    const sunsetDate = new Date(today);
    sunsetDate.setHours(18, 30, 0, 0);
    
    // Generate current weather data
    const currentDemo = {
      main: {
        temp: 29,
        feels_like: 32,
        temp_min: 27,
        temp_max: 31,
        pressure: 1013,
        humidity: 75
      },
      weather: [{ 
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: 3.5,
        deg: 180
      },
      visibility: 10000,
      sys: {
        sunrise: Math.floor(sunriseDate.getTime() / 1000),
        sunset: Math.floor(sunsetDate.getTime() / 1000)
      }
    };
    
    // Generate forecast data
    const demoData = {
      city: { name: 'Manila', country: 'PH' },
      list: []
    };
    
    // Generate 40 hours of forecast data (5 days * 8 hours per day)
    for (let i = 0; i < 40; i++) {
      const date = new Date(today);
      date.setHours(date.getHours() + (i * 3)); // Every 3 hours
      const hour = date.getHours();
      const weatherMain = i === 8 ? 'Rain' : i === 16 ? 'Clouds' : 'Clear';
      const temp = hour >= 22 || hour <= 6 ? 26 : 28 + Math.floor(Math.random() * 3);
      
      demoData.list.push({
        dt: Math.floor(date.getTime() / 1000),
        weather: [{ 
          main: weatherMain,
          description: i === 8 ? 'light rain' : i === 16 ? 'partly cloudy' : 'clear sky',
          icon: weatherMain === 'Rain' ? '10d' : weatherMain === 'Clouds' ? '02d' : '01d'
        }],
        main: { 
          temp: temp,
          feels_like: temp + 2,
          temp_min: temp - 2,
          temp_max: temp + 2,
          pressure: 1013,
          humidity: 70 + Math.floor(Math.random() * 10)
        },
        wind: {
          speed: 2 + Math.random() * 3,
          deg: Math.floor(Math.random() * 360)
        },
        visibility: 10000,
        pop: weatherMain === 'Rain' ? 0.7 : 0
      });
    }
    
    setCurrentWeather(currentDemo);
    setWeather(demoData);
    findBestLaundryDay(demoData.list);
  };

  const findBestLaundryDay = (forecast) => {
    // Find the best day (clear weather, no rain, low humidity)
    const bestDayIndex = forecast.findIndex(item => {
      const main = item.weather[0].main.toLowerCase();
      return !main.includes('rain') && 
             !main.includes('storm') && 
             item.main.humidity < 80 &&
             item.main.temp > 25; // Good drying temperature
    });
    
    if (bestDayIndex !== -1) {
      const bestDate = new Date(forecast[bestDayIndex].dt * 1000);
      setBestDay({
        date: bestDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        temp: forecast[bestDayIndex].main.temp,
        humidity: forecast[bestDayIndex].main.humidity,
        condition: forecast[bestDayIndex].weather[0].main
      });
    } else {
      setBestDay({ 
        date: 'Tomorrow', 
        temp: forecast[0].main.temp,
        humidity: forecast[0].main.humidity,
        condition: forecast[0].weather[0].main
      });
    }
  };

  const getWeatherIcon = (weatherMain, isLarge = false) => {
    const size = isLarge ? 80 : 40;
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return <span style={{ fontSize: `${size}px` }}>{icons[weatherMain] || '🌤️'}</span>;
  };

  const getHourlyForecast = () => {
    if (!weather || !weather.list) return [];
    // Get next 12 hours (4 items, each is 3 hours apart)
    return weather.list.slice(0, 4);
  };

  const getDailyForecast = () => {
    if (!weather || !weather.list) return [];
    // Group by day and get one forecast per day
    const daily = {};
    weather.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      if (!daily[dayKey]) {
        daily[dayKey] = item;
      }
    });
    return Object.values(daily).slice(0, 5);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Searching for customer:', customerName);
      const response = await axios.get(API_ENDPOINTS.ORDER_SEARCH, {
        params: { customer_name: customerName },
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Search response:', response.data);
      setOrders(response.data);
      if (response.data.length === 0) {
        setError('No orders found for this name. Please check your name and try again.');
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Error searching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      ready: '#28a745',
      completed: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="customer-home">
      {/* Header with Logo */}
      <header className="customer-header">
        <div className="header-content">
          <img src="/washnet-logo.jpg" alt="WASHNET Laundry" className="site-logo" />
          <h1>WASHNET Laundry</h1>
          <p className="subtitle">Fresh • Fast • Clean</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Staff Login
          </button>
        </div>
      </header>

      <div className="customer-container">
        <div className="customer-main">
          {/* Weather Section */}
          <div className="weather-card">
            <div className="weather-header">
              <div>
                <h2>🌤️ Weather Forecast</h2>
                <span className="weather-location">📍 {weather?.city?.name || 'Manila'}, {weather?.city?.country || 'Philippines'}</span>
              </div>
              <button 
                className="weather-toggle-btn"
                onClick={() => setShowHourly(!showHourly)}
              >
                {showHourly ? '📅 Daily' : '⏰ Hourly'}
              </button>
            </div>
            
            {currentWeather && weather && weather.list && weather.list.length > 0 && (
              <>
                {/* Current Weather */}
                <div className="weather-current">
                  <div className="weather-main-info">
                    <div className="weather-icon-large">
                      {getWeatherIcon(currentWeather.weather[0].main, true)}
                    </div>
                    <div className="weather-temp-section">
                      <div className="weather-temp-main">{Math.round(currentWeather.main.temp)}°</div>
                      <div className="weather-feels-like">Feels like {Math.round(currentWeather.main.feels_like)}°</div>
                      <div className="weather-description">
                        {currentWeather.weather[0].description.charAt(0).toUpperCase() + currentWeather.weather[0].description.slice(1)}
                      </div>
                      <div className="weather-temp-range">
                        <span>↑ {Math.round(currentWeather.main.temp_max)}°</span>
                        <span>↓ {Math.round(currentWeather.main.temp_min)}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Weather Stats Grid */}
                  <div className="weather-stats-grid">
                    <div className="weather-stat">
                      <div className="stat-icon">💧</div>
                      <div className="stat-info">
                        <div className="stat-label">Humidity</div>
                        <div className="stat-value">{currentWeather.main.humidity}%</div>
                      </div>
                    </div>
                    <div className="weather-stat">
                      <div className="stat-icon">💨</div>
                      <div className="stat-info">
                        <div className="stat-label">Wind</div>
                        <div className="stat-value">
                          {currentWeather.wind?.speed ? Math.round(currentWeather.wind.speed * 3.6) : 0} km/h
                          {currentWeather.wind?.deg && ` ${getWindDirection(currentWeather.wind.deg)}`}
                        </div>
                      </div>
                    </div>
                    <div className="weather-stat">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <div className="stat-label">Pressure</div>
                        <div className="stat-value">{currentWeather.main.pressure} hPa</div>
                      </div>
                    </div>
                    <div className="weather-stat">
                      <div className="stat-icon">👁️</div>
                      <div className="stat-info">
                        <div className="stat-label">Visibility</div>
                        <div className="stat-value">
                          {currentWeather.visibility ? (currentWeather.visibility / 1000).toFixed(1) : 10} km
                        </div>
                      </div>
                    </div>
                    {currentWeather.sys && (
                      <>
                        <div className="weather-stat">
                          <div className="stat-icon">🌅</div>
                          <div className="stat-info">
                            <div className="stat-label">Sunrise</div>
                            <div className="stat-value">{formatTime(currentWeather.sys.sunrise)}</div>
                          </div>
                        </div>
                        <div className="weather-stat">
                          <div className="stat-icon">🌇</div>
                          <div className="stat-info">
                            <div className="stat-label">Sunset</div>
                            <div className="stat-value">{formatTime(currentWeather.sys.sunset)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Best Day for Laundry */}
                {bestDay && (
                  <div className="best-day-card">
                    <div className="best-day-header">
                      <span className="best-day-icon">⭐</span>
                      <div>
                        <div className="best-day-label">Best Day for Laundry</div>
                        <div className="best-day-info">
                          {bestDay.date} • {Math.round(bestDay.temp)}°C • {bestDay.humidity}% humidity
                        </div>
                        <div className="best-day-reason">
                          Perfect weather for drying clothes - {bestDay.condition} skies with optimal temperature
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hourly or Daily Forecast */}
                <div className="weather-forecast-section">
                  <h3 className="forecast-title">{showHourly ? '📅 Hourly Forecast' : '📆 5-Day Forecast'}</h3>
                  <div className="weather-forecast">
                    {(showHourly ? getHourlyForecast() : getDailyForecast()).map((item, index) => (
                      <div key={index} className="forecast-item-detailed">
                        <div className="forecast-date-time">
                          {showHourly 
                            ? formatTime(item.dt)
                            : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                          }
                        </div>
                        <div className="forecast-icon-large">
                          {getWeatherIcon(item.weather[0].main)}
                        </div>
                        <div className="forecast-temp-main">{Math.round(item.main.temp)}°</div>
                        <div className="forecast-temp-range-small">
                          <span>↑{Math.round(item.main.temp_max)}°</span>
                          <span>↓{Math.round(item.main.temp_min)}°</span>
                        </div>
                        <div className="forecast-details">
                          <div className="forecast-humidity">💧 {item.main.humidity}%</div>
                          <div className="forecast-wind">💨 {item.wind?.speed ? Math.round(item.wind.speed * 3.6) : 0} km/h</div>
                          {item.pop > 0 && (
                            <div className="forecast-rain">🌧️ {Math.round(item.pop * 100)}%</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search Section */}
          <div className="search-card">
            <h2>🔍 Search Your Order</h2>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Enter your full name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-search-input"
              />
              <button type="submit" disabled={loading} className="btn-search">
                {loading ? 'Searching...' : '🔍 Search'}
              </button>
            </form>
            {error && <div className="search-error">{error}</div>}
          </div>

          {/* Results Section */}
          {orders.length > 0 && (
            <div className="orders-results">
              <h3>📋 Your Orders ({orders.length})</h3>
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Order #{order.id}</span>
                      <span 
                        className="order-status" 
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <div className="order-row">
                        <span className="order-label">Total:</span>
                        <span className="order-value">₱{order.total_amount}</span>
                      </div>
                      
                      <div className="order-row">
                        <span className="order-label">Service:</span>
                        <span className="order-value">
                          {order.service_type === 'wash_dry' ? 'Wash & Dry' : 
                           order.service_type === 'wash_only' ? 'Wash Only' : 
                           order.service_type === 'dry_only' ? 'Dry Only' : 
                           order.service_type === 'mixed' ? 'Mixed' : 'Wash & Dry'}
                        </span>
                      </div>
                      
                      <div className="order-row">
                        <span className="order-label">Created:</span>
                        <span className="order-value">{formatDate(order.created_at)}</span>
                      </div>
                      
                      <div className="order-row">
                        <span className="order-label">Service Type:</span>
                        <span className="order-value">
                          {order.delivery_method === 'pickup' ? '🏠 Pickup Only' : '📦 Delivery Only'}
                        </span>
                      </div>
                      
                      {order.pickup_date && (
                        <div className="order-row">
                          <span className="order-label">Pickup Date:</span>
                          <span className="order-value">{formatDate(order.pickup_date)}</span>
                        </div>
                      )}
                      
                      {order.delivery_date && (
                        <div className="order-row">
                          <span className="order-label">Delivery Date:</span>
                          <span className="order-value">{formatDate(order.delivery_date)}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-items">
                      <div className="items-title">Items:</div>
                      {order.items?.map((item, index) => (
                        <div key={index} className="item-badge">
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="customer-footer">
        <div className="footer-content">
          <img src="/washnet-logo.jpg" alt="WASHNET Laundry" className="footer-logo" />
          <div className="footer-text">
            <h3>WASHNET Laundry</h3>
            <p className="footer-tagline">Fresh • Fast • Clean</p>
            <p className="footer-copyright">© 2025 WASHNET Laundry Management System</p>
            <p className="footer-desc">Track Your Laundry • Know the Weather • Plan Smart</p>
            <div className="footer-developers">
              <p className="developers-title">Developed by:</p>
              <p className="developers-names">
                Fritz Arrogante • Earl Angelo Roldan • Enzo Benedict Rosales • Maria Cielo Salazar • Michael Angelo Torres
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CustomerHome;

