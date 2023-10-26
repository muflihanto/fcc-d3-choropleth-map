import * as d3 from "d3";
import * as topojson from "topojson-client";
// import { useEffect, useRef } from "preact/hooks";

import _counties from "./data/counties.json";
import education from "./data/for_user_education.json";

const counties = _counties as unknown as TopoJSON.Topology;

interface ChoroParams {
  width?: number;
  height?: number;
  margin?: Margin;
}
interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
type Features = GeoJSON.FeatureCollection;
type Feature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

export default function ChoroMap({ width = 960, height = 600 }: ChoroParams) {
  const path = d3.geoPath();
  const color = d3.scaleThreshold(d3.range(2.6, 75.1, (75.1 - 2.6) / 8), d3.schemeGreens[9]);

  const getDataEducation = (data: Feature) => {
    const res = education.filter((el) => el.fips === data.id)[0];
    if (res) return res.bachelorsOrHigher;
    return 0;
  };

  const getFill = (data: Feature) => {
    const res = education.filter((el) => el.fips === data.id)[0];
    if (res) return `${color(res.bachelorsOrHigher)}`;
    return `${color(0)}`;
  };

  return (
    <svg
      width={width}
      height={height}
      className="mt-4"
    >
      <g className="counties">
        {(topojson.feature(counties, counties.objects.counties) as Features).features.map((d) => {
          return (
            <path
              className="county"
              data-fips={d.id}
              data-education={getDataEducation(d)}
              d={path(d)!}
              fill={getFill(d)}
            />
          );
        })}
      </g>
    </svg>
  );
}
