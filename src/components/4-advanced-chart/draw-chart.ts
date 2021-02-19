import * as d3 from "d3";

import { getTickValues } from "../../helpers";
import { addTooltip } from "./tooltip";

import { Scales, margin } from "./StackedBarChart";
import { StackedData } from "../../types";

const transitionDuration = 250;

/**
 * Draw or update x and y axis. If updating, the update is animated.
 */
export function drawAxis(
  scales: Scales,
  data: StackedData[],
  width: number
): void {
  const xAxis = d3.select("#x-axis");
  const yAxis = d3.select("#y-axis");

  const xAxisTickValues = getTickValues(
    data.map((d) => d.key),
    width - margin.left - margin.right,
    20
  );

  xAxis.transition().call(
    d3.axisBottom(scales.x).tickValues(xAxisTickValues as any) as any // eslint-disable-line
  );

  yAxis.transition().call(d3.axisLeft(scales.y) as any); // eslint-disable-line
}

/**
 * Draw or update y axis grid lines. If updating, the update is animated.
 */
export function drawGrid(scales: Scales, width: number): void {
  const grid = d3.select("#grid");
  const lengthOfGridLines = -(width - margin.left - margin.right);

  grid.transition().call(
    d3
      .axisLeft(scales.y)
      .tickSize(lengthOfGridLines)
      .tickSizeOuter(0)
      .tickFormat(() => "") as any // eslint-disable-line
  );
}

/**
 * Draw bars in the stacked bar chart.
 */
export function drawStackedBarChart(scales: Scales, data: StackedData[]): void {
  const dataContainer = d3.select("#data-container");

  const elements = Object.keys(data?.[0] ?? {}).filter((key) => key !== "key");

  const stack = d3
    .stack()
    .keys(elements)
    .value((d, key) => d[key]);

  const series = stack(data);

  dataContainer
    .selectAll(".bar-container")
    .data(series, (s) => (s as Record<string, string>).key)
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "bar-container")
          .attr("fill", (d) => scales.color(d.key) as string)
          .attr("opacity", 0)
          .call(addTooltip)
          .call((enter) =>
            enter.transition().duration(transitionDuration).attr("opacity", 1)
          ),
      (update) =>
        update.call((update) =>
          update
            .transition()
            .duration(transitionDuration)
            .attr("fill", (d) => scales.color(d.key) as string)
            .attr("opacity", 1)
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(transitionDuration)
            .attr("opacity", 0)
            .remove()
        )
    )
    .selectAll("rect")
    .data((d) => d)
    .join(
      (enter) =>
        // @ts-ignore
        enter
          .append("rect")
          .attr("x", (d) => scales.x(d.data.key + ""))
          .attr("y", (d) => scales.y(d[1]))
          .attr("height", (d) => {
            const top = scales.y(d[1]) as number;
            const bottom = scales.y(d[0]) as number;
            return bottom - top;
          })
          .attr("width", scales.x.bandwidth())
          .attr("opacity", 0)
          .call((_enter) =>
            // @ts-ignore
            _enter.transition().duration(transitionDuration).attr("opacity", 1)
          ),
      (update) =>
        update.call((update) =>
          // @ts-ignore
          update
            .transition()
            .duration(transitionDuration)
            .attr("x", (d) => scales.x(d.data.key + ""))
            .attr("y", (d) => scales.y(d[1]))
            .attr("height", (d) => {
              const top = scales.y(d[1]) as number;
              const bottom = scales.y(d[0]) as number;
              return bottom - top;
            })
            .attr("width", scales.x.bandwidth())
            .attr("opacity", 1)
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(transitionDuration)
            .attr("opacity", 0)
            .remove()
        )
    );
}
