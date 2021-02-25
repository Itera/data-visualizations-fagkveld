import React, { FC, useState } from "react";
import {
  ReactRenderedBarChart,
  DataProvider,
  D3RenderedBarChart,
  StackedBarChart,
  D3CanvasExample,
  D3CanvasChart,
} from "./components";
import { Navigation } from "./components/nav/Navigation";
import { useElementSize } from "./hooks/useElementSize";
import { Example } from "./statics";
import { PointData, StackedData } from "./types";

const ASPECT_RATIO = 16 / 9;
const WIDTH = 1500;
const HEIGHT = WIDTH / ASPECT_RATIO;

const App: FC = () => {
  const [activeExample, setActiveExample] = useState<Example>(
    Example.REACT_BAR_CHART
  );

  let example;
  if (activeExample === Example.REACT_BAR_CHART) {
    example = <ReactBarChartExmaple />;
  } else if (activeExample === Example.D3_BAR_CHART) {
    example = <D3BarChartExample />;
  } else if (activeExample === Example.D3_STACKED_BAR_CHART) {
    example = <StackedBarChartExample />;
  } else if (activeExample === Example.CANVAS_EXAMPLE) {
    example = <D3CanvasExample data={[]} width={WIDTH} height={HEIGHT} />;
  } else if (activeExample === Example.CANVAS_CHART) {
    example = <D3CanvasChartExample />;
  }

  return (
    <div>
      <Navigation setActiveExample={setActiveExample} />
      {example}
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
          width={WIDTH}
          height={HEIGHT}
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
          width={WIDTH}
          height={HEIGHT}
        />
      )}
    </>
  );
};

const StackedBarChartExample = () => {
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
          height={size.height}
        />
      )}
      <div
        style={{
          position: "fixed",
          display: "hidden",
          width: "100%",
          height: "calc(100% - 250px)",
        }}
        ref={elementRef}
      ></div>
    </>
  );
};

const D3CanvasChartExample = () => {
  const [plotData, setPlotData] = useState<PointData[] | StackedData[]>([]);

  return (
    <>
      <DataProvider
        dataType={"point"}
        keyType={"number"}
        setPlotData={setPlotData}
      />
      {plotData && (
        <D3CanvasChart
          data={plotData as PointData[]}
          width={WIDTH}
          height={HEIGHT}
        />
      )}
    </>
  );
};
