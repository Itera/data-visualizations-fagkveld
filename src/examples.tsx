import React, { FC, useState } from "react";

import { PointData, StackedData } from "./types";
import {
  DataProvider,
  CoordinateSystem,
  ReactRenderedBarChart,
  D3RenderedBarChart,
  StackedBarChart,
  D3CanvasAnimation,
  D3CanvasScatterChart,
} from "./components";

const ASPECT_RATIO = 16 / 9;

const KEYS_DOMAIN = { min: 0, max: 10000 };

type ExampleProps = {
  size: DOMRect;
};

export const CoordinateSystemExmaple: FC<ExampleProps> = ({ size }) => {
  return (
    <CoordinateSystem width={size.width} height={size.width / ASPECT_RATIO} />
  );
};

export const ReactBarChartExmaple: FC<ExampleProps> = ({ size }) => {
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
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
    </>
  );
};

export const D3BarChartExample: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType="point"
        keyType="number"
        setPlotData={setPlotData}
      />
      {plotData && (
        <D3RenderedBarChart
          data={plotData as PointData[]}
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
    </>
  );
};

export const StackedBarChartExample: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType="stacked"
        keyType="number"
        setPlotData={setPlotData}
      />
      {plotData && size && (
        <StackedBarChart
          data={plotData as StackedData[]}
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
    </>
  );
};

export const CanvasAnimationExample: FC<ExampleProps> = ({ size }) => (
  <D3CanvasAnimation width={size.width} height={size.width / ASPECT_RATIO} />
);

export const CanvasScatterChartExample: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType="point"
        keyType="number"
        setPlotData={setPlotData}
        keysDomain={KEYS_DOMAIN}
      />
      {plotData && (
        <D3CanvasScatterChart
          data={plotData as PointData[]}
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
    </>
  );
};
