/**
 * In this example we use React to render a bar chart. Although this is possible to do,
 * this solution does not scale well as we add more data. We also miss out on a lot of
 * powerfull features in D3 (animated udpates, pan and zoom to mention a few) when
 * taking over rendering in this manner.
 */

import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { getTickValues } from "../../helpers";
import { ChartComponentProps, PointData } from "../../types";
import { COLORS, INVISIBLE_VALUE, MARGIN } from "../../constants";

export const ReactRenderedBarChart: FC<ChartComponentProps<PointData[]>> = ({
  data,
  width,
  height,
}) => {
  const scales = useMemo(
    () => ({
      x: d3
        .scaleBand()
        .padding(0.1)
        .range([MARGIN.left, width - MARGIN.right])
        .domain(data.map((d) => String(d.key))),
      y: d3
        .scaleLinear()
        .range([height - MARGIN.bottom, MARGIN.top])
        .domain(d3.extent(data, (d) => d.value) as [number, number]),
    }),
    [width, height, data]
  );

  /**
   * Although it is possilbe to render the axies with React alone, it is much easier
   * to do with D3. This side effect rerenders the axies when the scales or plot width/height change.
   */
  useEffect(() => {
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
  }, [scales, height, width, data]);

  /**
   * Here we use React to add the bar chart to the DOM.
   * We use the scales to calculate position, width and height for all the
   * bars in the plot.
   */
  return (
    <svg id="chart-root" width={width} height={height}>
      <g>
        {data.map((d) => {
          const y = scales.y(d.value) as number;
          const barProps = {
            key: d.key.toString(),
            x: scales.x(String(d.key)) ?? INVISIBLE_VALUE,
            y: y,
            width: scales.x.bandwidth(),
            height: height - MARGIN.bottom - y,
            fill: COLORS.GREEN,
          };

          return <rect {...barProps}></rect>;
        })}
      </g>
      <g>
        <g id="x-axis-container"></g>
        <g id="y-axis-container"></g>
      </g>
    </svg>
  );
};
