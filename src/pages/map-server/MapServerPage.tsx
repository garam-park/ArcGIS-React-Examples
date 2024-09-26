import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import { ImageArcGISRest, OSM } from "ol/source";
import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import ServiceSelector from "./components/ServiceSelector";
import map_services from "./map_services";

const base_url = "https://sampleserver6.arcgisonline.com/ArcGIS/rest/services";
function MapServerPage() {
  const [service, setService] = useState(map_services[2].service);
  const map_ref = useRef<HTMLDivElement>(null);
  const service_layers = useRef<ImageLayer<ImageArcGISRest>[]>([]);

  useEffect(() => {
    service_layers.current.forEach((layer) => {
      if (layer.get("id") === service) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    });
  }, [service]);

  useEffect(() => {
    map_services.forEach((s) => {
      const url = `${base_url}/${s.service}`;
      const img_layer = new ImageLayer({
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url,
        }),
        properties: {
          id: s.service, // Add an id property to distinguish layers
        },
      });
      img_layer.setVisible(s.service === service);
      service_layers.current.push(img_layer);
    });

    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      ...service_layers.current,
    ];

    const map = new Map({
      layers: layers,
      target: "map",
      view: new View({
        center: [14135300.5, 4510000.5], // Coordinates centered on South Korea in EPSG:3857
        zoom: 6, // Adjusted zoom level for better view
      }),
    });

    map.setTarget(map_ref.current as HTMLElement);

    return () => {
      map.setTarget("");
    };
  }, []);

  return (
    <>
      <div ref={map_ref} style={{ height: "calc(var(--vh, 1vh) * 100)" }}></div>
      <ServiceSelector
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          paddingTop: 4,
          paddingRight: 4,
          minWidth: 200,
        }}
        services={map_services}
        service={service}
        setService={setService}
      />
    </>
  );
}

export default MapServerPage;
