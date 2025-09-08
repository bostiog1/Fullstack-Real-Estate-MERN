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
          <h1 className="title">
            Găsiți proprietăți imobiliare și obțineți locul de vis
          </h1>
          <p>
            Acesta este un site de imobiliare care simplifică procesul de a găsi
            proprietatea perfectă, fie că ești în căutarea unei case sau a unui
            apartament. Navigarea intuitivă,
            filtrele detaliate și fotografiile de înaltă rezoluție te ajută să
            descoperi rapid și ușor locuința la care visezi.
          </p>
          <SearchBar />
          {/* Add a clear call to action to view all properties */}
          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/list"
              className="px-6 py-3 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
            >
              Vezi Toate Proprietățile
            </Link>
          </div>
          <div className="boxes">
            <div className="box">
              <h1>5+</h1>
              <h2>Ani de Experiență</h2>
            </div>
            <div className="box">
              <h1>200+</h1>
              <h2>Proprietăți existente</h2>
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
