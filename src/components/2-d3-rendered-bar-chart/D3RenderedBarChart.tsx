/**
 * In this example we use d3 to render the bar chart...
 */

import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { getTickValues } from "../../helpers";
import { ChartComponentProps, PointData } from "../../types";
import { COLORS, INVISIBLE_VALUE, MARGIN } from "../../constants";

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
        .range([MARGIN.left, width - MARGIN.right])
        .domain(data.map((d) => String(d.key))),
      y: d3
        .scaleLinear()
        .range([height - MARGIN.bottom, MARGIN.top])
        .domain(d3.extent(data, (d) => d.value) as [number, number]),
    }),
    [width, height, data]
  );

  useEffect(() => {
    renderAxis(scales, data, height, width);
    renderData(scales, data, height);
  }, [scales, height, width, data]);

  return (
    <svg width={width} height={height}>
      <g id="data-container"></g>
      <g id="x-axis-container"></g>
      <g id="y-axis-container"></g>
    </svg>
  );
};

function renderAxis(
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
      width - MARGIN.left - MARGIN.right,
      25
    )
  );
  const yAxis = d3.axisLeft(scales.y);

  xAxisContainer
    .call(xAxis as any)
    .attr("transform", `translate(0, ${height - MARGIN.bottom})`);

  yAxisContainer
    .call(yAxis as any)
    .attr("transform", `translate(${MARGIN.left}, 0)`);
}

function renderData(scales: Scales, data: PointData[], height: number) {
  const dataContainer = d3.select("#data-container");

  dataContainer
    .selectAll("rect")
    .data(data, (d) => (d as PointData).key)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => scales.x(String(d.key)) ?? INVISIBLE_VALUE)
          .attr("y", (d) => scales.y(d.value) as number)
          .attr("width", scales.x.bandwidth())
          .attr(
            "height",
            (d) => height - MARGIN.bottom - (scales.y(d.value) as number)
          )
          .attr("fill", COLORS.BLUE),
      (update) =>
        update
          .attr("x", (d) => scales.x(String(d.key)) ?? INVISIBLE_VALUE)
          .attr("y", (d) => scales.y(d.value) as number)
          .attr("width", scales.x.bandwidth())
          .attr(
            "height",
            (d) => height - MARGIN.bottom - (scales.y(d.value) as number)
          ),
      (exit) => exit.remove()
    );
}
