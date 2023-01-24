import { Chart, ChartArea } from "chart.js/auto";
import { en } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import View from "./view";

export default class ChartView extends View {
  constructor(parentElement) {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("chart");

    this._parentElement = parentElement;
    this._parentElement.appendChild(this.container);
  }

  //TODO: I want that if I had a handler for an event to the chartview
  // that I dont have to go via the 'parentView' since I would have to make handlers for every parent
  // need to bind the handler from the controller directly to here
  // so the controller needs to know this view
  render(data) {
    super.render();
    this._chart = document.querySelector("#chart-star-history");

    this._loadChart(data);
  }

  // _clear() {
  //   this._parentElement.innerHTML = "";
  // }

  _loadChart(data) {
    //get css vars
    const root = document.querySelector(":root");
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-1");
    const colorSecondary = getComputedStyle(document.documentElement).getPropertyValue("--color-secondary");
    const grad = getComputedStyle(document.documentElement).getPropertyValue("--border-gradient");

    const cfg = {
      type: "line",
      data: {
        datasets: [
          {
            data: data,
            borderWidth: 3,
            pointRadius: 0,
            lineTension: 0.2,
          },
        ],
      },
      options: {
        parsing: false,
        normalized: true,
        animation: false,
        plugins: {
          decimation: {
            enabled: true,
            algorithm: "lttb",
            samples: 50,
          },
          legend: {
            display: false,
          },
        },

        elements: {
          line: {
            borderJoinStyle: "round",
            backgroundColor: borderColor,
            borderColor: this._createGradient(),
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false },
            border: {
              color: borderColor,
            },
            ticks: { color: "#d3e0ee", source: data },
          },
          x: {
            adapters: {
              date: {
                locale: en,
              },
            },
            type: "time",
            time: {
              unit: "month",
              parser: "MMDD,YYYY HH:mm",
            },

            // suggestedMax: Date.now(),
            grid: {
              display: false,
            },
            border: {
              color: borderColor,
            },

            ticks: {
              callback: function (val, index) {
                // Hide every 2nd tick label
                return index % 2 === 0 ? new Date(val).toLocaleDateString(navigator.locale) : "";
              },
              color: "#d3e0ee",
              source: "auto",
              autoSkip: true,
              autoSkipPadding: 30,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      },
    };

    this.chart = new Chart(this._chart, cfg);
    this.chart.render();
    this.chart.options.elements.line.borderColor = this._createGradient();
    this.chart.update();
  }

  _generateMarkup() {
    return `<h3 class="heading-tertiary">Stargazers over time</h3>
    <canvas id="chart-star-history"></canvas>
    `;
  }

  _createGradient() {
    let width, height, gradient;

    if (!this.chart) {
      // This case happens on initial chart load
      return;
    }
    const { ctx, chartArea } = this.chart;
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, "#0C2F6E");

      gradient.addColorStop(0.15, "#0D2D6E");

      gradient.addColorStop(0.3, "#103888");
      gradient.addColorStop(0.5, "#045C8B");

      gradient.addColorStop(0.6, "#0683C6");

      gradient.addColorStop(1, "#25aef8");

      // gradient.addColorStop(1, "#f37f19");
    }

    // gradient.addColorStop(0.3, "#103888");
    // gradient.addColorStop(0.6, "#25aef8");

    return gradient;
  }
}
