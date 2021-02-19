import React, { FC, useEffect, useState } from "react";
import { DefaultButton, Slider, Stack } from "@fluentui/react";
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
}

const valueDomain: Domain = { min: 0, max: 1000 };

export const DataProvider: FC<DataProviderProps> = ({
  dataType,
  keyType,
  setPlotData,
}) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [nrOfKeys, setNrOfKeys] = useState(100);
  const [nrOfCategories, setNrOfCategories] = useState(1);
  const [dataId, setDataId] = useState(0);
  const updateDataValues = () => setDataId((state) => state + 1);

  useEffect(() => {
    if (nrOfKeys) {
      const randomKeys =
        keyType === "string"
          ? getRandomStrings(nrOfKeys)
          : getNumbers(0, 1, nrOfKeys);

      setKeys(randomKeys);
    }
  }, [nrOfKeys, keyType]);

  useEffect(() => {
    if (nrOfCategories) {
      const randomCategories = getRandomStrings(nrOfCategories);
      setCategories(randomCategories);
    }
  }, [nrOfCategories]);

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
    <>
      <Stack>
        <Slider
          label="Number of keys"
          min={0}
          max={2000}
          step={1}
          showValue
          snapToStep
          value={nrOfKeys}
          onChange={(value: number) => setNrOfKeys(value)}
        />
        <Slider
          label="Number of categories"
          min={0}
          max={10}
          step={1}
          showValue
          snapToStep
          value={nrOfCategories}
          onChange={(value: number) => setNrOfCategories(value)}
        />

        <DefaultButton text="Update values" onClick={updateDataValues} />
      </Stack>
    </>
  );
};
