import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import { ImageArcGISRest, OSM } from "ol/source";
import { useEffect, useRef } from "react";
import "ol/ol.css";

function MapServerPage() {
  const map_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url =
      "https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/" +
      "USA/MapServer";

    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      new ImageLayer({
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url,
        }),
      }),
    ];
    const map = new Map({
      layers: layers,
      target: "map",
      view: new View({
        center: [-10997148, 4569099],
        zoom: 4,
      }),
    });

    map.setTarget(map_ref.current as HTMLElement);

    return () => {
      map.setTarget('');
    };
  }, []);

  return (
    <>
      <div ref={map_ref} style={{ height: "calc(var(--vh, 1vh) * 100)" }}></div>
    </>
  );
}

export default MapServerPage;
