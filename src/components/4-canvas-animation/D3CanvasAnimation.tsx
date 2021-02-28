import React, { FC, useEffect } from "react";
import * as d3 from "d3";
import { throttle } from "lodash";
import { toNumber } from "../../helpers";

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

    const offScreenContainer = d3
      .select("body")
      .append("custom:offScreenContainer")
      .attr("width", width)
      .attr("height", height);

    chartRoot.on(
      "mousemove",
      throttle((e) => {
        // On each mouse move, create a circle that increases in size and fades away.
        offScreenContainer
          .append("custom:circle")
          .attr("x", e.offsetX)
          .attr("y", e.offsetY)
          .attr("radius", 0)
          .attr("strokeStyle", "red")
          .transition()
          .duration(2000)
          .ease(Math.sqrt)
          .attr("radius", 200)
          .attr("strokeStyle", "white")
          .remove();
      }, 1000 / 120)
    );

    const timer = d3.timer(() => {
      const offScreenContainerNode = offScreenContainer.node() as HTMLElement;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const circleElement of offScreenContainerNode.children) {
        drawCircle(circleElement as HTMLElement, context);
      }
    }, 1000 / 60);

    return () => {
      chartRoot.on("mousemove", null);
      timer.stop();
      offScreenContainer.remove();
    };
  }, [width, height]);

  return <canvas id="chart-root" width={width} height={height}></canvas>;
};

function drawCircle(element: HTMLElement, context: CanvasRenderingContext2D) {
  context.strokeStyle = element.getAttribute("strokeStyle") as string;
  context.beginPath();
  context.arc(
    toNumber(element.getAttribute("x")),
    toNumber(element.getAttribute("y")),
    toNumber(element.getAttribute("radius")),
    0,
    2 * Math.PI
  );
  context.stroke();
}
