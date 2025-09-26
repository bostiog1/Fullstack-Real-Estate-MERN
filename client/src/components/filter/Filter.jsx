import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";


function Filter({ onFilter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };


  const handleFilter = () => {
    onFilter(query);
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Cauta rezultate pentru <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Locația</label>
          <div className="city-input-container">
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Orașul căutat"
              onChange={handleChange}
              value={query.city}
            />
            {/* Șterge blocul de cod pentru afișarea sugestiilor: */}
            {/* {citySuggestions.length > 0 && (
              <ul className="suggestions-list">
                {citySuggestions.map((city) => (
                  <li key={city} onClick={() => handleSelectCity(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Tip</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">Orice</option>
            <option value="cumpara">Cumpără</option>
            <option value="inchiriaza">Închiriază</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Proprietate</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">Orice</option>
            <option value="apartment">Apartament</option>
            <option value="house">Casă</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Preț Minim</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Orice"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Preț Maxim</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Orice"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Camere</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Orice"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
