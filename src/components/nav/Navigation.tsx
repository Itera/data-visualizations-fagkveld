import React, { FC } from "react";

import { Example } from "../../statics";

export const Navigation: FC<{
  setActiveExample: (next: Example) => void;
}> = ({ setActiveExample }) => {
  return (
    <div>
      <button onClick={() => setActiveExample(Example.REACT_BAR_CHART)}>
        React rendered bar chart
      </button>
      <button onClick={() => setActiveExample(Example.D3_BAR_CHART)}>
        D3 rendered bar chart
      </button>
      <button onClick={() => setActiveExample(Example.D3_STACKED_BAR_CHART)}>
        D3 rendered stacked bar chart
      </button>
      <button onClick={() => setActiveExample(Example.CANVAS_EXAMPLE)}>
        D3 canvas example
      </button>
      <button onClick={() => setActiveExample(Example.CANVAS_CHART)}>
        D3 advanced canvas example
      </button>
    </div>
  );
};
