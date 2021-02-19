import flatten from "lodash/flatten";
import { Domain, PointData, StackedData, Key } from "../../types";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export function getRandomStrings(amount: number): string[] {
  let result: string[] = alphabet.slice(0, Math.min(amount, 26));

  for (let i = 0; i < amount; i++) {
    if (result.length === amount) {
      return result;
    }

    result = getPermutations(result, alphabet, amount);
  }
  return result;
}

function getPermutations(a: string[], b: string[], amount: number) {
  const result = [...a];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (result.length === amount) return result;
      result.push(a[i] + b[j]);
    }
  }
  return result;
}

export function getNumbers(
  start: number,
  step: number,
  amount: number
): number[] {
  const result = [];
  let prevValue = start;
  for (let i = 0; i < amount; i++) {
    result.push(prevValue);
    prevValue += step;
  }
  return result;
}

export function generatePointData(
  keys: Key[],
  categories: string[],
  valueDomain: Domain
): PointData[] {
  return flatten(
    keys.map((key) => {
      return categories.map((category) => {
        return {
          key: key,
          category: category,
          value: generateRandomValue(valueDomain),
        };
      });
    })
  );
}

export function generateStackedData(
  keys: any[], // eslint-disable-line
  categories: string[],
  valueDomain: Domain
): StackedData[] {
  return keys.map((key) => {
    const data: StackedData = {
      key: key,
    };
    categories.forEach((category) => {
      data[category] = generateRandomValue(valueDomain);
    });
    return data as StackedData;
  });
}

function generateRandomValue(valueDomain: Domain) {
  return round(
    valueDomain.min + Math.random() * (valueDomain.max - valueDomain.min),
    2
  );
}

function round(value: number, numberOfDecimals: number) {
  return (
    Math.floor(value * Math.pow(10, numberOfDecimals)) /
    Math.pow(10, numberOfDecimals)
  );
}
