import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { ChartComponentProps, PointData } from "../../types";
import { removeContent } from "../../helpers";

type Scales = {
  color: d3.ScaleOrdinal<string, unknown>;
};

export const PieChart: FC<ChartComponentProps<PointData[]>> = ({
  data,
  height,
  width,
}) => {
  const scales = useMemo(
    () => ({
      color: d3
        .scaleOrdinal(d3.schemePaired)
        .range(
          d3
            .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse()
        )
        .domain(data.map((d) => d.key + "-" + d.category)),
    }),
    [data]
  );

  useEffect(() => {
    removeContent("#data-container");
    renderData(scales, data, height, width);
  }, [scales, height, width, data]);

  return (
    <svg id="chart-root" width={width} height={height}>
      <g id="data-container"></g>
      <g id="x-axis-container"></g>
      <g id="y-axis-container"></g>
    </svg>
  );
};

function renderData(
  scales: Scales,
  data: PointData[],
  height: number,
  width: number
) {
  const dataContainer = d3
    .select("#data-container")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pieGenerator = d3
    .pie()
    .sort(null)
    .value((d) => ((d as unknown) as PointData).value);

  const pieArcData = pieGenerator(data as any) as any;

  const arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1);

  dataContainer
    .append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(pieArcData)
    .join("path")
    .attr("fill", (d: any) => scales.color(d.data.key) as any)
    .attr("d", arcGenerator as any)
    .append("title")
    .text((d: any) => `${d.data.key}: ${d.data.value.toLocaleString()}`);

  const radius = (Math.min(width, height) / 2) * 0.8;
  const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

  dataContainer
    .append("g")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pieArcData)
    .join("text")
    .attr("transform", (d: any) => `translate(${arcLabel.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", -8)
        .attr("font-weight", "bold")
        .text((d: any) => d.data.key)
    )
    .call((text) =>
      text
        .filter((d: any) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", 10)
        .attr("fill-opacity", 0.7)
        .text((d: any) => d.data.value.toLocaleString())
    );
}
