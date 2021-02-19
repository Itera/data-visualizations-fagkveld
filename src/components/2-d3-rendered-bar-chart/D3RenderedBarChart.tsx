/**
 * In this example we use d3 to render the bar chart...
 */

import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { getTickValues } from "../../helpers";
import { ChartComponentProps, PointData } from "../../types";
import { colors, INVISIBLE_VALUE } from "../../statics";

const margin = { top: 40, right: 20, bottom: 40, left: 40 };

type Scales = {
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export const D3RenderedBarChart: FC<ChartComponentProps<PointData[]>> = ({
  data,
  height,
  width,
}) => {
  const scales = useMemo(
    () => ({
      x: d3
        .scaleBand()
        .padding(0.1) // equivalent to .paddingInner(0.1).paddingOuter(0.1)
        .range([margin.left, width - margin.right])
        .domain(data.map((d) => d.key + "")),
      y: d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain(d3.extent(data, (d) => d.value) as [number, number]),
    }),
    [width, height, data]
  );

  useEffect(() => {
    drawAxis(scales, data, height, width);
    drawData(scales, data, height);
  }, [scales, height, width, data]);

  return (
    <svg width={width} height={height}>
      <g id="data-container"></g>
      <g>
        <g id="x-axis-container"></g>
        <g id="y-axis-container"></g>
      </g>
    </svg>
  );
};

function drawAxis(
  scales: Scales,
  data: PointData[],
  height: number,
  width: number
) {
  const xAxisContainer = d3.select("#x-axis-container");
  const yAxisContainer = d3.select("#y-axis-container");

  const xAxis = d3.axisBottom(scales.x).tickValues(
    getTickValues(
      data.map((d) => d.key as string),
      width - margin.left - margin.right,
      25
    )
  );
  const yAxis = d3.axisLeft(scales.y);

  xAxisContainer
    .call(xAxis as any) // eslint-disable-line
    .attr("transform", `translate(0, ${height - margin.bottom})`);

  yAxisContainer
    .call(yAxis as any) // eslint-disable-line
    .attr("transform", `translate(${margin.left}, 0)`);
}

function drawData(scales: Scales, data: PointData[], height: number) {
  const dataContainer = d3.select("#data-container");

  dataContainer
    .selectAll("rect")
    .data(data, (d) => (d as PointData).key)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => scales.x(d.key + "") ?? INVISIBLE_VALUE)
          .attr("y", (d) => scales.y(d.value) as number)
          .attr("width", scales.x.bandwidth())
          .attr(
            "height",
            (d) => height - margin.bottom - (scales.y(d.value) as number)
          )
          .attr("fill", colors.blue),
      (update) =>
        update
          .attr("x", (d) => scales.x(d.key + "") ?? INVISIBLE_VALUE)
          .attr("y", (d) => scales.y(d.value) as number)
          .attr("width", scales.x.bandwidth())
          .attr(
            "height",
            (d) => height - margin.bottom - (scales.y(d.value) as number)
          ),
      (exit) => exit.remove()
    );
}
