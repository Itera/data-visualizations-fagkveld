import React, { FC, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import "d3-scale-chromatic";

import { ChartComponentProps, StackedData } from "../../types";
import { renderAxis, renderGrid, renderStackedBarChart } from "./render-chart";
import { MARGIN } from "../../statics";

const Y_DOMAIN_MULTIPLIER = 1.1;

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
        .range([MARGIN.left, width - MARGIN.right])
        .domain(data.map((d) => d.key + "")),
      y: d3
        .scaleLinear()
        .range([height - MARGIN.bottom, MARGIN.top])
        .domain([
          0,
          Y_DOMAIN_MULTIPLIER *
            // @ts-ignore
            d3.max(data, (d) =>
              Object.entries(d)
                .filter(
                  ([key, value]) => key !== "key" && typeof value === "number"
                )
                .reduce((sum, [, value]) => sum + value, 0)
            ),
        ]),
      color: d3
        .scaleOrdinal(d3.schemePaired)
        .domain(Object.keys(data[0] ?? {}).filter((k) => k !== "key")),
    }),
    [data, width, height]
  );

  /**
   * Initialize and clean up chart
   */
  useEffect(() => {
    const svg = d3
      .select("#stacked-bar-chart-root")
      .attr("width", width)
      .attr("height", height);

    const chartContainer = svg.append("g").attr("id", "chart-container");

    chartContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - MARGIN.bottom})`);

    chartContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${MARGIN.left}, 0)`);

    chartContainer
      .append("g")
      .attr("id", "grid")
      .attr("transform", `translate(${MARGIN.left}, 0)`);

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
    d3.select("#stacked-bar-chart-root")
      .attr("height", height)
      .attr("width", width);

    d3.select("#x-axis").attr(
      "transform",
      `translate(0, ${height - MARGIN.bottom})`
    );

    renderAxis(scales, data, width);
    renderGrid(scales, width);
    renderStackedBarChart(scales, data);

    const endTime = Date.now();
    setDurationOfLastUpdate(endTime - startTime);
  }, [data, scales, height, width]);

  return (
    <>
      <svg id="stacked-bar-chart-root"></svg>
      <div>Duration of last update: {durationOfLastUpdate}</div>
      <div>Number of rects rendered: {getNumberOfRects(data)}</div>
    </>
  );
};

function getNumberOfRects(data: StackedData[]) {
  const numKeys = data.length;
  const numCategories = data[0] ? Object.keys(data[0]).length - 1 : 0;
  return numKeys * numCategories;
}
