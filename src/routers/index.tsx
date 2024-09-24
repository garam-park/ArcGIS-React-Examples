import { createBrowserRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MapServerPage from "../pages/map-server/MapServerPage";
import TiledMapServerPage from "../pages/map-server/TiledMapServerPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <EmptyLayout />,
    children: [
      {
        path: "/",
        id: "index",
        element: <h1>Hello world</h1>,
      },
    ],
  },
  {
    path: "/map-server",
    element: <EmptyLayout />,
    children: [
      {
        path: "",
        id: "map-server-index",
        element: <MapServerPage/>,
      },
      {
        path: "tiled",
        id: "map-server-tiled",
        element: <TiledMapServerPage/>,
      },
    ]
  },
]);

export default router;