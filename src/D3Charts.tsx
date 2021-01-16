import React, { FC, useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { IStackItemStyles, IStackTokens, Stack } from "@fluentui/react";
import { ReactRenderedBarChart } from "./components/1-react-rendered-bar-chart/ReactRenderedBarChart";
import { D3RenderedLineChart } from "./components/2-d3-rendered-line-chart/D3RenderedLineChart";
import { getTrendData } from "./api/trend";
import { usePromise } from "./hooks/promise";

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

  const labels = [searchWord1, searchWord2, searchWord3, searchWord4];
  const [isResolving, data, error, refreshData] = usePromise(
    () => getTrendData(labels),
    labels
  );
  useEffect(() => {
    if (data) {
      console.log(data);
    }
    if (error) {
      console.error(error);
    }
  }, [data, error]);

  const [chartWidth, setChartWidth] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resizeHandler() {
      if (chartContainerRef.current) {
        const width = computeChartWidth(chartContainerRef.current);
        setChartWidth(width);
      }
    }

    const id = requestAnimationFrame(() => resizeHandler());
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [setChartWidth, data]);

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
            onClick={refreshData}
            styles={buttonStyles}
          />
        </Stack.Item>
      </Stack>
      {!isResolving && data && (
        <Stack className="charts" horizontal>
          <Stack.Item className="ms-sm12 ms-md12 ms-lg6 ms-depth-4">
            <div ref={chartContainerRef}>
              {chartWidth && (
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
      )}
    </>
  );
};

function computeChartWidth(container: HTMLElement): number {
  const width = container.offsetWidth;
  let padding = 0;
  try {
    const { paddingLeft, paddingRight } = window.getComputedStyle(container);
    padding = parseInt(paddingLeft, 10) + parseInt(paddingRight, 10);
  } catch (e) {
    console.error(e);
  }
  return width - padding || 0;
}

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
