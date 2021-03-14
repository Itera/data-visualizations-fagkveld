export function startInteractiveDemo() {
  const demo = document.querySelector(".interactive-demo");
  demo.innerHTML = ```
    <div id="interactivity-demo">
      <div>
        <button id="addBtn">Add random point</button>
        <button id="rmBtn">Remove random point</button>
      </div>
      <svg width="865" height="75"></svg>
      <script src="dist/js/interactivity-demo.js"></script>
    </div>
  ```;

  const scale = d3.scaleLinear().domain([0, 100]).range([0, 640]);

  const data = [0, 20, 50, 90, 100];

  const circles = d3
    .select(".interactivity-demo")
    .select("svg")
    .selectAll("circle");

  console.log(d3.select(".interactivity-demo").node());

  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => d)
    .attr("cy", 0)
    .attr("r", 5);

  circles.exit().remove();

  d3.select(".interactivity-demo")
    .select("addBtn")
    .on("click", () => data.push(Math.random() * 100));

  d3.select(".interactivity-demo")
    .select("rmBtn")
    .on("click", () => data.slice(Math.random() * data.length, 1));
}
