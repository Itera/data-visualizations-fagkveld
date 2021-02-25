import React, { FC, useEffect, useMemo } from "react";
import * as d3 from "d3";

import { ChartComponentProps, PointData } from "../../types";
import { renderScatterChart } from "./render-chart";
import { MARGIN, TRANSITION_DURATION } from "../../statics";
import { getTickValues } from "../../helpers";

d3.namespaces.custom = "http://d3js.org/namespace/custom";

export type Scales = {
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export const D3CanvasChart: FC<ChartComponentProps<PointData[]>> = ({
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
        .domain(data.map((d) => d.key + "")),
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
    const sketch = d3
      .select("body")
      .append("custom:sketch")
      .attr("width", width)
      .attr("height", height);

    return () => {
      sketch.remove();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    renderScatterChart(scales, data);
    const timer = d3.timer(
      getDrawCallback(scales, data, height, width),
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

function getDrawCallback(
  scales: Scales,
  data: PointData[],
  height: number,
  width: number
) {
  const chartRoot = d3.select("#chart-root");
  const canvas = chartRoot.node() as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const sketchNode = document.getElementsByTagNameNS(
    d3.namespaces.custom,
    "sketch"
  )[0];

  return () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawXAxis(scales.x, context, data, height, width);
    drawYAxis(scales.y, context, height);

    for (let child = sketchNode.firstChild; child; child = child.nextSibling) {
      draw(child, context);
    }
  };
}

// eslint-disable-next-line
function draw(element: any, context: CanvasRenderingContext2D) {
  switch (element.tagName) {
    case "rect": {
      const elm = element as SVGRectElement;
      context.fillStyle = elm.getAttribute("fill") as string;
      context.beginPath();
      context.rect(
        +(elm.getAttribute("x") as string),
        +(elm.getAttribute("y") as string),
        +(elm.getAttribute("width") as string),
        +(elm.getAttribute("height") as string)
      );
      context.fill();
      break;
    }
    case "circle": {
      const elm = element as SVGCircleElement;
      context.fillStyle = elm.getAttribute("fill") as string;
      context.beginPath();
      context.arc(
        +(elm.getAttribute("x") as string),
        +(elm.getAttribute("y") as string),
        +(elm.getAttribute("radius") as string),
        0,
        2 * Math.PI
      );
      context.fill();
      break;
    }
  }
}

const TICK_LENGTH = 6;

function drawXAxis(
  xScale: d3.ScaleBand<string>,
  context: CanvasRenderingContext2D,
  data: PointData[],
  height: number,
  width: number
) {
  /**
   * Draw axis line
   */
  context.beginPath();
  context.lineTo(MARGIN.left, height - MARGIN.bottom);
  context.lineTo(width - MARGIN.right, height - MARGIN.bottom);
  context.strokeStyle = "#000";
  context.stroke();

  /**
   * Draw ticks
   */
  const xAxisTickValues = getTickValues(
    data.map((d) => d.key),
    width - MARGIN.left - MARGIN.right,
    20
  );

  context.beginPath();

  xAxisTickValues.forEach((d) => {
    context.moveTo(
      (xScale(d + "") as number) + xScale.bandwidth() / 2,
      height - MARGIN.bottom + 0.5
    );
    context.lineTo(
      (xScale(d + "") as number) + xScale.bandwidth() / 2,
      height - MARGIN.bottom + TICK_LENGTH + 0.5
    );
  });

  context.strokeStyle = "#000";
  context.stroke();

  /**
   * Draw labels
   */
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#000";

  xAxisTickValues.forEach((d, i) => {
    context.fillText(
      i + "",
      (xScale(d + "") as number) + xScale.bandwidth() / 2,
      height - MARGIN.bottom + TICK_LENGTH + 2
    );
  });
}

function drawYAxis(
  yScale: d3.ScaleLinear<number, number>,
  context: CanvasRenderingContext2D,
  height: number
) {
  /**
   * Draw axis line
   */
  context.beginPath();
  context.moveTo(MARGIN.left + 0.5, MARGIN.top);
  context.lineTo(MARGIN.left + 0.5, height - MARGIN.bottom);
  context.strokeStyle = "#000";
  context.stroke();

  /**
   * Draw ticks
   */
  yScale.ticks().forEach((d) => {
    context.moveTo(MARGIN.left, yScale(d) as number);
    context.lineTo(MARGIN.left - TICK_LENGTH, yScale(d) as number);
  });

  context.strokeStyle = "#000";
  context.stroke();

  /**
   * Draw y-axis labels
   */
  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillStyle = "#000";

  yScale.ticks().forEach((d) => {
    context.fillText(
      d + "",
      MARGIN.left - TICK_LENGTH - 2,
      yScale(d) as number
    );
  });
}
