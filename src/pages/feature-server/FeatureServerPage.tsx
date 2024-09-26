import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON.js";
import { tile as tileStrategy } from "ol/loadingstrategy.js";
import { createXYZ } from "ol/tilegrid.js";
import VectorLayer from "ol/layer/Vector";
import ServiceSelector from "./components/ServiceSelector";
import feature_services from "./feature_services";

function FeatureServerPage() {
  const [service, setService] = useState(feature_services[1].service);

  const map_ref = useRef<HTMLDivElement>(null);
  const service_layers = useRef<VectorLayer<VectorSource>[]>([]);

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
    const base_url = `https://fgisn.forest.go.kr/arcgis/rest/services/${service}`;

    feature_services.forEach((s) => {
      const vectorSource = new VectorSource({
        format: new EsriJSON(),
        url: function (extent, projection) {
          console.log(projection);

          // ArcGIS Server only wants the numeric portion of the projection ID.
          // const srid = projection
          //   .getCode()
          //   .split(/:(?=\d+$)/)
          //   .pop();
          const srid = 3857;

          const url =
            `${base_url}/${s.service}` +
            // 1+// 0 +// layer +
            "/query/?f=json&" +
            "returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" +
            encodeURIComponent(
              '{"xmin":' +
                extent[0] +
                ',"ymin":' +
                extent[1] +
                ',"xmax":' +
                extent[2] +
                ',"ymax":' +
                extent[3] +
                ',"spatialReference":{"wkid":' +
                srid +
                "}}"
            ) +
            "&geometryType=esriGeometryEnvelope&inSR=" +
            srid +
            "&outFields=*" +
            "&outSR=" +
            srid;

          return url;
        },
        strategy: tileStrategy(
          createXYZ({
            tileSize: 512,
          })
        ),

        attributions:
          "University of Leicester (commissioned by the " +
          '<a href="https://www.arcgis.com/home/item.html?id=' +
          'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
      });

      service_layers.current.push(
        new VectorLayer({
          source: vectorSource,
          properties: {
            id: s.service, // Add an id property to distinguish layers
          },
          opacity: 0.7,
        })
      );
    });

    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      ...service_layers.current,
    ];

    const map = new Map({
      layers: layers,
      target: map_ref.current as HTMLElement,
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
        services={feature_services}
        service={service}
        setService={setService}
      />
    </>
  );
}

export default FeatureServerPage;
