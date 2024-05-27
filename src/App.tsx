import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import "./App.css";

import searchIcon from "./assets/search.png";
import sunIcon from "./assets/sun.png";
import cloudIcon from "./assets/cloud.png";
import rainIcon from "./assets/rain.png";
import drizzleIcon from "./assets/drizzle.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";

interface WeatherDetailsProps {
  icon: string;
  temp: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  humidity: number;
  wind: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  icon,
  temp,
  city,
  country,
  latitude,
  longitude,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="weather" />
      </div>
      <div className="temp"> {temp} °C </div>
      <div className="location"> {city}</div>
      <div className="country"> {country}</div>
      <div className="cord">
        <div>
          <span className="latitude">Latitude </span>
          <span>{latitude}</span>
        </div>
        <div>
          <span className="longitude">Longitude </span>
          <span>{longitude}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent"> {humidity} %</div>
            <div className="text"> Humidity </div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent"> {wind} Km/h </div>
            <div className="text"> Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [icon, setIcon] = useState<string>(snowIcon);
  const [temp, setTemp] = useState<number>(0);
  const [city, setCity] = useState<string>("Chennai");
  const [country, setCountry] = useState<string>("IN");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [wind, setWind] = useState<number>(0);
  const [text, setText] = useState<string>("Chennai");
  const [cityNotFound, setCityNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const weatherIconMap: { [key: string]: string } = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "010d": rainIcon,
    "010n": rainIcon,
    "013d": snowIcon,
    "013n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=05603d3c536d6a05ad93952fa5e2c2b1&units=Metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || cloudIcon);
      setCityNotFound(false);
    } catch (error) {
      // console.error("An error occurred:", error.message);
      setError("An error occurred while fetching the weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <>
      <h1>Weather App</h1>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="city-input"
            placeholder="Enter City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={search}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            latitude={latitude}
            longitude={longitude}
            humidity={humidity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
};

export default App;
