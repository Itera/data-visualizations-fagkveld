import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { removeContent } from "../../helpers";
import { ChartComponentProps, PointData } from "../../types";
import { COLORS, MARGIN } from "../../constants";

type Scales = {
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
};

export const LineChart: FC<ChartComponentProps<PointData<Date>[]>> = ({
  data,
  height,
  width,
}) => {
  const scales = useMemo(
    () => ({
      x: d3
        .scaleTime()
        .range([MARGIN.left, width - MARGIN.right])
        .domain(d3.extent(data, (d) => d.key) as [Date, Date]),
      y: d3
        .scaleLinear()
        .range([height - MARGIN.bottom, MARGIN.top])
        .domain(d3.extent(data, (d) => d.value) as [number, number]),
    }),
    [width, height, data]
  );

  useEffect(() => {
    removeContent("#data-container");
    renderAxis(scales, height);
    renderData(scales, data, height);
  }, [scales, height, width, data]);

  return (
    <svg id="chart-root" width={width} height={height}>
      <g id="data-container"></g>
      <g id="x-axis-container"></g>
      <g id="y-axis-container"></g>
    </svg>
  );
};

function renderAxis(scales: Scales, height: number) {
  const xAxisContainer = d3.select("#x-axis-container");
  const yAxisContainer = d3.select("#y-axis-container");

  const xAxis = d3.axisBottom(scales.x);
  const yAxis = d3.axisLeft(scales.y);

  xAxisContainer
    .call(xAxis as any)
    .attr("transform", `translate(0, ${height - MARGIN.bottom})`);

  yAxisContainer
    .call(yAxis as any)
    .attr("transform", `translate(${MARGIN.left}, 0)`);
}

function renderData(scales: Scales, data: PointData<Date>[], height: number) {
  const dataContainer = d3.select("#data-container");

  const line = d3
    .line()
    .x((d) => scales.x((d as any).key) as number)
    .y((d) => scales.y((d as any).value) as number)
    .curve(d3.curveCardinal);

  dataContainer
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line as any)
    .attr("fill", "none")
    .attr("stroke", COLORS.LAVENDER)
    .attr("stroke-width", "3");

  dataContainer
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => scales.x(d.key) as number)
    .attr("cy", (d) => scales.y(d.value) as number)
    .attr("fill", COLORS.PURPLE)
    .attr("r", 3);
}
