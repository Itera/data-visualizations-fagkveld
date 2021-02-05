import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";

import { GTData } from "../../api/trend";

type D3RenderedLineChartProps = {
  labels: string[];
  data: GTData[];
  width: number;
};

const aspectRatio = 16 / 9;
const margin = { top: 20, right: 10, bottom: 20, left: 40 };
const colors = {
  lavender: "#E2CFEA",
  amethyst: "#A06CD5",
  purple: "#6247AA",
  blue: "#102B3F",
  green: "#062726",
};

export const D3RenderedLineChart: FC<D3RenderedLineChartProps> = ({
  labels,
  data: dataOld,
  width,
}) => {
  const height = width / aspectRatio;
  useEffect(() => {
    const data = [
      { dateTime: new Date(2007, 3, 24), value: [15] },
      { dateTime: new Date(2007, 3, 25), value: [16] },
      { dateTime: new Date(2007, 3, 26), value: [10] },
      { dateTime: new Date(2007, 3, 27), value: [22] },
      { dateTime: new Date(2007, 3, 30), value: [30] },
      { dateTime: new Date(2007, 4, 1), value: [5] },
    ];

    const timeDomain = d3.extent(data, (d) => d.dateTime) as [Date, Date];
    console.log("timeDomain: ", timeDomain);

    const xScale = d3
      .scaleTime()
      .domain(timeDomain)
      .range([margin.left, width - margin.right]);

    console.log(
      "max domain: ",
      d3.max(data, (d) => d3.max(d.value, (v) => v)) as number
    );
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(d.value, (v) => v)) as number])
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) =>
      g
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    const yAxis = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) =>
      g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    d3.selectAll("#lineChartRoot > *").remove();

    const svg = d3
      .select("#lineChartRoot")
      .attr("width", width)
      .attr("height", height);

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    // @ts-ignore
    const line = d3
      .line()
      // @ts-ignore
      .x((d) => xScale(d.dateTime))
      // @ts-ignore
      .y((d) => yScale(d.value));

    // const lines = chart.selectAll("lines").data(data).enter().append("g");

    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#ed3700")
      .attr("stroke-width", "3")
      //@ts-ignore
      .attr("d", line);

    // @ts-ignore
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.dateTime))
      .attr("cy", (d) => yScale((d.value as unknown) as number))
      .attr("r", 5)
      .on("mouseover", function (a, b, c) {
        console.log(a, b, c);
      });
  }, [labels, dataOld, width, height]);

  return <svg id="lineChartRoot"></svg>; // width={width} height={width / aspectRatio}
};

// const lineGenerator = d3.line(); // https://www.youtube.com/watch?v=zXBdNDnqV2Q&t=975s
