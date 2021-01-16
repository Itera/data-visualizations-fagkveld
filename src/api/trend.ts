import axios from "axios";

export interface TrendData {
  labels: Array<string>;
  points: Array<GTData>;
}

export interface GTData {
  formattedAxisTime: string; // "Sep 1, 2020"
  formattedTime: string; // "Sep 2020"
  formattedValue: string[]; // ["28"]
  hasData: boolean[]; // [true]
  dateTime: Date;
  time: number; // "1598918400"
  value: number[]; // [28]
}

interface GTRequest {
  keyWords: Array<string>;
}

interface GTResponse {
  data: {
    default: {
      timelineData: Array<GTData>;
    };
  };
}

export async function getTrendData(
  labels: Array<string>
): Promise<TrendData | null> {
  let response: GTResponse | null = null;
  try {
    response = await axios.post<GTRequest, GTResponse>("/gt", {
      keyWords: labels,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
  const points = response.data.default.timelineData.map((data) => ({
    ...data,
    dateTime: new Date(data.time),
  }));
  return { labels, points };
}
