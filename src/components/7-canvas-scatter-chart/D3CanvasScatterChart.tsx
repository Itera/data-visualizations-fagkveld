import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";

import { ChartComponentProps, PointData } from "../../types";
import { renderScatterChart } from "./render-chart";
import { MARGIN, TRANSITION_DURATION } from "../../constants";
import { drawElement, drawXAxis, drawYAxis } from "./draw-to-canvas";

d3.namespaces.custom = "http://d3js.org/namespace/custom";

export type Scales = {
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export const D3CanvasScatterChart: FC<ChartComponentProps<PointData[]>> = ({
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

  /**
   * Init and clean up chart
   */
  useEffect(() => {
    const offScreenContainer = d3
      .select("body")
      .append("custom:offScreenContainer")
      .attr("width", width)
      .attr("height", height);

    return () => {
      offScreenContainer.remove();
    };
  }, [width, height]);

  /**
   * Draw chart
   */
  useEffect(() => {
    renderScatterChart(scales, data);

    const timer = d3.timer(
      createDrawCallback(scales, data, height, width),
      1000 / 60
    );

    const timeout = setTimeout(() => {
      timer.stop();
    }, TRANSITION_DURATION * 2);

    return () => {
      timer.stop();
      clearTimeout(timeout);
    };
  }, [scales, height, width, data]);

  return <canvas id="chart-root" width={width} height={height}></canvas>;
};

function createDrawCallback(
  scales: Scales,
  data: PointData[],
  height: number,
  width: number
) {
  const chartRoot = d3.select("#chart-root");
  const canvas = chartRoot.node() as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const offScreenContainerNode = d3
    .select("offScreenContainer")
    .node() as HTMLElement;

  return () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawXAxis(scales.x, context, data, height, width);
    drawYAxis(scales.y, context, height);

    for (const child of offScreenContainerNode.children) {
      drawElement(child as HTMLElement, context);
    }
  };
}
