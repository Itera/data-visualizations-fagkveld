import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";

import { removeContent } from "../../helpers";

type Scales = {
  x: d3.ScalePoint<string>;
  y: d3.ScaleLinear<number, number>;
};

const MARGIN_TOP = 100;
const MARGIN_LEFT = 100;
const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;

const data = [
  {
    value: 200,
    key: "A",
  },
  {
    value: 100,
    key: "B",
  },
  {
    value: 400,
    key: "C",
  },
];

export const Playground: FC = () => {
  const scales = useMemo(
    () => ({
      x: d3
        .scalePoint()
        .padding(0.2)
        .range([MARGIN_LEFT, CHART_WIDTH + MARGIN_LEFT])
        .domain(data.map((d) => d.key)),
      y: d3
        .scaleLinear()
        .range([CHART_HEIGHT + MARGIN_TOP, MARGIN_TOP])
        .domain([0, CHART_HEIGHT]), // [0, d3.max(data.map((d) => d.value))] as [number, number] -> use to make scales adjust dynamically to changes in the data
    }),
    []
  );

  useEffect(() => {
    removeContent("#pg-data");
    renderAxis(scales);
    renderData(scales, data);
  }, [scales]);

  return (
    <>
      {/* Experiment with rendering axis and data with D3 */}
      <g id="pg-x-axis"></g>
      <g id="pg-y-axis"></g>
      <g id="pg-data"></g>
      <g>
        {/* 
          Experiment with different SVG elements. Update position, dimentions, fill, stroke etc. 
        */}
        <circle cx={900} cy={300} r={50} fill="red"></circle>
        <rect
          x={350}
          y={100}
          width={100}
          height={150}
          fill="blue"
          stroke="green"
          strokeWidth={10}
        />
        <line
          x1={200}
          y1={300}
          x2={700}
          y2={450}
          stroke="yellow"
          strokeWidth={4}
        />
      </g>
    </>
  );
};

/**
 * Render or update x and y axis. If updating, the update is animated.
 */
function renderAxis(scales: Scales): void {
  const xAxis = d3.select("#pg-x-axis");
  const yAxis = d3.select("#pg-y-axis");

  xAxis
    .call(d3.axisBottom(scales.x) as any)
    .attr("transform", `translate(0, ${CHART_HEIGHT + MARGIN_TOP})`);

  yAxis
    .call(d3.axisLeft(scales.y) as any)
    .attr("transform", `translate(${MARGIN_LEFT}, 0)`);
}

function renderData(scales: Scales, data: { value: number; key: string }[]) {
  const dataContainer = d3.select("#pg-data");
  dataContainer
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => scales.x(d.key) as number)
    .attr("cy", (d) => scales.y(d.value) as number)
    .attr("r", 10)
    .attr("fill", "purple");
}
