export type Key = string | number;
export type Value = string | number;

export type PointData = {
  key: Key;
  category: string;
  value: number;
};

export type StackedData = {
  key: any;
  [category: string]: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type Domain = {
  min: number;
  max: number;
};

export interface ChartComponentProps<T = PointData[] | StackedData[]> {
  data: T;
  height: number;
  width: number;
}
