import * as d3 from "d3";
import { throttle } from "lodash";

import { StackedData } from "../../types";

const BEEK_WIDTH = 20;
const TOOLTIP_HEIGHT = 80;

// eslint-disable-next-line
export function addTooltip(selection: any) {
  const tooltip = d3.select("#tooltip");

  return (
    selection
      // eslint-disable-next-line
      .on("mouseover", function (e: any) {
        const data = e.srcElement.__data__.data;
        tooltip.transition().duration(150).style("opacity", 1);
        tooltip
          .html(getTooltipHtml(data))
          .style("right", `${window.innerWidth - e.clientX + BEEK_WIDTH}px`)
          .style("top", `${e.clientY - TOOLTIP_HEIGHT / 2}px`);

        document.addEventListener("mousemove", throttledMouseMoveHandler);
      })
      // eslint-disable-next-line
      .on("mouseout", function (d: any) {
        tooltip.transition().delay(100).duration(50).style("opacity", 0);
        document.removeEventListener("mousemove", throttledMouseMoveHandler);
      })
  );
}

function getTooltipHtml(data: StackedData): string {
  const rows = Object.keys(data)
    .filter((k) => k !== "key")
    .map(
      (k) =>
        `<div class="tooltip__row"><span>${k}</span><span>${data[k]}</span></div>`
    );
  return `
    <div class="tooltip__heading">Key: ${data.key}</div>
    ${rows.join("")}
    <div class="tooltip__beak"></div>
  `;
}

const throttledMouseMoveHandler = throttle((e: MouseEvent): void => {
  const tooltip = d3.select("#tooltip");
  tooltip
    .style("right", `${window.innerWidth - e.clientX + BEEK_WIDTH}px`)
    .style("top", `${e.clientY - TOOLTIP_HEIGHT / 2}px`);
}, 25);
