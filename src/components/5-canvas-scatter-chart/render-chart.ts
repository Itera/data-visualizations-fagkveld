import * as d3 from "d3";

import { Scales } from "./D3CanvasScatterChart";
import { PointData } from "../../types";
import { TRANSITION_DURATION } from "../../statics";

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
