import * as d3 from "d3";

import { Scales } from "./D3CanvasChart";
import { PointData } from "../../types";
import { MARGIN, TRANSITION_DURATION } from "../../statics";

/**
 * Render bars in the stacked bar chart.
 */
export function renderBarChart(
  scales: Scales,
  data: PointData[],
  height: number
): void {
  const dataContainer = d3.select("sketch");

  dataContainer
    .selectAll("rect")
    .data(data, (d) => `${(d as PointData).key}-${(d as PointData).category}`)
    .join(
      (enter) =>
        // @ts-ignore
        enter
          .append("rect")
          .attr("x", (d) => scales.x(d.key + ""))
          .attr("y", (d) => scales.y(d.value))
          .attr("height", (d) => {
            return height - MARGIN.bottom - (scales.y(d.value) as number);
          })
          .attr("width", scales.x.bandwidth())
          .attr("opacity", 0)
          .call((_enter) =>
            _enter.transition().duration(TRANSITION_DURATION).attr("opacity", 1)
          ),
      (update) =>
        update.call((update) =>
          // @ts-ignore
          update
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("x", (d) => scales.x(d.key + ""))
            .attr("y", (d) => scales.y(d.value))
            .attr("height", (d) => {
              return height - MARGIN.bottom - (scales.y(d.value) as number);
            })
            .attr("width", scales.x.bandwidth())
            .attr("opacity", 1)
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("opacity", 0)
            .remove()
        )
    );
}

/**
 * Render points in the scatter chart.
 */
export function renderScatterChart(scales: Scales, data: PointData[]): void {
  const dataContainer = d3.select("sketch");

  dataContainer
    .selectAll("circle")
    .data(data, (d) => `${(d as PointData).key}-${(d as PointData).category}`)
    .join(
      (enter) =>
        // @ts-ignore
        enter
          .append("circle")
          .attr("x", (d) => scales.x(d.key + ""))
          .attr("y", (d) => scales.y(d.value))
          .attr("radius", 0)
          .call((_enter) =>
            _enter
              .transition()
              .duration(TRANSITION_DURATION)
              .attr("radius", 3)
              .attr("fill", (_, i) => d3.interpolateViridis(i / data.length))
          ),
      (update) =>
        update.call((update) =>
          // @ts-ignore
          update
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("x", (d) => scales.x(d.key + ""))
            .attr("y", (d) => scales.y(d.value))
            .attr("radius", 3)
            .attr("fill", (_, i) => d3.interpolateViridis(i / data.length))
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(TRANSITION_DURATION)
            .attr("radius", 0)
            .remove()
        )
    );
}
