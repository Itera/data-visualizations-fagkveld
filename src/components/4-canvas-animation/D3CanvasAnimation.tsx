import React, { FC, useEffect } from "react";
import * as d3 from "d3";
import { throttle } from "lodash";

d3.namespaces.custom = "http://d3js.org/namespace/custom";

export const D3CanvasAnimation: FC<{ width: number; height: number }> = ({
  height,
  width,
}) => {
  /**
   * Init and clean up
   */
  useEffect(() => {
    const chartRoot = d3.select("#chart-root");
    const canvas = chartRoot.node() as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const sketch = d3
      .select("body")
      .append("custom:sketch")
      .attr("width", width)
      .attr("height", height);

    // eslint-disable-next-line
    const mouseMoveHandler = throttle((e: any) => {
      // On each mouse move, create a circle that increases in size and fades away.
      sketch
        .append("custom:circle")
        .attr("x", e.clientX)
        .attr("y", e.clientY)
        .attr("radius", 0)
        .attr("strokeStyle", "red")
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr("radius", 200)
        .attr("strokeStyle", "white")
        .remove();
    }, 1000 / 120);

    chartRoot.on("mousemove", mouseMoveHandler);

    const sketchNode = sketch.node() as HTMLElement;

    const timer = d3.timer(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (
        let circleElement = sketchNode.firstChild;
        circleElement;
        circleElement = circleElement.nextSibling
      ) {
        drawCircle(circleElement, context);
      }
    }, 1000 / 60);

    return () => {
      chartRoot.on("mousemove", null);
      timer.stop();
      sketch.remove();
    };
    // eslint-disable-next-line
  }, []);

  return <canvas id="chart-root" width={width} height={height}></canvas>;
};

// eslint-disable-next-line
function drawCircle(element: any, context: CanvasRenderingContext2D) {
  context.strokeStyle = element.getAttribute("strokeStyle") as string;
  context.beginPath();
  context.arc(
    element.getAttribute("x"),
    element.getAttribute("y"),
    element.getAttribute("radius"),
    0,
    2 * Math.PI
  );
  context.stroke();
}
