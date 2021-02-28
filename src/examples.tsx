import React, { FC, useState } from "react";

import {
  ReactRenderedBarChart,
  DataProvider,
  D3RenderedBarChart,
  StackedBarChart,
  D3CanvasAnimation,
  D3CanvasScatterChart,
} from "./components";
import { useElementSize } from "./hooks/useElementSize";
import { PointData, StackedData } from "./types";

const ASPECT_RATIO = 16 / 9;
const WIDTH = 1500;
const HEIGHT = WIDTH / ASPECT_RATIO;

export const ReactBarChartExmaple: FC = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"point"}
        keyType={"number"}
        setPlotData={setPlotData}
      />
      {plotData && (
        <ReactRenderedBarChart
          data={plotData as PointData[]}
          width={WIDTH}
          height={HEIGHT}
        />
      )}
    </>
  );
};

export const D3BarChartExample: FC = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"point"}
        keyType={"number"}
        setPlotData={setPlotData}
      />
      {plotData && (
        <D3RenderedBarChart
          data={plotData as PointData[]}
          width={WIDTH}
          height={HEIGHT}
        />
      )}
    </>
  );
};

export const StackedBarChartExample: FC = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);
  const [size, elementRef] = useElementSize<HTMLDivElement>();

  return (
    <>
      <DataProvider
        dataType={"stacked"}
        keyType={"number"}
        setPlotData={setPlotData}
      />
      {plotData && size && (
        <StackedBarChart
          data={plotData as StackedData[]}
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
      <div
        style={{
          position: "absolute",
          display: "hidden",
          width: "100%",
        }}
        ref={elementRef}
      ></div>
    </>
  );
};

export const CanvasAnimationExample: FC = () => (
  <D3CanvasAnimation width={WIDTH} height={HEIGHT} />
);

const keysDomain = { min: 0, max: 10000 };

export const CanvasScatterChartExample: FC = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"point"}
        keyType={"number"}
        setPlotData={setPlotData}
        keysDomain={keysDomain}
      />
      {plotData && (
        <D3CanvasScatterChart
          data={plotData as PointData[]}
          width={WIDTH}
          height={HEIGHT}
        />
      )}
    </>
  );
};
