import { useState, useEffect } from "react";
import "./Weather.css";
import searchSvg from "./assets/search.svg";
import searchWhiteSvg from "./assets/searchWhite.svg";
import locationSvg from "./assets/location.svg";
import humiditySvg from "./assets/humidity.svg";
import windSvg from "./assets/wind.svg";
import sunriseSvg from "./assets/sunrise.svg";
import sunsetSvg from "./assets/sunset.svg";
import gpsSvg from "./assets/gps.svg";

const api = {
  key: "95feffb0b9ba0f66f672bf259567d1a4",
  base: "https://api.openweathermap.org/data/2.5/",
};

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [locationAccess, setLocationAccess] = useState(false);


  const setErrorWithTimeout = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  // Fetch weather coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${api.base}weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${api.key}`
      );
      const result = await response.json();

      if (result.cod !== 200) {
        setErrorWithTimeout(result.message);
      } else {
        setWeather(result);
      }
      setLoading(false);
    } catch (err) {
      setErrorWithTimeout("Failed to fetch weather data");
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setErrorWithTimeout("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await fetchWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );
      setLocationAccess(true);
    } catch (err) {
      setErrorWithTimeout(
        "Location access denied. Please enable location services or search manually."
      );
      setLoading(false);
      setLocationAccess(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [unit]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${api.base}weather?q=${query}&units=${unit}&appid=${api.key}`
      );
      const result = await response.json();

      if (result.cod !== 200) {
        setErrorWithTimeout(result.message);
      } else {
        setWeather(result);
        setLocationAccess(false);
      }
      setLoading(false);
      setQuery("");
    } catch (err) {
      setErrorWithTimeout("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const dateBuilder = (d) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Section */}
        <div className="p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Weather Forecast
          </h1>
          <p className="text-gray-600 mt-2">Get real-time weather updates</p>
        </div>

        {/* Search Section */}
        <div className="px-4 md:px-6 pb-4">
          <div className="relative flex items-center bg-gray-100 rounded-full p-2 shadow-inner">
            {/* <img
              className="w-5 h-5 ml-3 mr-2"
              src={searchSvg}
              alt="search icon"
            /> */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a city..."
              className="flex-grow bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 p-2 text-base md:text-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-3 m-1 rounded-full transition-colors ml-2 text-sm md:text-base"
            >
              <img src={searchWhiteSvg} alt="search button" className="w-full h-full" />
            </button>
          </div>

          <div className="flex flex-row justify-center md:justify-start gap-2 sm:gap-4 mt-4">
            <button
              onClick={getCurrentLocation}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 md:px-4 rounded-full transition-colors text-sm md:text-base"
            >
              <img
                src={gpsSvg}
                alt="GPS"
                className="w-4 h-4 md:w-5 md:h-5 mr-2"
              />
              My Location
            </button>
            <button
              onClick={toggleUnit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 md:px-4 rounded-full transition-colors text-sm md:text-base"
            >
              Switch to °{unit === "metric" ? "F" : "C"}
            </button>
          </div>

          {loading && (
            <div className="mt-4 text-center h-12 flex items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-700 mt-2 ml-2">Loading weather data...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center h-12 flex items-center justify-center">
              {error}
            </div>
          )}
        </div>

        {/* Weather Display Section */}
        {weather?.main ? (
          <div className="bg-gray-50 text-gray-800 p-4 md:p-6 rounded-t-3xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Location and Date */}
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  <img
                    className="w-4 h-4 md:w-5 md:h-5 mr-2"
                    src={locationSvg}
                    alt="location icon"
                  />
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {weather.name}, {weather.sys?.country}
                    {locationAccess && (
                      <span className="ml-2 text-xs md:text-sm text-gray-500">
                        (Your Location)
                      </span>
                    )}
                  </h2>
                </div>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  {dateBuilder(new Date())}
                </p>
              </div>

              {/* Current Weather */}
              <div className="flex items-center mt-4 md:mt-0">
                <img
                  className="w-16 h-16 md:w-20 md:h-20"
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                />
                <div className="ml-3 md:ml-4">
                  <div className="text-4xl md:text-5xl font-bold text-gray-800">
                    {Math.round(weather.main.temp)}°
                    {unit === "metric" ? "C" : "F"}
                  </div>
                  <div className="text-base md:text-lg capitalize text-gray-600">
                    {weather.weather[0].description}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-xl flex flex-col items-center shadow">
                <img
                  src={humiditySvg}
                  alt="Humidity"
                  className="w-8 h-8 md:w-10 md:h-10 mb-2"
                />
                <span className="text-xs md:text-sm text-gray-500">
                  Humidity
                </span>
                <span className="text-lg md:text-xl font-bold text-gray-800">
                  {weather.main.humidity}%
                </span>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl flex flex-col items-center shadow">
                <img
                  src={windSvg}
                  alt="Wind"
                  className="w-8 h-8 md:w-10 md:h-10 mb-2"
                />
                <span className="text-xs md:text-sm text-gray-500">
                  Wind Speed
                </span>
                <span className="text-lg md:text-xl font-bold text-gray-800">
                  {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
                </span>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl flex flex-col items-center shadow">
                <img
                  src={sunriseSvg}
                  alt="Sunrise"
                  className="w-8 h-8 md:w-10 md:h-10 mb-2"
                />
                <span className="text-xs md:text-sm text-gray-500">
                  Sunrise
                </span>
                <span className="text-lg md:text-xl font-bold text-gray-800">
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl flex flex-col items-center shadow">
                <img
                  src={sunsetSvg}
                  alt="Sunset"
                  className="w-8 h-8 md:w-10 md:h-10 mb-2"
                />
                <span className="text-xs md:text-sm text-gray-500">Sunset</span>
                <span className="text-lg md:text-xl font-bold text-gray-800">
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-xl shadow">
                <h3 className="font-medium mb-1 md:mb-2 text-gray-700 text-sm md:text-base">
                  Feels Like
                </h3>
                <p className="text-lg md:text-xl text-gray-800">
                  {Math.round(weather.main.feels_like)}°
                  {unit === "metric" ? "C" : "F"}
                </p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow">
                <h3 className="font-medium mb-1 md:mb-2 text-gray-700 text-sm md:text-base">
                  Pressure
                </h3>
                <p className="text-lg md:text-xl text-gray-800">
                  {weather.main.pressure} hPa
                </p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow">
                <h3 className="font-medium mb-1 md:mb-2 text-gray-700 text-sm md:text-base">
                  Visibility
                </h3>
                <p className="text-lg md:text-xl text-gray-800">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow">
                <h3 className="font-medium mb-1 md:mb-2 text-gray-700 text-sm md:text-base">
                  Cloud Cover
                </h3>
                <p className="text-lg md:text-xl text-gray-800">
                  {weather.clouds?.all}%
                </p>
              </div>
            </div>
          </div>
        ) : !loading && !error ? (
          <div className="bg-gray-50 text-gray-800 p-6 rounded-t-3xl text-center">
            <p>No weather data available. Try searching for a location.</p>
          </div>
        ) : null}

        {/* Footer */}
        {weather?.main && (
          <div className="bg-gray-100 text-gray-600 text-center p-3 md:p-4 text-xs md:text-sm">
            Last updated at {new Date(weather.dt * 1000).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
