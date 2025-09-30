
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./searchBar.scss";

const types = ["cumpara", "inchiriaza"];

const SearchBar = () => {
  const [query, setQuery] = useState({
    type: "cumpara",
    city: "",
    minPrice: "", // Schimbat din 0 în ""
    maxPrice: "", // Schimbat din 0 în ""
  });

  const [citySuggestions, setCitySuggestions] = useState([]);

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));

    if (name === "city" && value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${value},+Romania&format=json&addressdetails=1`
        );
        const data = await response.json();
        const suggestions = data.map((item) =>
          item.display_name.split(",")[0].trim()
        );
        const uniqueSuggestions = [...new Set(suggestions)];
        setCitySuggestions(uniqueSuggestions);
      } catch (error) {
        console.error("Failed to fetch location suggestions:", error);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const handleSelectCity = (cityName) => {
    setQuery((prev) => ({ ...prev, city: cityName }));
    setCitySuggestions([]);
  };

  // Funcție pentru a construi URL-ul corect
  const buildSearchUrl = () => {
    const params = new URLSearchParams();

    // Adaugă doar parametrii care au valori semnificative
    if (query.type) params.set("type", query.type);
    if (query.city) params.set("city", query.city);
    if (
      query.minPrice &&
      query.minPrice !== "" &&
      parseInt(query.minPrice) > 0
    ) {
      params.set("minPrice", query.minPrice);
    }
    if (
      query.maxPrice &&
      query.maxPrice !== "" &&
      parseInt(query.maxPrice) > 0
    ) {
      params.set("maxPrice", query.maxPrice);
    }

    return `/list?${params.toString()}`;
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            name="city"
            placeholder="Oraș"
            onChange={handleChange}
            value={query.city}
          />
          {citySuggestions.length > 0 && (
            <ul className="suggestions-list">
              {citySuggestions.map((city) => (
                <li key={city} onClick={() => handleSelectCity(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Preț Minim"
          onChange={handleChange}
          value={query.minPrice}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Preț Maxim"
          onChange={handleChange}
          value={query.maxPrice}
        />
        <Link to={buildSearchUrl()}>
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
};

export default SearchBar;
