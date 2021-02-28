import React, { FC } from "react";
import { DefaultButton, Stack } from "@fluentui/react";

import { ExampleName } from "../../constants";

export const Navigation: FC<{
  activeExample: ExampleName;
  setActiveExample: (next: ExampleName) => void;
}> = ({ setActiveExample, activeExample }) => {
  return (
    <Stack horizontal horizontalAlign="space-between">
      <DefaultButton
        checked={activeExample === ExampleName.REACT_BAR_CHART}
        onClick={() => setActiveExample(ExampleName.REACT_BAR_CHART)}
      >
        React rendered bar chart
      </DefaultButton>
      <DefaultButton
        checked={activeExample === ExampleName.D3_BAR_CHART}
        onClick={() => setActiveExample(ExampleName.D3_BAR_CHART)}
      >
        D3 rendered bar chart
      </DefaultButton>
      <DefaultButton
        checked={activeExample === ExampleName.D3_STACKED_BAR_CHART}
        onClick={() => setActiveExample(ExampleName.D3_STACKED_BAR_CHART)}
      >
        D3 rendered stacked bar chart
      </DefaultButton>
      <DefaultButton
        checked={activeExample === ExampleName.CANVAS_EXAMPLE}
        onClick={() => setActiveExample(ExampleName.CANVAS_EXAMPLE)}
      >
        Canvas animation
      </DefaultButton>
      <DefaultButton
        checked={activeExample === ExampleName.CANVAS_CHART}
        onClick={() => setActiveExample(ExampleName.CANVAS_CHART)}
      >
        Canvas scatter chart
      </DefaultButton>
    </Stack>
  );
};
