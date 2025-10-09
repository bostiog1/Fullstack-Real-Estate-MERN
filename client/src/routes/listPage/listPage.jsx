import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";
import "./listPage.scss";

function ListPage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend
  const fetchPosts = async (queryParams = {}) => {
    console.log("=== FRONTEND DEBUG ===");
    console.log("fetchPosts called with:", queryParams);

    setLoading(true);
    setError(null);

    try {
      // Construiește query string din parametri
      const params = new URLSearchParams();
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] && queryParams[key] !== "") {
          params.append(key, queryParams[key]);
          console.log(`Added param: ${key} = ${queryParams[key]}`);
        }
      });

      const queryString = params.toString();
      console.log("Final query string:", queryString);
      console.log("Full URL:", `/posts?${queryString}`);

      // Folosește ruta existentă de posts cu parametrii de căutare
      const response = await apiRequest.get(`/posts?${queryString}`);

      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Posts received:", response.data.length);

      // Răspunsul este direct array-ul de posts
      setPosts(response.data);
    } catch (err) {
      console.error("API Error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      setError("Nu s-au putut încărca proprietățile.");
    } finally {
      setLoading(false);
      console.log("=== END FRONTEND DEBUG ===");
    }
  };

  // Initial load și când se schimbă URL params
  useEffect(() => {
    console.log("=== USEEFFECT TRIGGERED ===");
    console.log("Current searchParams:", Object.fromEntries(searchParams));

    const query = {
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      property: searchParams.get("property") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedroom: searchParams.get("bedroom") || "",
    };

    console.log("Constructed query object:", query);
    fetchPosts(query);
  }, [searchParams]);

  const handleFilter = (query) => {
    console.log("=== FILTER APPLIED ===");
    console.log("Filter query:", query);
    fetchPosts(query);
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter onFilter={handleFilter} />

          {loading && (
            <div className="loading">
              <p>Se încarcă proprietățile...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>{error}</p>
              <button onClick={() => fetchPosts()}>Încearcă din nou</button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="no-results">
              <h3>Nu s-au găsit proprietăți</h3>
              <p>Încearcă să modifici criteriile de căutare.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="results-count">
                <p>{posts.length} proprietăți găsite</p>
              </div>
              {posts.map((post) => (
                <Card key={post.id} item={post} />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mapContainer">
        {posts.length > 0 ? (
          <Map items={posts} />
        ) : (
          <div className="no-map">
            <p>Harta va fi afișată când vor fi proprietăți de arătat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListPage;
