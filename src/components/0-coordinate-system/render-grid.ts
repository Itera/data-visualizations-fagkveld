import * as d3 from "d3";

import { MARGIN } from "../../constants";

type Scales = {
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
};

/**
 * Render or update x and y axis. If updating, the update is animated.
 */
export function renderAxis(scales: Scales, height: number): void {
  const xAxis = d3.select("#x-axis-container");
  const yAxis = d3.select("#y-axis-container");

  xAxis
    .call(d3.axisTop(scales.x) as any)
    .attr("transform", `translate(0, ${MARGIN.top})`);

  yAxis
    .call(d3.axisLeft(scales.y) as any)
    .attr("transform", `translate(${MARGIN.left}, 0)`);
}

/**
 * Render or update y axis grid lines. If updating, the update is animated.
 */
export function renderGrid(
  scales: Scales,
  height: number,
  width: number
): void {
  const xGrid = d3.select("#x-grid-container");
  const yGrid = d3.select("#y-grid-container");

  const lengthOfVerticalGridLines = height - MARGIN.top - MARGIN.bottom;
  const lengthOfHorizontalGridLines = -(width - MARGIN.left - MARGIN.right);

  xGrid
    .call(
      d3
        .axisTop(scales.x)
        .tickSize(lengthOfVerticalGridLines)
        .tickSizeOuter(0)
        .tickFormat(() => "") as any
    )
    .attr("transform", `translate(0, ${height - MARGIN.bottom})`)
    .attr("opacity", 0.2);

  yGrid
    .call(
      d3
        .axisLeft(scales.y)
        .tickSize(lengthOfHorizontalGridLines)
        .tickSizeOuter(0)
        .tickFormat(() => "") as any
    )
    .attr("transform", `translate(${MARGIN.left}, 0)`)
    .attr("opacity", 0.2);
}
