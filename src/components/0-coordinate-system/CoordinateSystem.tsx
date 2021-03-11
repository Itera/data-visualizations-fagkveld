import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { MARGIN } from "../../constants";
import { renderAxis, renderGrid } from "./render-grid";
import { Playground } from "./Playground";

export const CoordinateSystem: FC<{ width: number; height: number }> = ({
  height,
  width,
}) => {
  const scales = useMemo(
    () => ({
      x: d3
        .scaleLinear()
        .range([MARGIN.left, width - MARGIN.right])
        .domain([0, width - MARGIN.left - MARGIN.right]),
      y: d3
        .scaleLinear()
        .range([MARGIN.top, height - MARGIN.bottom])
        .domain([0, height - MARGIN.top - MARGIN.bottom]),
    }),
    [width, height]
  );

  useEffect(() => {
    renderAxis(scales, height);
    renderGrid(scales, height, width);
  }, [scales, height, width]);

  return (
    <svg id="coordinate-system-chart-root" width={width} height={height}>
      <g id="x-axis-container"></g>
      <g id="y-axis-container"></g>
      <g id="x-grid-container"></g>
      <g id="y-grid-container"></g>
      <g
        className="playground-container"
        transform={`translate(${MARGIN.top}, ${MARGIN.left})`}
      >
        <Playground />
      </g>
    </svg>
  );
};
