import { getTickValues, toNumber } from "../../helpers";
import { MARGIN } from "../../constants";
import { PointData } from "../../types";

const TICK_LENGTH = 6;

export function drawElement(
  element: HTMLElement,
  context: CanvasRenderingContext2D
): void {
  switch (element.tagName) {
    case "rect": {
      const elem = (element as unknown) as SVGRectElement;
      context.fillStyle = elem.getAttribute("fill") as string;
      context.beginPath();
      context.rect(
        toNumber(elem.getAttribute("x")),
        toNumber(elem.getAttribute("y")),
        toNumber(elem.getAttribute("width")),
        toNumber(elem.getAttribute("height"))
      );
      context.fill();
      break;
    }
    case "circle": {
      const elem = (element as unknown) as SVGCircleElement;
      context.fillStyle = elem.getAttribute("fill") as string;
      context.beginPath();
      context.arc(
        toNumber(elem.getAttribute("x")),
        toNumber(elem.getAttribute("y")),
        toNumber(elem.getAttribute("radius")),
        0,
        2 * Math.PI
      );
      context.fill();
      break;
    }
  }
}

export function drawXAxis(
  xScale: d3.ScaleBand<string>,
  context: CanvasRenderingContext2D,
  data: PointData[],
  height: number,
  width: number
): void {
  /**
   * Draw axis line
   */
  context.beginPath();
  context.moveTo(MARGIN.left, height - MARGIN.bottom);
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
      (xScale(String(d)) as number) + xScale.bandwidth() / 2,
      height - MARGIN.bottom + 0.5
    );
    context.lineTo(
      (xScale(String(d)) as number) + xScale.bandwidth() / 2,
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
      String(i),
      (xScale(String(d)) as number) + xScale.bandwidth() / 2,
      height - MARGIN.bottom + TICK_LENGTH + 2
    );
  });
}

export function drawYAxis(
  yScale: d3.ScaleLinear<number, number>,
  context: CanvasRenderingContext2D,
  height: number
): void {
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
      String(d),
      MARGIN.left - TICK_LENGTH - 2,
      yScale(d) as number
    );
  });
}
