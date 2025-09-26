import { useState } from "react";

const AutoComplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5`,
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Error fetching city list:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (city) => {
    setQuery(`${city.name}, ${city.country}`);
    setSuggestions([]);
    if (onSelect) onSelect(city);
  };

  return (
    <div className="w-100 mt-4 position-relative">
      <input
        type="text"
        className="form-control"
        placeholder="Search city..."
        value={query}
        onChange={handleChange}
      />

      {loading && <div className="text-muted small mt-1">Loading...</div>}

      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow mt-1">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(city)}
              style={{ cursor: "pointer" }}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
