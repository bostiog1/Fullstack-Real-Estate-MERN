// import { useState } from "react";
// import "./searchBar.scss";
// import { Link } from "react-router-dom";

// const types = ["buy", "rent"];

// function SearchBar() {
//   const [query, setQuery] = useState({
//     type: "buy",
//     city: "",
//     minPrice: 0,
//     maxPrice: 0,
//   });

//   const switchType = (val) => {
//     setQuery((prev) => ({ ...prev, type: val }));
//   };

//   const handleChange = (e) => {
//     setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   return (
//     <div className="searchBar">
//       <div className="type">
//         {types.map((type) => (
//           <button
//             key={type}
//             onClick={() => switchType(type)}
//             className={query.type === type ? "active" : ""}
//           >
//             {type}
//           </button>
//         ))}
//       </div>
//       <form>
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="minPrice"
//           min={0}
//           max={10000000}
//           placeholder="Min Price"
//           onChange={handleChange}
//         />
//         <input
//           type="number"
//           name="maxPrice"
//           min={0}
//           max={10000000}
//           placeholder="Max Price"
//           onChange={handleChange}
//         />
//         <Link
//           to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
//         >
//           <button>
//             <img src="/search.png" alt="" />
//           </button>
//         </Link>
//       </form>
//     </div>
//   );
// }

// export default SearchBar;


import React, { useState } from "react";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

const SearchBar = () => {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <style>
        {`
          .searchBar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }

          .searchBar .type {
            display: flex;
            background: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 1rem;
          }

          .searchBar .type button {
            padding: 0.75rem 1.5rem;
            border: none;
            cursor: pointer;
            background: #f0f0f0;
            color: #333;
            transition: all 0.3s;
          }

          .searchBar .type button.active {
            background: #fece51;
            color: white;
            font-weight: bold;
          }

          .searchBar form {
            flex: 1;
            display: flex;
            gap: 1rem;
            align-items: center;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .searchBar form input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
          }

          .searchBar form button {
            width: 50px;
            height: 50px;
            border: none;
            background: #fece51;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
          }

          .searchBar form button:hover {
            opacity: 0.9;
            transform: scale(1.05);
          }

          .searchBar form button img {
            width: 20px;
            height: 20px;
          }
        `}
      </style>
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
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
            type="number"
            name="minPrice"
            min={0}
            max={10000000}
            placeholder="Min Price"
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
            max={10000000}
            placeholder="Max Price"
            onChange={handleChange}
          />
          <Link
            to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          >
            <button>
              <img src="/search.png" alt="" />
            </button>
          </Link>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
