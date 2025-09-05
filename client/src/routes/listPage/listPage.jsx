// import "./listPage.scss";
// import Filter from "../../components/filter/Filter";
// import Card from "../../components/card/Card";
// import Map from "../../components/map/Map";
// import { Await, useLoaderData } from "react-router-dom";
// import { Suspense } from "react";

// function ListPage() {
//   const data = useLoaderData();

//   return (
//     <div className="listPage">
//       <div className="listContainer">
//         <div className="wrapper">
//           <Filter />
//           <Suspense fallback={<p>Loading...</p>}>
//             <Await
//               resolve={data.postResponse}
//               errorElement={<p>Error loading posts!</p>}
//             >
//               {(postResponse) =>
//                 postResponse.data.map((post) => (
//                   <Card key={post.id} item={post} />
//                 ))
//               }
//             </Await>
//           </Suspense>
//         </div>
//       </div>
//       <div className="mapContainer">
//         <Suspense fallback={<p>Loading...</p>}>
//           <Await
//             resolve={data.postResponse}
//             errorElement={<p>Error loading posts!</p>}
//           >
//             {(postResponse) => <Map items={postResponse.data} />}
//           </Await>
//         </Suspense>
//       </div>
//     </div>
//   );
// }

// export default ListPage;

// import "./listPage.scss";
// import Filter from "../../components/filter/Filter";
// import Card from "../../components/card/Card";
// import Map from "../../components/map/Map";
// import { Await, useLoaderData } from "react-router-dom";
// import { Suspense } from "react";
// import { listData } from "../../lib/dummydata";

// function ListPage() {
//   // We are using the dummy data directly for now,
//   // so we'll comment out the useLoaderData hook.
//   // const data = useLoaderData();

//   const data = listData;

//   // The previous compilation error indicates an issue with resolving file paths.
//   // Please double-check that the files listed below exist in the exact paths specified:
//   // - src/routes/listPage/listPage.scss
//   // - src/components/filter/Filter
//   // - src/components/card/Card
//   // - src/components/map/Map
//   // - src/lib/dummydata
//   // The code itself is now configured to use the dummy data directly.

//   return (
//     <div className="listPage">
//       <div className="listContainer">
//         <div className="wrapper">
//           <Filter />
//           {/*
//             We don't need Await and Suspense for static dummy data.
//             We can directly map over the data.
//           */}
//           {data.map((post) => (
//             <Card key={post.id} item={post} />
//           ))}
//         </div>
//       </div>
//       <div className="mapContainer">
//         {/* We also pass the dummy data directly to the Map component. */}
//         <Map items={data} />
//       </div>
//     </div>
//   );
// }

// export default ListPage;

import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { useState } from "react";
import { listData } from "../../lib/dummydata";

function ListPage() {
  const [filteredData, setFilteredData] = useState(listData);

  const handleFilter = (query) => {
    let filtered = listData.filter((post) => {
      // Filter by type
      if (query.type && post.type !== query.type) {
        return false;
      }
      // Filter by property type
      if (query.property && post.property !== query.property) {
        return false;
      }
      // Filter by minPrice
      if (query.minPrice && post.price < parseInt(query.minPrice)) {
        return false;
      }
      // Filter by maxPrice
      if (query.maxPrice && post.price > parseInt(query.maxPrice)) {
        return false;
      }
      // Filter by bedroom count
      if (query.bedroom && post.bedroom < parseInt(query.bedroom)) {
        return false;
      }
      // Filter by city
      if (query.city) {
        // Simple case-insensitive check for city
        const postCity = post.address.split(",")[1]?.trim().toLowerCase();
        const queryCity = query.city.toLowerCase();
        if (postCity !== queryCity) {
          return false;
        }
      }
      return true;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter onFilter={handleFilter} />
          {filteredData.map((post) => (
            <Card key={post.id} item={post} />
          ))}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={filteredData} />
      </div>
    </div>
  );
}

export default ListPage;
