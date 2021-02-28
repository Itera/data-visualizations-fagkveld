import React, { FC, useEffect, useState } from "react";
import { DefaultButton, Slider, Stack, StackItem } from "@fluentui/react";
import {
  getRandomStrings,
  getNumbers,
  generatePointData,
  generateStackedData,
} from "./data-generation";
import { Domain, Key, PointData, StackedData } from "../../types";

interface DataProviderProps {
  dataType: "point" | "stacked";
  keyType: "string" | "number";
  setPlotData: (data: PointData[] | StackedData[]) => void;
  keysDomain?: Domain;
}

const valueDomain: Domain = { min: 100, max: 1000 };
const defaultKeysDomain: Domain = { min: 0, max: 2000 };

export const DataProvider: FC<DataProviderProps> = ({
  dataType,
  keyType,
  setPlotData,
  keysDomain = defaultKeysDomain,
}) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [numKeys, setnumKeys] = useState(100);
  const [numCategories, setnumCategories] = useState(1);
  const [dataId, setDataId] = useState(0);
  const updateDataValues = () => setDataId((state) => state + 1);

  useEffect(() => {
    if (numKeys) {
      const randomKeys =
        keyType === "string"
          ? getRandomStrings(numKeys)
          : getNumbers(0, 1, numKeys);

      setKeys(randomKeys);
    }
  }, [numKeys, keyType]);

  useEffect(() => {
    if (numCategories) {
      const randomCategories = getRandomStrings(numCategories);
      setCategories(randomCategories);
    }
  }, [numCategories]);

  useEffect(() => {
    if (keys.length && categories.length) {
      const randomData =
        dataType === "point"
          ? generatePointData(keys, categories, valueDomain)
          : generateStackedData(keys, categories, valueDomain);

      setPlotData(randomData);
    }
  }, [keys, categories, dataType, setPlotData]);

  useEffect(() => {
    const updatedData =
      dataType === "point"
        ? generatePointData(keys, categories, valueDomain)
        : generateStackedData(keys, categories, valueDomain);
    setPlotData(updatedData);
    // eslint-disable-next-line
  }, [dataId, setPlotData]);

  return (
    <Stack style={{ marginTop: "20px" }} horizontal verticalAlign="center">
      <StackItem grow>
        <Slider
          label="Number of keys"
          min={keysDomain.min}
          max={keysDomain.max}
          step={1}
          showValue
          snapToStep
          value={numKeys}
          onChange={(value: number) => setnumKeys(value)}
        />
      </StackItem>
      <StackItem grow>
        <Slider
          label="Number of categories"
          min={0}
          max={10}
          step={1}
          showValue
          snapToStep
          value={numCategories}
          onChange={(value: number) => setnumCategories(value)}
        />
      </StackItem>
      <DefaultButton text="Update values" onClick={updateDataValues} />
    </Stack>
  );
};
