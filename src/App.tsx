import React, { FC, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  ReactRenderedBarChart,
  DataProvider,
  D3RenderedBarChart,
  StackedBarChart,
  D3CanvasExample,
} from "./components";
import { Navigation } from "./components/example-page/Navigation";
import { PointData, StackedData } from "./types";

const aspectRatio = 16 / 9;

const App: FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route exact path="/react-rendered-bar-chart">
            <ReactBarChartExmaple />
          </Route>
          <Route exact path="/d3-rendered-bar-chart">
            <D3BarChartExample />
          </Route>
          <Route exact path="/d3-stacked-bar-chart">
            <StackedBarChartExample />
          </Route>
          <Route exact path="/d3-canvas-example">
            <D3CanvasExample
              data={[]}
              width={1500}
              height={1500 / aspectRatio}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;

const ReactBarChartExmaple = () => {
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
          width={1500}
          height={1500 / aspectRatio}
        />
      )}
    </>
  );
};

const D3BarChartExample = () => {
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
          width={1500}
          height={1500 / aspectRatio}
        />
      )}
    </>
  );
};

const StackedBarChartExample = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"stacked"}
        keyType={"number"}
        setPlotData={setPlotData}
      />
      {plotData && (
        <StackedBarChart
          data={plotData as StackedData[]}
          width={1500}
          height={1500 / aspectRatio}
        />
      )}
    </>
  );
};
