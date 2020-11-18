export const test = "no";
/*
import React, { RefObject } from "react";
import * as d3 from "d3";
import moment from "moment";

export interface PriceData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: Date;
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface CandleStickChartConfig {
  priceBadgeColor: string;
  candleBodyColorUp: string;
  candleBodyColorDown: string;
  candleBodyColorMissing: string;
  candleStemColorUp: string;
  candleStemColorDown: string;
  chartGridColor: string;
  chartGridColorHighlight: string;
  chartAxisColor: string;
  margin: Margin;
}

export interface CandleStickChartProps {
  data: PriceData[] | string;
  config?: CandleStickChartConfig;
  chartType: "svg" | "canvas";
}

export interface CandleStickChartState {
  data: PriceData[];
}

function addEventListenerToStopMouseScroll() {
  document.addEventListener("wheel", this.stopMouseScroll, { passive: false }); // Might not be sufficient in all browsers.
}

function addEventListenerToStartMouseScroll() {
  document.removeEventListener("wheel", this.stopMouseScroll);
}

function stopMouseScroll(event: MouseWheelEvent) {
  event.preventDefault();
}
export default class CandleStickChart extends React.Component<
  CandleStickChartProps,
  CandleStickChartState
> {
  timeObservable: any;
  dataSubscription: any;
  dragObservable: any;
  dragSubscription: any;
  scrollObservable: any;
  scrollSubscription: any;

  chartContainerRef: RefObject<HTMLDivElement>;
  chartRef: RefObject<SVGSVGElement>;
  chartWidth: number;
  chartHeight: number;
  chart: d3.Selection<SVGSVGElement, Date, HTMLElement, Date>;
  xAxisGroup: d3.Selection<any, any, any, any>;
  yAxisGroup: d3.Selection<any, any, any, any>;
  contentGroup: d3.Selection<any, any, any, any>;

  width: number;
  height: number;
  margin: Margin;

  startDate: Date;
  endDate: Date;

  selectedData: PriceData[];

  static defaultProps: Partial<CandleStickChartProps> = {
    config: {
      priceBadgeColor: "#56AFDB",
      candleBodyColorUp: "#8CC176",
      candleBodyColorDown: "#B82C0C",
      candleBodyColorMissing: "303030",
      candleStemColorUp: "303030",
      candleStemColorDown: "303030",
      chartGridColor: "909090",
      chartGridColorHighlight: "292929",
      chartAxisColor: "292929",
      margin: {
        top: 20,
        bottom: 60,
        left: 60,
        right: 20,
      },
    },
  };

  constructor(props) {
    super(props);

    const margin = props.config.margin;
    // Should this be the width and height of an inner group element, where all shapes are drawn?
    // Are there groups in canvas?
    this.chartWidth = document.body.clientWidth - margin.left - margin.right;
    this.chartHeight = document.body.clientHeight - margin.top - margin.bottom;

    this.chartContainerRef = React.createRef<HTMLDivElement>();
    this.chartRef = React.createRef<SVGSVGElement>();
  }

  resizeChart = () => {};

  handeZoom = (zoomAmount: any) => {
    let data = this.state.data;
    console.log("Start: ", data[0].date, " End: ", data[data.length - 1].date);

    if (zoomAmount > 0) {
      const newStart = moment(data[0].date).add(1, "year").toDate();
      const newEnd = moment(data[data.length - 1].date)
        .subtract(1, "year")
        .toDate();
      console.log("newStart: ", newStart, " newEnd: ", newEnd);
      this.updateChart(newStart, newEnd);
    } else {
    }
  };

  handleDrag = (dragDistances: any) => {};

  initChart() {
    this.width = document.body.clientWidth;
    this.height = (this.width * 9) / 16;
    this.margin = { top: 40, right: 40, bottom: 40, left: 40 };

    this.chart = d3.select("#chart-svg");
    this.chart.attr("width", this.width).attr("height", this.height);

    this.xAxisGroup = this.chart
      .append("g")
      .attr("transform", `translate(0, ${this.height - this.margin.top})`);

    this.yAxisGroup = this.chart
      .append("g")
      .attr("transform", `translate(${this.margin.left}, 0)`);

    // Data join
    this.contentGroup = this.chart.append("g");

    this.contentGroup
      .selectAll("g")
      .data(this.state.data, (d) => (d as any).key); // , (d) => (d as any).date.getTime()

    console.log(this.contentGroup);

    this.updateChart();
  }

  updateChart(startDate?: Date, endDate?: Date) {
    // NOTE: unique ID can be a combination of ticker and date
    // data only need to update if the axes are changed

    // const startTime = this.startDate.getTime();
    //const endTime = this.endDate.getTime();
    //
    //this.selectedData = this.state.data.filter((priceData) => {
    //    const time = priceData.date.getTime();
    //    return (time >= startTime && time <= endTime);
    //});

    const { margin, width, height } = this;

    // Update the selected data
    let data = this.state.data;
    if (startDate && endDate) {
      data = data.filter(
        (data) =>
          data.date.getTime() > startDate.getTime() &&
          data.date.getTime() < endDate.getTime()
      );
    }

    // Make new scales
    const maxPrice = data
      .map((priceData) => priceData.high)
      .reduce((max, curr) => (curr > max ? curr : max));
    const minPrice = data
      .map((priceData) => priceData.low)
      .reduce((min, curr) => (curr < min ? curr : min));

    const x = d3
      .scaleTime()
      .domain([data[0].date, data[data.length - 1].date])
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([minPrice, maxPrice])
      .range([height - margin.bottom, margin.top]);

    // Update axis
    this.xAxisGroup.call(d3.axisBottom(x));
    this.yAxisGroup.call(d3.axisLeft(y));

    // Update chart content (D3 update pattern)
    // Join new data with old elements, if any
    const dataElements = this.contentGroup
      .selectAll("g")
      .data(data, (d) => (d as any).key);

    console.log("dataElements: ", dataElements);
    console.log("data: ", data);

    // Remove old elements as needed
    dataElements.exit().remove();

    // Update old elements as needed
    dataElements
      .selectAll("line")
      .attr("transform", (d) => `translate(${x((d as any).date)}, 0)`);

    // Create new elements as needed
    dataElements
      .enter()
      .append("line")
      .attr("y1", (d) => y(d.low))
      .attr("y2", (d) => y(d.high))
      .attr("class", "low-high")
      .attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .attr("transform", (d) => `translate(${x(d.date)}, 0)`);

    dataElements
      .enter()
      .append("line")
      .attr("y1", (d) => y(d.open))
      .attr("y2", (d) => y(d.close))
      .attr("stroke", (d) =>
        d.close > d.open
          ? this.props.config.candleBodyColorUp
          : this.props.config.candleStemColorDown
      )
      .attr("stroke-width", 3)
      .attr("transform", (d) => `translate(${x(d.date)}, 0)`);

    console.log(data[0].date, " -> ", x(data[0].date), " = ", margin.left);
    console.log(minPrice, " -> ", y(minPrice), " = ", margin.bottom);

    // this.draw()
  }

  draw() {}

  setData() {
    if (typeof this.props.data === "string") {
      fetch("/apple-price-data.json")
        .then((response) => {
          return response.json();
        })
        .then((priceData) => {
          const parsedPriceData = priceData.map((el, i) => {
            const newEl = {};
            newEl["date"] = new Date(el.date);
            newEl["open"] = parseFloat(el.open);
            newEl["high"] = parseFloat(el.high);
            newEl["low"] = parseFloat(el.low);
            newEl["close"] = parseFloat(el.close);
            newEl["volume"] = parseInt(el.volume, 10);
            newEl["key"] = i;
            return newEl as PriceData;
          });

          this.setState(
            {
              data: parsedPriceData,
            },
            this.initChart
          );
        });
    } else {
      this.setState(
        {
          data: this.props.data,
        },
        this.initChart
      );
    }
  }

  componentDidMount() {
    this.setData();
  }

  componentWillUnmount() {
    this.chartContainerRef.current.removeEventListener(
      "mouseenter",
      addEventListenerToStopMouseScroll
    );
    this.chartContainerRef.current.removeEventListener(
      "mouseleave",
      addEventListenerToStartMouseScroll
    );
    window.removeEventListener("wheel", stopMouseScroll);
    this.unsubscribe();
  }

  unsubscribe = () => {
    this.dataSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
    this.scrollSubscription.unsubscribe();
  };

  render() {
    return (
      <>
        <div id="chart-container">
          {this.props.chartType === "svg" && <svg id="chart-svg"></svg>}
          {this.props.chartType === "canvas" && (
            <canvas id="chart-canvas"></canvas>
          )}
        </div>
        <button onClick={() => this.handeZoom(1)}>Zoom in</button>
        <button onClick={() => this.handeZoom(-1)}>Zoom out</button>
      </>
    );
  }
}
*/
