import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";

import { removeContent } from "../../helpers";

type Scales = {
  x: d3.ScalePoint<string>;
  y: d3.ScaleLinear<number, number>;
};

const MARGIN_TOP = 100;
const MARGIN_LEFT = 700;
const CHART_WIDTH = 400;
const CHART_HEIGHT = 200;

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
    value: 150,
    key: "C",
  },
];

export const Playground: FC = () => {
  const scales: Scales = useMemo(
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
    removeContent("#pg-x-axis", "#pg-y-axis", "#pg-data");
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
        <path
          d="M 10,30
           A 20,20 0,0,1 50,30
           A 20,20 0,0,1 90,30
           Q 90,60 50,90
           Q 10,60 10,30 z"
          fill="orange"
        />
        <rect
          x={50}
          y={200}
          width={100}
          height={150}
          fill="blue"
          stroke="green"
          strokeWidth={10}
        />
        <line
          x1={50}
          y1={400}
          x2={250}
          y2={450}
          stroke="yellow"
          strokeWidth={4}
        />
        <ellipse cx={150} cy={600} rx={100} ry={50} fill="cyan" />
        <image href="logo192.png" x={400} y={50} height={200} width={200} />
        <polygon
          points="500,500 550,425 550,475 600,400"
          fill="none"
          stroke="black"
        />
        <polyline
          points="500,700 550,625 550,675 600,600"
          fill="none"
          stroke="black"
        />
        <text x={800} y={450} fontSize={30}>
          ITERA
        </text>
        <circle cx={800} cy={600} r={50} fill="red"></circle>
        <g transform="translate(1050, 400)">
          <circle cx={0} cy={50} r={20} fill="green"></circle>
          <circle cx={0} cy={150} r={20} fill="green"></circle>
          <circle cx={0} cy={250} r={20} fill="green"></circle>
        </g>
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
