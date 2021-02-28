import React, { FC, useState } from "react";

import { Navigation } from "./components/nav/Navigation";
import { ExampleName } from "./constants";

import {
  ReactBarChartExmaple,
  D3BarChartExample,
  StackedBarChartExample,
  CanvasAnimationExample,
  CanvasScatterChartExample,
} from "./examples";

const App: FC = () => {
  const [activeExample, setActiveExample] = useState<ExampleName>(
    ExampleName.REACT_BAR_CHART
  );

  let example;
  if (activeExample === ExampleName.REACT_BAR_CHART) {
    example = <ReactBarChartExmaple />;
  } else if (activeExample === ExampleName.D3_BAR_CHART) {
    example = <D3BarChartExample />;
  } else if (activeExample === ExampleName.D3_STACKED_BAR_CHART) {
    example = <StackedBarChartExample />;
  } else if (activeExample === ExampleName.CANVAS_EXAMPLE) {
    example = <CanvasAnimationExample />;
  } else if (activeExample === ExampleName.CANVAS_CHART) {
    example = <CanvasScatterChartExample />;
  }

  return (
    <div className="app-container">
      <Navigation
        activeExample={activeExample}
        setActiveExample={setActiveExample}
      />
      {example}
    </div>
  );
};

export default App;
