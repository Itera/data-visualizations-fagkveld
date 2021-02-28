import * as d3 from "d3";
import { throttle } from "lodash";

import { StackedData } from "../../types";

const BEEK_WIDTH = 20;
const TOOLTIP_HEIGHT = 80;

export function addTooltip(selection: any): void {
  const tooltip = d3.select("#tooltip");

  return selection
    .on("mouseover", (e: any) => {
      const data = e.srcElement.__data__.data;
      tooltip.transition().duration(150).style("opacity", 1);
      tooltip
        .html(getTooltipHtml(data))
        .style("right", `${window.innerWidth - e.clientX + BEEK_WIDTH}px`)
        .style("top", `${e.clientY - TOOLTIP_HEIGHT / 2}px`);

      document.addEventListener("mousemove", throttledMouseMoveHandler);
    })
    .on("mouseout", (d: any) => {
      tooltip.transition().delay(100).duration(50).style("opacity", 0);
      document.removeEventListener("mousemove", throttledMouseMoveHandler);
    });
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
