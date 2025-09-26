import AutoComplete from "./AutoComplete";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../App.css";

function Home() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const weatherCodes = {
    0: "☀️Clear sky",
    1: "🌤️Mainly clear",
    2: "⛅Partly cloudy",
    3: "☁️Overcast",
    45: "🌫️Fog",
    48: "🌁Depositing rime fog",
    51: "🌦️Drizzle: Light",
    53: "🌦️Drizzle: Moderate",
    55: "🌧️Drizzle: Dense intensity",
    56: "🌧️❄️Freezing Drizzle: Light",
    57: "🌧️❄️Freezing Drizzle: Dense",
    61: "🌧️Rain: Slight",
    63: "🌧️Rain: Moderate",
    65: "🌧️🌧️Rain: Heavy intensity",
    66: "🌧️❄️Freezing Rain: Light",
    67: "🌧️❄️Freezing Rain: Heavy",
    71: "🌨️Snow fall: Slight",
    73: "🌨️Snow fall: Moderate",
    75: "🌨️❄️Snow fall: Heavy",
    77: "🌨️Snow grains",
    80: "🌦️Rain showers: Slight",
    81: "🌧️Rain showers: Moderate",
    82: "⛈️Rain showers: Violent",
    85: "🌨️Snow showers: Slight",
    86: "🌨️❄️Snow showers: Heavy",
    95: "⛈️Thunderstorm: Slight or moderate",
    96: "⛈️🌨️Thunderstorm with slight hail",
    99: "⛈️❄️Thunderstorm with heavy hail",
  };
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          );
          const data = await res.json();
          if (data && data.current_weather) {
            const cityObj = {
              name: `${lat}°`,
              country: `${lon}°`,
              latitude: lat,
              longitude: lon,
            };
            setSelectedCity(cityObj);
          }
        });
      } else {
        alert("Geolocation not supported.");
      }
    };
    getCurrentLocation();
  }, []);
  useEffect(() => {
    if (!selectedCity) return;

    const fetchForecast = async () => {
      setLoadingForecast(true);
      setForecast(null);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=temperature_2m,weathercode&current_weather=true`,
        );
        const data = await res.json();
        setForecast(data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      } finally {
        setLoadingForecast(false);
      }
    };
    fetchForecast();
  }, [selectedCity]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center text-center mb-4">
        <Col>
          <h1 className="display-4 fw-bold animate__animated animate__fadeInDown">
            🌤Weather Now
          </h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow-lg home-card transition-card">
            <AutoComplete onSelect={handleCityChange} />

            {loadingForecast && (
              <div className="text-center mt-3">
                <Spinner animation="border" size="sm" /> Loading forecast...
              </div>
            )}

            {forecast && selectedCity && (
              <div className="mt-4 weather-info p-3 rounded transition-card">
                <h5 className="fw-bold mb-3">
                  {selectedCity.name}, {selectedCity.country}
                </h5>
                <p className="mb-1">
                  <strong>Temperature:</strong>{" "}
                  {forecast.current_weather.temperature}°C
                </p>
                <p className="mb-1">
                  <strong>Time:</strong>{" "}
                  {new Date(forecast.current_weather.time).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
                <p className="mb-0">
                  <strong>Wind Speed:</strong>{" "}
                  {forecast.current_weather.windspeed} m/s
                </p>
                <p className="mb-0">
                  <strong>Weather:</strong>{" "}
                  {weatherCodes[forecast.current_weather.weathercode]}
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
