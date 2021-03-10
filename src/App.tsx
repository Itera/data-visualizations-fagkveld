import React, { FC, useState } from "react";

import { Navigation } from "./components/nav/Navigation";
import { ExampleName } from "./constants";

import {
  ReactBarChartExmaple,
  D3BarChartExample,
  StackedBarChartExample,
  CanvasAnimationExample,
  CanvasScatterChartExample,
  PlaygroundExmaple,
  PieChartExample,
  LineChartExample,
} from "./examples";
import { useElementSize } from "./hooks/useElementSize";

const App: FC = () => {
  const [activeExample, setActiveExample] = useState<ExampleName>(
    ExampleName.PLAYGROUND
  );
  const [size, elementRef] = useElementSize<HTMLDivElement>();

  let example;
  if (size) {
    if (activeExample === ExampleName.PLAYGROUND) {
      example = <PlaygroundExmaple size={size} />;
    } else if (activeExample === ExampleName.REACT_BAR_CHART) {
      example = <ReactBarChartExmaple size={size} />;
    } else if (activeExample === ExampleName.D3_BAR_CHART) {
      example = <D3BarChartExample size={size} />;
    } else if (activeExample === ExampleName.D3_STACKED_BAR_CHART) {
      example = <StackedBarChartExample size={size} />;
    } else if (activeExample === ExampleName.LINE_CHART) {
      example = <LineChartExample size={size} />;
    } else if (activeExample === ExampleName.PIE_CHART) {
      example = <PieChartExample size={size} />;
    } else if (activeExample === ExampleName.CANVAS_EXAMPLE) {
      example = <CanvasAnimationExample size={size} />;
    } else if (activeExample === ExampleName.CANVAS_CHART) {
      example = <CanvasScatterChartExample size={size} />;
    }
  }

  return (
    <div className="app-container">
      <Navigation
        activeExample={activeExample}
        setActiveExample={setActiveExample}
      />

      <div className="example-container">{example}</div>

      <div className="chart-size-reference" ref={elementRef}></div>
    </div>
  );
};

export default App;
