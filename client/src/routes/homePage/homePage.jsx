// import { useContext } from "react";
// import SearchBar from "../../components/searchBar/SearchBar";
// import "./homePage.scss";
// import { AuthContext } from "../../context/AuthContext";

// function HomePage() {

//   const {currentUser} = useContext(AuthContext)

//   return (
//     <div className="homePage">
//       <div className="textContainer">
//         <div className="wrapper">
//           <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
//             explicabo suscipit cum eius, iure est nulla animi consequatur
//             facilis id pariatur fugit quos laudantium temporibus dolor ea
//             repellat provident impedit!
//           </p>
//           <SearchBar />
//           <div className="boxes">
//             <div className="box">
//               <h1>16+</h1>
//               <h2>Years of Experience</h2>
//             </div>
//             <div className="box">
//               <h1>200</h1>
//               <h2>Award Gained</h2>
//             </div>
//             <div className="box">
//               <h1>2000+</h1>
//               <h2>Property Ready</h2>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="imgContainer">
//         <img src="/bg.png" alt="" />
//       </div>
//     </div>
//   );
// }

// export default HomePage;

import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>
          <SearchBar />
          {/* Add a clear call to action to view all properties */}
          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/list"
              className="px-6 py-3 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
            >
              View All Properties
            </Link>
          </div>
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
