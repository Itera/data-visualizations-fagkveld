import React, { FC, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import "d3-scale-chromatic";

import { ChartComponentProps, StackedData } from "../../types";
import { drawAxis, drawGrid, drawStackedBarChart } from "./draw-chart";

export const margin = { top: 40, right: 20, bottom: 40, left: 40 };

const yDomainMultiplier = 1.1;

export type Scales = {
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  color: d3.ScaleOrdinal<string, unknown>;
};

export const StackedBarChart: FC<ChartComponentProps<StackedData[]>> = ({
  data,
  height,
  width,
}) => {
  const [durationOfLastUpdate, setDurationOfLastUpdate] = useState(0);

  const scales = useMemo<Scales>(
    () => ({
      x: d3
        .scaleBand()
        .padding(0.1)
        .range([margin.left, width - margin.right])
        .domain(data.map((d) => d.key + "")),
      y: d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([
          0,
          // @ts-ignore
          d3.max<StackedBarPlotData>(data, (d) => {
            const sumElementValues = Object.entries(d).reduce(
              (sum, [key, val]) => {
                if (key !== "key") {
                  return typeof val === "number" ? sum + val : sum;
                }
                return sum;
              },
              0
            );
            return sumElementValues;
          }) * yDomainMultiplier,
        ]),
      color: d3
        .scaleOrdinal(d3.schemePaired)
        .domain(Object.keys(data[0] ?? {}).filter((k) => k !== "key")),
    }),
    [data, width, height]
  );
  // @ts-ignore
  window.scales = scales;

  /**
   * Initialize and clean up chart
   */
  useEffect(() => {
    const svg = d3
      .select("#chart-root")
      .attr("width", width)
      .attr("height", height);

    const chartContainer = svg.append("g").attr("id", "chart-container");

    chartContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`);

    chartContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`);

    chartContainer
      .append("g")
      .attr("id", "grid")
      .attr("transform", `translate(${margin.left}, 0)`);

    chartContainer.append("g").attr("id", "data-container");

    svg.call(
      // @ts-ignore
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([1, 8])
        // eslint-disable-next-line
        .on("zoom", function zoomHandler(e: any) {
          chartContainer.attr("transform", e.transform);
        })
    );

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("opacity", 0);

    return () => {
      svg.selectAll("*").remove();
      tooltip.remove();
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Update chart
   */
  useEffect(() => {
    const startTime = Date.now();
    d3.select("#chart-root").attr("height", height).attr("width", width);

    d3.select("#x-axis").attr(
      "transform",
      `translate(0, ${height - margin.bottom})`
    );

    drawAxis(scales, data, width);
    drawGrid(scales, width);
    drawStackedBarChart(scales, data);

    const endTime = Date.now();
    setDurationOfLastUpdate(endTime - startTime);
  }, [data, scales, height, width]);

  return (
    <>
      <svg id="chart-root"></svg>
      <div>Duration of last update: {durationOfLastUpdate}</div>
      <div>Number of rects drawn: {getNumberOfRects(data)}</div>
    </>
  );
};

function getNumberOfRects(data: StackedData[]) {
  const nrOfKeys = data.length ?? 0;
  const nrOfCategories = data[0] ? Object.keys(data[0]).length - 1 : 0;
  return nrOfKeys * nrOfCategories;
}
