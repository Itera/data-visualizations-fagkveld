import React, { FC, useState } from "react";

import { Navigation } from "./components/nav/Navigation";
import { ExampleName } from "./constants";

import {
  ReactBarChartExmaple,
  D3BarChartExample,
  StackedBarChartExample,
  CanvasAnimationExample,
  CanvasScatterChartExample,
  CoordinateSystemExmaple,
} from "./examples";
import { useElementSize } from "./hooks/useElementSize";

const App: FC = () => {
  const [activeExample, setActiveExample] = useState<ExampleName>(
    ExampleName.COORDINATE_SYSTEM
  );
  const [size, elementRef] = useElementSize<HTMLDivElement>();

  let example;
  if (size) {
    if (activeExample === ExampleName.COORDINATE_SYSTEM) {
      example = <CoordinateSystemExmaple size={size} />;
    } else if (activeExample === ExampleName.REACT_BAR_CHART) {
      example = <ReactBarChartExmaple size={size} />;
    } else if (activeExample === ExampleName.D3_BAR_CHART) {
      example = <D3BarChartExample size={size} />;
    } else if (activeExample === ExampleName.D3_STACKED_BAR_CHART) {
      example = <StackedBarChartExample size={size} />;
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

      <div
        style={{
          position: "absolute",
          display: "hidden",
          width: "100%",
        }}
        ref={elementRef}
      ></div>
    </div>
  );
};

export default App;
