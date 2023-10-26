import * as d3 from "d3";
import * as topojson from "topojson-client";
import d3Tip from "d3-tip";

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
  const [minEdu, maxEdu] = d3.extent(education, (d) => d.bachelorsOrHigher) as [number, number];
  const color = d3.scaleThreshold(d3.range(minEdu, maxEdu, (maxEdu - minEdu) / 8), d3.schemeBlues[9]);

  const legendX = d3.scaleLinear([minEdu, maxEdu], [0, 300]);
  const legendXAxis = d3
    .axisBottom(legendX)
    .tickSize(16)
    .tickValues(color.domain())
    .tickFormat((d) => d3.format(".0%")((d as number) / 100));

  const tip = d3Tip()
    .attr("class", "flex min-w-[50px] flex-col items-center rounded-md bg-black/80 px-3 py-2 font-semibold text-white")
    .attr("id", "tooltip")
    .html((d: Feature) => {
      const res = education.filter((el) => el.fips === d.id)[0];
      if (!res) return "0";
      const { area_name, state, bachelorsOrHigher } = res;
      return `${area_name}, ${state}: ${bachelorsOrHigher}%`;
    })
    .direction("ne")
    .offset([20, 0]);

  const getPathData = (data: Feature) => {
    const { bachelorsOrHigher } = education.filter((el) => el.fips === data.id)[0];
    return {
      fill: `${color(bachelorsOrHigher ?? 0)}`,
      education: bachelorsOrHigher ?? 0,
    };
  };

  return (
    <div className="w-fit overflow-scroll max-w-full my-4 py-4 self-start lg:self-center">
      <svg
        width={width}
        height={height}
        ref={(el) => {
          if (el) d3.select(el).call(tip);
        }}
      >
        <g className="counties">
          {(topojson.feature(counties, counties.objects.counties) as Features).features.map((d) => {
            const { education, fill } = getPathData(d);
            return (
              <path
                className="county hover:stroke-black"
                data-fips={d.id}
                data-education={education}
                d={path(d)!}
                fill={fill}
                onMouseOver={(e) => {
                  tip.attr("data-education", education).show(d, e.currentTarget);
                }}
                onMouseOut={tip.hide}
              />
            );
          })}
        </g>
        <g
          id="legend"
          transform={`translate(${(width * 3) / 5},24)`}
          ref={(el) => {
            if (el) d3.select(el).call(legendXAxis).select(".domain").remove();
          }}
        >
          <g>
            {color
              .range()
              .map((r) => {
                const [c0, c1] = color.invertExtent(r);
                return [c0 ?? minEdu, c1 ?? maxEdu];
              })
              .map((d) => {
                return (
                  <rect
                    fill={color(d[0])}
                    x={legendX(d[0])}
                    width={legendX(d[1]) - legendX(d[0])}
                    height={16}
                  />
                );
              })}
          </g>
        </g>
      </svg>
    </div>
  );
}
