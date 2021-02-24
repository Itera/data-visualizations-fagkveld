/**
 * In this example, we show how a D3 bar chart can be rendered using using React. Although this is a possible approach,
 * the solution does not scale well when used with larger datasets. We also miss out on a lot of
 * powerful features in D3 (animated updates, pan and zoom; to mention a few) when
 * taking over rendering in this manner.
 */

import React, { FC, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { ChartComponentProps, PointData } from "../../types";
import { colors, INVISIBLE_VALUE } from "../../statics";

const margin = { top: 40, right: 20, bottom: 40, left: 40 };
const aspectRatio = 16 / 9;

type Scales = {
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export const ReactRenderedBarChart: FC<ChartComponentProps<PointData[]>> = ({
  data,
  width,
}) => {
  const [bars, setBars] = useState<React.SVGProps<SVGRectElement>[]>([]);
  const height = width / aspectRatio;

  const scales = useMemo(
    () => ({
      x: d3.scaleBand().padding(0.1),
      y: d3.scaleLinear(),
    }),
    // eslint-disable-next-line
    []
  );
  // @ts-ignore
  window.scales = scales;

  /**
   * Although it is possilbe to render the axies with React alone, it is much easier
   * to do with D3. This side effect redraws the axies when the scales or plot dimentions change.
   */
  useEffect(() => {
    const xAxisContainer = d3.select("#x-axis-container");
    const yAxisContainer = d3.select("#y-axis-container");

    updateScales(scales, width, height, data);

    const xAxis = d3.axisBottom(scales.x);
    const yAxis = d3.axisLeft(scales.y);

    xAxisContainer
      .call(xAxis as any) // eslint-disable-line
      .attr("transform", `translate(0, ${height - margin.bottom})`);

    yAxisContainer
      .call(yAxis as any) // eslint-disable-line
      .attr("transform", `translate(${margin.left}, 0)`);

    setBars(generateBarData(data, scales, height));
  }, [scales, height, width, data]);

  /**
   * Here we use React to add our bar chart to the DOM.
   * We use the scales to calculate position, width and height for all the
   * bars in the plot
   */
  return (
    <svg width={width} height={height}>
      <g>
        {bars.map((b) => (
          <rect {...b}></rect>
        ))}
      </g>
      <g>
        <g id="x-axis-container"></g>
        <g id="y-axis-container"></g>
      </g>
    </svg>
  );
};

function updateScales(
  scales: Scales,
  width: number,
  height: number,
  data: PointData[]
) {
  scales.x
    .range([margin.left, width - margin.right])
    .domain(data.map((d) => d.key + ""));
  scales.y
    .range([height - margin.bottom, margin.top])
    .domain(d3.extent(data, (d) => d.value) as [number, number]);
}

function generateBarData(data: PointData[], scales: Scales, height: number) {
  return data.map((d) => {
    const topYCoordinate = scales.y(d.value) as number;
    return {
      key: d.key,
      x: scales.x(d.key + "") ?? INVISIBLE_VALUE,
      y: topYCoordinate,
      width: scales.x.bandwidth(),
      height: height - margin.bottom - topYCoordinate,
      fill: colors.lavender,
    };
  });
}
