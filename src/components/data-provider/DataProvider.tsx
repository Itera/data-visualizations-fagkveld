import React, { FC, useEffect, useState } from "react";
import { DefaultButton, Slider, Stack, StackItem } from "@fluentui/react";
import {
  getRandomStrings,
  getNumbers,
  generatePointData,
  generateStackedData,
  getDates,
  generateRandomWalkPointData,
  generateRandomNumbers,
} from "./data-generation";
import { Domain, Key, PointData, StackedData } from "../../types";

interface DataProviderProps {
  dataType: "point" | "stacked" | "randomWalkPoint";
  keyType: "string" | "number" | "date";
  defaultNumKeys: number;
  keysDomain?: Domain;
  categoriesDisabled?: boolean;
  setPlotData: (data: PointData[] | StackedData[]) => void;
}

const valueDomain: Domain = { min: 100, max: 1000 };
const diffDomain: Domain = { min: -50, max: 50 };
const defaultKeysDomain: Domain = { min: 0, max: 2000 };

export const DataProvider: FC<DataProviderProps> = ({
  dataType,
  keyType,
  defaultNumKeys,
  keysDomain = defaultKeysDomain,
  categoriesDisabled,
  setPlotData,
}) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [numKeys, setNumKeys] = useState(defaultNumKeys);
  const [numCategories, setNumCategories] = useState(1);
  const [dataId, setDataId] = useState(0);
  const updateDataValues = () => setDataId((state) => state + 1);

  /**
   * Generate new keys
   */
  useEffect(() => {
    if (numKeys) {
      let randomKeys: Key[] = [];

      if (keyType === "string") {
        randomKeys = getRandomStrings(numKeys);
      } else if (keyType === "number") {
        randomKeys = getNumbers(0, 1, numKeys);
      } else {
        randomKeys = getDates(new Date(2000, 1, 1), 1, numKeys);
      }

      setKeys(randomKeys);
    }
  }, [numKeys, keyType]);

  /**
   * Generate new categoreis
   */
  useEffect(() => {
    if (numCategories) {
      const randomCategories = getRandomStrings(numCategories);
      setCategories(randomCategories);
    }
  }, [numCategories]);

  /**
   * Generate data when keys, categories or dataId changes.
   */
  useEffect(() => {
    if (keys.length && categories.length) {
      let randomData;

      if (dataType === "point") {
        randomData = generatePointData(keys, categories, valueDomain);
      } else if (dataType === "stacked") {
        randomData = generateStackedData(keys, categories, valueDomain);
      } else {
        randomData = generateRandomWalkPointData(
          keys,
          categories,
          generateRandomNumbers(valueDomain, categories.length),
          diffDomain
        );
      }

      setPlotData(randomData);
    }
  }, [keys, categories, dataId, dataType, setPlotData]);

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
          onChange={(value: number) => setNumKeys(value)}
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
          onChange={(value: number) => setNumCategories(value)}
          disabled={categoriesDisabled}
        />
      </StackItem>
      <DefaultButton text="Update values" onClick={updateDataValues} />
    </Stack>
  );
};
