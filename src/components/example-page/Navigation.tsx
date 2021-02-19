import React, { FC } from "react";
import { Link } from "react-router-dom";

export const Navigation: FC = ({ children }) => {
  return (
    <div>
      <Link style={{ marginRight: 10 }} to="/react-rendered-bar-chart">
        React rendered bar chart
      </Link>
      <Link style={{ marginRight: 10 }} to="/d3-rendered-bar-chart">
        D3 rendered bar chart
      </Link>
      <Link style={{ marginRight: 10 }} to="/d3-stacked-bar-chart">
        D3 rendered stacked bar chart
      </Link>
      <Link to="/d3-canvas-example">D3 canvas example</Link>
    </div>
  );
};
