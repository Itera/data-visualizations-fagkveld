import React, { FC, useEffect, useMemo, useRef } from "react";
import { zip } from "lodash";
import * as d3 from "d3";

import { GTData } from "../../api/trend";

type ReactRenderedBarChartProps = {
  labels: string[];
  data: GTData;
  width: number;
};
type ColorName = "lavender" | "amethyst" | "purple" | "blue" | "green";

type Bar = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

const margin = { top: 40, right: 20, bottom: 40, left: 40 };
const colors: Record<ColorName, string> = {
  lavender: "#E2CFEA",
  amethyst: "#A06CD5",
  purple: "#6247AA",
  blue: "#102B3F",
  green: "#062726",
};

const aspectRatio = 16 / 9;
export const ReactRenderedBarChart: FC<ReactRenderedBarChartProps> = ({
  labels,
  data,
  width,
}) => {
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const height = width / aspectRatio;

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .rangeRound([margin.left, width - margin.right])
        .padding(0.3)
        .domain(labels),
    [width, labels]
  );
  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, d3.max(data.value, (d) => d) as number]),
    [height, data.value]
  );

  const bars = useMemo(
    () =>
      zip(labels, data.value).map(
        ([label, trendValue], index): Bar => {
          const topYCoordinate = yScale(trendValue as number) as number;
          const colorKey = Object.keys(colors)[index] as ColorName;
          return {
            key: label as string,
            x: xScale(label as string) as number,
            y: topYCoordinate,
            width: xScale.bandwidth(),
            height: height - margin.bottom - topYCoordinate,
            fill: colors[colorKey],
          };
        }
      ),
    [labels, data.value, yScale, xScale, height]
  );

  useEffect(() => {
    if (xAxisRef?.current) {
      const xAxis = d3.axisBottom(xScale);
      d3.select(xAxisRef.current)
        .call(xAxis)
        .attr("transform", `translate(0, ${height - margin.bottom})`);
    }

    if (yAxisRef?.current) {
      const yAxis = d3.axisLeft(yScale);
      d3.select(yAxisRef.current)
        .call(yAxis)
        .attr("transform", `translate(${margin.left}, 0)`);
    }
  }, [xScale, yScale, height]);

  return (
    <svg width={width} height={height}>
      <g>
        {bars.map((barProps) => (
          <rect {...barProps}></rect>
        ))}
      </g>
      <g>
        <g ref={xAxisRef}></g>
        <g ref={yAxisRef}></g>
      </g>
    </svg>
  );
};
