import { useState } from "react";
import "./Weather.css";
import searchSvg from "./assets/search.svg";
import locationSvg from "./assets/location.svg";

const api = {
  key: "95feffb0b9ba0f66f672bf259567d1a4",
  base: "https://api.openweathermap.org/data/2.5/",
};

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      setError("");
      fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod !== 200) {
            setError(result.message);
          } else {
            setWeather(result);
          }
          setLoading(false);
          setQuery("");
        })
        .catch((err) => {
          setError("Something went wrong. Please try again.");
          setLoading(false);
        });
    }
  };

  const dateBuilder = (d) => {
    let months = [
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
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col md:flex-row items-center justify-center">
        {/* Search Box */}
        <div className="left-section w-full md:w-1/2 flex flex-col items-center justify-center mb-6 md:mb-0">
          <h1 className="text-gray-900 text-4xl font-bold mb-6">Weather App</h1>
          <div className="input-container flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 shadow-md p-4 rounded-md">
            <img className="w-6 h-6 mr-2" src={searchSvg} alt="search icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={search}
              placeholder="Enter City Name"
              className="input-search p-2 outline-none w-64 text-lg"
            />
          </div>
          {loading && (
            <div className="text-lg text-gray-600 mt-4">Loading weather data...</div>
          )}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>

        {/* Weather details */}
        {weather.main && (
          <div className="right-section w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg p-6 rounded-lg text-white">
            <div className="location-box text-center mb-6">
              <div className="flex items-center justify-center">
                <img className="w-6 h-6 mr-2" src={locationSvg} alt="location icon" />
                <h2 className="location text-3xl font-semibold drop-shadow-lg">
                  {weather.name}, {weather.sys?.country}
                </h2>
              </div>
              <div className="date text-lg text-gray-200 italic">
                {dateBuilder(new Date())}
              </div>
            </div>

            <div className="weather-box flex flex-col items-center justify-center">
              <img
                className="weather-icon w-28 h-28 mb-4 "
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <div className="temp text-6xl font-extrabold text-white mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="weather-description text-2xl capitalize my-2 text-gray-200">
                {weather.weather[0].main} - {weather.weather[0].description}
              </div>
              <div className="feels-like text-lg text-gray-300">
                Feels like: {Math.round(weather.main.feels_like)}°C
              </div>

              <div className="wind-humidity flex space-x-8 mt-6 text-lg text-gray-300">
                <p className="flex items-center">
                  <span className="font-bold">🌬️ Wind: </span> {weather.wind.speed} m/s
                </p>
                <p className="flex items-center">
                  <span className="font-bold">💧 Humidity: </span> {weather.main.humidity}%
                </p>
              </div>

              <div className="sun-times flex space-x-8 mt-6 text-lg text-gray-300">
                <p className="flex items-center">
                  <span className="font-bold">🌅 Sunrise: </span> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
                </p>
                <p className="flex items-center">
                  <span className="font-bold">🌇 Sunset: </span> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
