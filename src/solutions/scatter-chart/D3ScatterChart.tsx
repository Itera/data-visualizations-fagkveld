/*
function drawScatterChart(
  chartElements: ChartElements,
  scales: Scales,
  data: ScatterPlotData[],
  units: Record<string, string>,
  dataPointRadius: number,
  selectedTab: AnalyticsName,
  // eslint-disable-next-line
  updateSelectedCutting: (dataOrEvent: any) => void,
  setTooltipInfo: React.Dispatch<React.SetStateAction<Tooltip>>,
  setHighlightedDepth: React.Dispatch<React.SetStateAction<number | undefined>>
) {
  chartElements.dataContainer
    .selectAll("circle")
    .data(
      data,
      (d) => (d as ScatterPlotData).depth + "-" + (d as ScatterPlotData).key
    )
    .join(
      (enter) =>
        // @ts-ignore
        enter
          .append("circle")
          .on("click", updateSelectedCutting)
          .on("mouseover", (e, d) => {
            setHighlightedDepth(d.depth);
            onMouseOverScatter(e, d, dataPointRadius, setTooltipInfo, units);
          })
          .on("mouseout", (e) => {
            setHighlightedDepth(undefined);
            onMouseOutScatter(e, dataPointRadius, setTooltipInfo);
          })
          .attr("r", dataPointRadius)
          // @ts-ignore
          .attr("cx", (d) => scales.x(d.value))
          // @ts-ignore
          .attr("cy", (d) => scales.yPoint(d.depth))
          .attr("fill", (d) => getElementColor(d.key, selectedTab))
          .attr("opacity", 0)
          .call((_enter) => _enter.transition().attr("opacity", 1)),
      (update) =>
        update.call((_update) =>
          // @ts-ignore
          _update
            .on("click", updateSelectedCutting)
            .on("mouseover", (e, d) => {
              setHighlightedDepth(d.depth);
              onMouseOverScatter(e, d, dataPointRadius, setTooltipInfo, units);
            })
            .on("mouseout", (e) => {
              setHighlightedDepth(undefined);
              onMouseOutScatter(e, dataPointRadius, setTooltipInfo);
            })
            .transition()
            .attr("r", dataPointRadius)
            // @ts-ignore
            .attr("cx", (d) => scales.x(d.value))
            // @ts-ignore
            .attr("cy", (d) => scales.yPoint(d.depth))
            .attr("fill", (d) => getElementColor(d.key, selectedTab))
        ),
      (exit) =>
        exit.call((_exit) => _exit.transition().attr("opacity", 0).remove())
    );
}
*/
export const test = 12;
