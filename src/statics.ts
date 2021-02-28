export type ColorName = "lavender" | "amethyst" | "purple" | "blue" | "green";

export const COLORS: Record<ColorName, string> = {
  lavender: "#E2CFEA",
  amethyst: "#A06CD5",
  purple: "#6247AA",
  blue: "#102B3F",
  green: "#062726",
};

export const MARGIN = { top: 40, right: 20, bottom: 40, left: 40 };

export const INVISIBLE_VALUE = -Infinity;

export const TRANSITION_DURATION = 250;

export enum ExampleName {
  REACT_BAR_CHART = "REACT_BAR_CHART",
  D3_BAR_CHART = "D3_BAR_CHART",
  D3_STACKED_BAR_CHART = "D3_STACKED_BAR_CHART",
  CANVAS_EXAMPLE = "CANVAS_EXAMPLE",
  CANVAS_CHART = "CANVAS_CHART",
}
