import { scaleLinear, select } from "d3";

export function startInteractiveDemo() {
  const demo = select("#interactivity-demo").html(
    "<div>" +
      "<button id='pushBtn'>Push point</button>" +
      "<button id='popBtn'>Pop point</button>" +
      "</div>" +
      "<svg width='865' height='60'>" +
      "<g transform='translate(100, 30)'></g>" +
      "</svg>"
  );

  const data = [0, 20, 50, 90, 100];
  setupListeners(demo, data);
  renderDemo(demo, data);
}

function setupListeners(demo, data) {
  demo.select("#pushBtn").on("click", () => {
    data.push(Math.random() * 100);
    renderDemo(demo, data);
  });

  demo.select("#popBtn").on("click", () => {
    data.pop();
    renderDemo(demo, data);
  });
}

function renderDemo(demo, data) {
  const scale = scaleLinear().domain([0, 100]).range([0, 640]);
  const enrichedData = data.map(scale);

  const circles = demo
    .select("svg")
    .select("g")
    .selectAll("circle")
    .data(enrichedData);

  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => d)
    .attr("cy", 0)
    .attr("r", 5);

  circles.attr("opacity", "30%");

  circles.exit().remove();
}
