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

import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { listData } from "../../lib/dummydata";

function ListPage() {
  // We are using the dummy data directly for now,
  // so we'll comment out the useLoaderData hook.
  // const data = useLoaderData();

  const data = listData;

  // The previous compilation error indicates an issue with resolving file paths.
  // Please double-check that the files listed below exist in the exact paths specified:
  // - src/routes/listPage/listPage.scss
  // - src/components/filter/Filter
  // - src/components/card/Card
  // - src/components/map/Map
  // - src/lib/dummydata
  // The code itself is now configured to use the dummy data directly.

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {/*
            We don't need Await and Suspense for static dummy data.
            We can directly map over the data.
          */}
          {data.map((post) => (
            <Card key={post.id} item={post} />
          ))}
        </div>
      </div>
      <div className="mapContainer">
        {/* We also pass the dummy data directly to the Map component. */}
        <Map items={data} />
      </div>
    </div>
  );
}

export default ListPage;
