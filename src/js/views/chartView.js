import { Chart, ChartArea } from "chart.js/auto";
import { en } from "date-fns/locale";
import "chartjs-adapter-date-fns";
import View from "./view";
import icons from "url:../../img/sprite.svg";

export default class ChartView extends View {
  constructor(parentElement) {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("chart");

    this._parentElement = parentElement;
    this._parentElement.appendChild(this.container);
    this._darkmodeButton = document.querySelector(".menu__darkmode-btn");
    this._darkmodeButton.addEventListener("click", this.handleSwitchThemeEvent.bind(this));

    this._message = "Nothing to show here";
  }

  render(data) {
    super.render(data);
    this._chart = document.querySelector("#chart-star-history");
    this._loadChart(data.history);
  }

  handleSwitchThemeEvent() {
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-1");
    const colorPrimary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");

    this.chart.options.elements.line.borderColor = this._createGradient();
    this.chart.options.elements.line.backgroundColor = borderColor;
    this.chart.options.scales.y.border.color = borderColor;
    this.chart.options.scales.y.ticks.color = colorPrimary;
    this.chart.options.scales.x.border.color = borderColor;
    this.chart.options.scales.x.ticks.color = colorPrimary;

    this.chart.update();
  }

  _loadChart(data) {
    const formatTooltip = (tooltipItems) => {
      return `${new Date(tooltipItems[0].raw.x).toLocaleDateString(navigator.language)}`;
    };

    const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-1");
    const colorPrimary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");

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
        animation: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: formatTooltip,
            },
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
            ticks: { color: colorPrimary, source: data },
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
            },

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
              color: colorPrimary,
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
    return `
    <div class="chart__header">
      <h3 class="heading-tertiary chart__title">Stargazers over time</h3>
      ${
        this._data.data.stargazers_count > 40000
          ? `
      <div class="chart__info">
        <svg class="chart__info-icon">
          <use href="${icons}#info"></use>
        </svg>
        <p class="chart__info-message">Github only shows the first 40.000 stargazers.</p>
      </div>`
          : ""
      }
      </div>
    <canvas id="chart-star-history"></canvas>
    `;
  }

  _generateInfoMarkup() {
    ``;
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
    }
    return gradient;
  }
}
