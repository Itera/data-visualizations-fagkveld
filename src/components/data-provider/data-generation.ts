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
  const result: string[] = alphabet.slice(0, Math.min(amount, 26));
  let prevPermutations: string[] = [...result];

  while (result.length < amount) {
    const nextPermutations = getPermutations(
      prevPermutations,
      alphabet,
      amount - result.length
    );
    result.push(...nextPermutations);
    prevPermutations = nextPermutations;
  }

  return result;
}

function getPermutations(a: string[], b: string[], amount: number) {
  const result = [];
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

export function getDates(
  start: Date,
  stepInDays: number,
  amount: number
): Date[] {
  const result: Date[] = [start];

  for (let i = 1; i < amount; i++) {
    const nextDate = new Date(result[i - 1]);
    nextDate.setDate(nextDate.getDate() + stepInDays);
    result.push(nextDate);
  }

  return result;
}

export function generatePointData(
  keys: Key[],
  categories: string[],
  valueDomain: Domain
): PointData[] {
  return flatten(
    keys.map((key) =>
      categories.map((category) => ({
        key: key,
        category: category,
        value: generateRandomNumber(valueDomain),
      }))
    )
  );
}

export function generateRandomWalkPointData(
  keys: Key[],
  categories: string[],
  startValues: number[],
  diffDomain: Domain
): PointData[] {
  const result: PointData[] = [];

  for (let i = 0; i < categories.length; i++) {
    const categoryPoints: PointData[] = [
      {
        category: categories[i],
        key: keys[0],
        value: startValues[i],
      },
    ];

    for (let j = 1; j < keys.length; j++) {
      const prevValue = categoryPoints[j - 1].value;
      categoryPoints.push({
        key: keys[j],
        category: categories[i],
        value: prevValue + generateRandomNumber(diffDomain),
      });
    }

    result.push(...categoryPoints);
  }

  return result;
}

export function generateStackedData(
  keys: any[],
  categories: string[],
  valueDomain: Domain
): StackedData[] {
  return keys.map(
    (key) =>
      categories.reduce(
        (data, category) => ({
          ...data,
          [category]: generateRandomNumber(valueDomain),
        }),
        { key }
      ) as StackedData
  );
}

export function generateRandomNumbers(
  valueDomain: Domain,
  amount: number
): number[] {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(generateRandomNumber(valueDomain));
  }
  return result;
}

function generateRandomNumber(valueDomain: Domain) {
  return round(
    valueDomain.min + Math.random() * (valueDomain.max - valueDomain.min),
    2
  );
}

function round(value: number, numberOfDecimals: number) {
  return +value.toFixed(numberOfDecimals);
}
