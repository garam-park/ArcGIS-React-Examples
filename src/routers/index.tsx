import { createHashRouter } from "react-router-dom";
import EmptyLayout from "../layouts/EmptyLayout";
import MapServerPage from "../pages/map-server/MapServerPage";
import TiledMapServerPage from "../pages/map-server/TiledMapServerPage";
import FeatureServerPage from "../pages/feature-server/FeatureServerPage";

const router = createHashRouter([
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
        element: <MapServerPage />,
      },
      {
        path: "tiled",
        id: "map-server-tiled",
        element: <TiledMapServerPage />,
      },
    ],
  },
  {
    path: "/feature-server",
    element: <EmptyLayout />,
    children: [
      {
        path: "",
        id: "feature-server-index",
        element: <FeatureServerPage />,
      },
    ],
  },
]);

export default router;
