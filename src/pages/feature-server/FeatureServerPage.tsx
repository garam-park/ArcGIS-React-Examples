import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useEffect, useRef } from "react";
import "ol/ol.css";
import VectorSource from "ol/source/Vector";
import EsriJSON from 'ol/format/EsriJSON.js';
import {tile as tileStrategy} from 'ol/loadingstrategy.js';
import {createXYZ} from 'ol/tilegrid.js';
import VectorLayer from "ol/layer/Vector";

function FeatureServerPage() {
  const map_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const serviceUrl = 'https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/National_Trust_Climate_Hazards/FeatureServer/1'

    const vectorSource = new VectorSource({
        format: new EsriJSON(),
        url: function (extent, resolution, projection) {
        // ArcGIS Server only wants the numeric portion of the projection ID.
        const srid = projection
            .getCode()
            .split(/:(?=\d+$)/)
            .pop();
    
        const url =
            serviceUrl +
            // 1+// 0 +// layer +
            '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
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
                '}}',
            ) +
            '&geometryType=esriGeometryEnvelope&inSR=' +
            srid +
            '&outFields=*' +
            '&outSR=' +
            srid;
    
        return url;
        },
        strategy: tileStrategy(
        createXYZ({
            tileSize: 512,
        }),
        ),
        attributions:
        'University of Leicester (commissioned by the ' +
        '<a href="https://www.arcgis.com/home/item.html?id=' +
        'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
    });
    
    const vector = new VectorLayer({
        source: vectorSource,
        opacity: 0.7,
    });
    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      vector,
    ];

    const map = new Map({
      layers: layers,
      target: "map",
      view: new View({
        center: [-355000, 6700000], // Coordinates centered on the United Kingdom
        zoom: 6, // Adjusted zoom level for better view
      }),
    });

    map.setTarget(map_ref.current as HTMLElement);

    return () => {
      map.setTarget('');
    };
  }, []);

  return (
    <>
      <div ref={map_ref} style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
      </div>
    </>
  );
}

export default FeatureServerPage;
