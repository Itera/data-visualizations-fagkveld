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
  LineChart,
  PieChart,
} from "./components";

const ASPECT_RATIO = 16 / 9;

const KEYS_DOMAIN = { min: 0, max: 10000 };
const LINE_KEYS_DOMAIN = { min: 10, max: 100 };
const PIE_KEYS_DOMAIN = { min: 1, max: 20 };

type ExampleProps = {
  size: DOMRect;
};

export const PlaygroundExmaple: FC<ExampleProps> = ({ size }) => {
  return <CoordinateSystem width={size.width} height={size.height} />;
};

export const ReactBarChartExmaple: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"point"}
        keyType={"number"}
        defaultNumKeys={60}
        setPlotData={setPlotData}
        categoriesDisabled={true}
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
        keyType="string"
        defaultNumKeys={60}
        setPlotData={setPlotData}
        categoriesDisabled={true}
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
        defaultNumKeys={60}
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

export const LineChartExample: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType="randomWalkPoint"
        keyType="date"
        keysDomain={LINE_KEYS_DOMAIN}
        defaultNumKeys={80}
        setPlotData={setPlotData}
        categoriesDisabled={true}
      />
      {plotData && size && (
        <LineChart
          data={plotData as PointData<Date>[]}
          width={size.width}
          height={size.width / ASPECT_RATIO}
        />
      )}
    </>
  );
};

export const PieChartExample: FC<ExampleProps> = ({ size }) => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType="point"
        keyType="string"
        keysDomain={PIE_KEYS_DOMAIN}
        defaultNumKeys={8}
        setPlotData={setPlotData}
        categoriesDisabled={true}
      />
      {plotData && size && (
        <PieChart
          data={plotData as PointData[]}
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
        defaultNumKeys={1000}
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
