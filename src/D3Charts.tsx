import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { IStackItemStyles, IStackTokens, Stack } from "@fluentui/react";
import { debounce } from "lodash";
import { GTData } from "./types";
import { ReactRenderedBarChart } from "./components/1-react-rendered-bar-chart/ReactRenderedBarChart";
import { D3RenderedLineChart } from "./components/2-d3-rendered-line-chart/D3RenderedLineChart";

const stackItemStyles: IStackItemStyles = {
  root: {
    width: "200px",
  },
};

const buttonStyles = {
  root: {
    marginTop: "20px",
  },
};

const horizontalGapStackTokens: IStackTokens = {
  childrenGap: 10,
};

export const D3Charts: FC = () => {
  const [searchWord1, setSearchWord1] = useState<string>("JavaScript");
  const [searchWord2, setSearchWord2] = useState<string>("Java");
  const [searchWord3, setSearchWord3] = useState<string>("C");
  const [searchWord4, setSearchWord4] = useState<string>("Python");
  const [data, setData] = useState<{ points: GTData[]; labels: string[] }>({
    points: [],
    labels: [],
  });

  const [chartWidth, setChartWidth] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const getTrendData = () => {
    const keyWords = [
      searchWord1,
      searchWord2,
      searchWord3,
      searchWord4,
    ].filter((w) => w.length > 0);
    axios
      .post("/gt", {
        keyWords: keyWords,
      })
      .then((response: any) => {
        let chartData = response?.data?.default?.timelineData as GTData[];
        chartData = chartData.map((d) => {
          d.dateTime = new Date(d.time);
          return d;
        });
        setData({ points: chartData, labels: keyWords });
        console.log(response);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  useLayoutEffect(() => {
    const resizeHandler = () => {
      if (chartContainerRef?.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        let horizontalPadding = 0;
        try {
          const styles = window.getComputedStyle(chartContainerRef.current);
          horizontalPadding =
            parseInt(styles.paddingLeft, 10) +
            parseInt(styles.paddingRight, 10);
        } catch (e) {
          console.error(e);
        }
        setChartWidth(containerWidth - horizontalPadding || 0);
      }
    };

    if (chartContainerRef.current) {
      resizeHandler();

      const debouncedResizeHandler = debounce(resizeHandler);

      window.addEventListener("resize", debouncedResizeHandler);
      return () => window.removeEventListener("resize", debouncedResizeHandler);
    }
  }, []);

  useEffect(() => {
    getTrendData();
  }, []);

  return (
    <>
      <Stack>
        <h1 className="ms-fontSize-42">D3 Demo - Google Trends</h1>
        <Stack.Item>
          <Stack horizontal wrap tokens={horizontalGapStackTokens}>
            <Stack.Item styles={stackItemStyles}>
              <SearchBox
                placeholder="Search 1"
                value={searchWord1}
                onChange={(e) => setSearchWord1(e?.target.value || "")}
              />
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
              <SearchBox
                placeholder="Search 2"
                value={searchWord2}
                onChange={(e) => setSearchWord2(e?.target.value || "")}
              />
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
              <SearchBox
                placeholder="Search 3"
                value={searchWord3}
                onChange={(e) => setSearchWord3(e?.target.value || "")}
              />
            </Stack.Item>
            <Stack.Item styles={stackItemStyles}>
              <SearchBox
                placeholder="Search 4"
                value={searchWord4}
                onChange={(e) => setSearchWord4(e?.target.value || "")}
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <PrimaryButton
            text="Search"
            onClick={getTrendData}
            styles={buttonStyles}
          />
        </Stack.Item>
      </Stack>
      <Stack className="charts" horizontal>
        <Stack.Item className="ms-sm12 ms-md12 ms-lg6 ms-depth-4">
          <div ref={chartContainerRef}>
            {data.points?.length && data.labels?.length && chartWidth && (
              <ReactRenderedBarChart
                labels={data.labels}
                data={data.points[data.points.length - 1]}
                width={chartWidth}
              />
            )}
          </div>
        </Stack.Item>
        <Stack.Item className="ms-sm12 ms-md12 ms-lg6 ms-depth-4">
          {chartWidth && (
            <D3RenderedLineChart
              labels={data.labels}
              data={data.points}
              width={chartWidth}
            />
          )}
        </Stack.Item>
      </Stack>
    </>
  );
};

/*
<IconButton
            iconProps={{ iconName: "Search" }}
            title="Search"
            ariaLabel="Search"
            onClick={onSearch}
          />


          const buttonStyles = {
  root: {
    marginTop: "20px",
    selectors: {
      `.@media()`
    }
  },
};

                <Stack horizontal wrap tokens={horizontalGapStackTokens}>
        <Stack.Item styles={chartStackItemStyles}>

        </Stack.Item>
        <Stack.Item styles={chartStackItemStyles}>

        </Stack.Item>
      </Stack>
*/
