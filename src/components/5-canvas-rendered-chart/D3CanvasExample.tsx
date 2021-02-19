import React, { FC, useEffect } from "react";
import * as d3 from "d3";

import { StackedData, ChartComponentProps } from "../../types";
import { throttle } from "lodash";

// Register the "custom" namespace prefix for our custom elements.
// @ts-ignore

export const D3CanvasExample: FC<ChartComponentProps<StackedData[]>> = ({
  data,
  height,
  width,
}) => {
  /**
   * Init and clean up chart
   */
  useEffect(() => {
    d3.namespaces.custom = "http://d3js.org/namespace/custom";

    const canvas = d3.select("#chart-root").node() as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    // document.body.appendChild(document.createElement(""))

    const sketch = d3
      .select("body")
      .append("custom:sketch")
      .attr("width", width)
      .attr("height", height)
      .call((selection) => {
        selection.each(() => null);
      });

    const sketchNode = sketch.node() as HTMLElement;

    // On each mouse move, create a circle that increases in size and fades away.
    d3.select(window).on(
      "mousemove",
      // eslint-disable-next-line
      throttle((e: any) => {
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
      }, 1000 / 120)
    );

    d3.timer(() => {
      canvas.height = height;
      canvas.width = width;
      for (
        let child = sketchNode.firstChild;
        child;
        child = child.nextSibling
      ) {
        draw(child, context);
      }
    });

    return () => {
      canvas.height = height;
      canvas.width = width;
      sketch.remove();
    };
    // eslint-disable-next-line
  }, []);

  return <canvas id="chart-root" width={width} height={height}></canvas>;
};

// eslint-disable-next-line
function draw(element: any, context: CanvasRenderingContext2D) {
  switch (element.tagName) {
    case "circle": {
      context.strokeStyle = element.getAttribute("strokeStyle");
      context.beginPath();
      context.arc(
        element.getAttribute("x"),
        element.getAttribute("y"),
        element.getAttribute("radius"),
        0,
        2 * Math.PI
      );
      context.stroke();
      break;
    }
  }
}
