import ChartView from "./chartView";
import { Chart, ChartArea } from "chart.js/auto";

import icons from "url:../../img/sprite.svg";
import { formatNumber } from "../helper";
import ActivitiesView from "./activitiesView";
import OpenIssuesView from "./openIssuesView";
import View from "./view";

export default class RepositoryView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector("main");
    this._parentElement.innerHTML = "";

    // container
    this.container = document.createElement("div");
    this.container.classList.add("repository-container");
    // main content area
    this._mainContent = document.createElement("div");
    this._mainContent.classList.add("main-content");
    // sidebar area
    this._sideBar = document.createElement("div");
    this._sideBar.classList.add("sidebar");

    this._chartView = new ChartView(this._mainContent);
    this._activiesView = new ActivitiesView(this._sideBar);
    this._issuesView = new OpenIssuesView(this._sideBar);

    const colorPrimary = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");

    Chart.defaults.font.family = "Poppins";
    Chart.defaults.color = colorPrimary;

    this._darkmodeButton = document.querySelector(".menu__darkmode-btn");
    this._darkmodeButton.addEventListener("click", this.handleSwitchThemeEvent.bind(this));
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  render() {
    this._clear();
    this._parentElement.appendChild(this.container);

    this.container.appendChild(this._mainContent);
    this.container.appendChild(this._sideBar);
  }

  renderInfo(data) {
    let html = "";
    html += this._generateInfoMarkup(data.data);
    this._mainContent.insertAdjacentHTML("afterbegin", html);
    this._renderLanguagesChart(data.languages);
  }

  _generateColor() {
    return "hsl(" + 360 * Math.random() + "," + (25 + 70 * Math.random()) + "%," + "50%)";
  }

  handleSwitchThemeEvent() {
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");

    this.languagesChart.update();
  }

  _renderLanguagesChart(data) {
    const formatTooltip = (tooltipItems) => {
      return `${+tooltipItems.raw.toFixed(0)}%`;
    };

    this._languagesChart = document.querySelector("#languages-chart");
    const parsedData = [];
    const borderRadius = 5;
    const borderRadiusLeft = { topLeft: borderRadius, bottomLeft: borderRadius };

    const borderRadiusRight = { topLeft: borderRadius, bottomLeft: borderRadius, topRight: borderRadius, bottomRight: borderRadius };

    let sum = 0;
    for (const [key, value] of Object.entries(data)) {
      const color = this._generateColor();
      if (value >= 5) {
        if (value > 99) {
          parsedData.push({
            label: key,
            data: [100],
            borderColor: color,
            backgroundColor: color,
            borderRadius: borderRadiusRight,
          });
          break;
        } else {
          parsedData.push({
            label: key,
            data: [value],
            borderColor: color,
            backgroundColor: color,
          });
        }
      }
      if (value < 5) {
        sum += value;
      }
    }
    //add others finally
    const color = this._generateColor();
    console.log(parsedData);
    console.log(parsedData[0].data[0] === 100);
    if (parsedData[0].data[0] !== 100) {
      parsedData.push({
        label: "other",
        data: [sum],
        borderColor: color,
        backgroundColor: color,
        borderRadius: borderRadiusRight,
      });
    }

    if (parsedData.length === 0) {
      console.log("e");
      parsedData[0].borderRadius = borderRadius;
      parsedData[0].borderSkipped = false;
    } else {
      //set border on the first item
      parsedData[0].borderRadius = borderRadius;
      parsedData[0].borderSkipped = false;
    }

    const cfg = {
      type: "bar",
      data: {
        labels: [""],
        datasets: parsedData,
      },
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              useBorderRadius: true,
              borderRadius: borderRadius,
            },
          },
          tooltip: {
            callbacks: {
              label: formatTooltip,
            },
          },
          layout: {
            autoPadding: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
            beginAtZero: true,
          },
          y: {
            stacked: true,
            grid: {
              display: false,
              drawTicks: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },

            beginAtZero: true,
          },
        },
      },
    };

    this.languagesChart = new Chart(this._languagesChart, cfg);
    this.languagesChart.render();
  }

  renderChart(data) {
    this._chartView.render(data);
  }

  renderActivities(data) {
    this._activiesView.render(data);
  }

  renderIssues(data) {
    this._issuesView.render(data);
  }

  _generateInfoMarkup(data) {
    return `
    <div class="repository">
      <div class="repository__header">
        <a href="${data.html_url}" class="repository__link" target="_blank">
          <svg class="repository__icon repository__icon-small">
              <use href="${icons}#github"></use>
            </svg>
        </a>  
        <h1 class="repository__title">${data.full_name}</h1>
      </div>
      
      <p class="repository__description">
      ${data.description ? data.description : ""}
      </p>
      <div class="repository__stats">
        <div class="repository__block">
        <div class="repository__element">
          <svg class="repository__icon">
          <use href="${icons}#star"></use>
          </svg>
          <span>${formatNumber(data.stargazers_count)}</span>
        </div>
        <div class="repository__element">
          <svg class="repository__icon">
          <use href="${icons}#repo-forked"></use>
          </svg>
          <span>${formatNumber(data.forks)}</span>
        </div>
        <div class="repository__element">
          <svg class="repository__icon">
          <use href="${icons}#view-show"></use>
          </svg>
          <span class="respository__watch-count">${formatNumber(data.watchers)}</span>
        </div>
      </div>
        <div class="repository__stat">${data.open_issues_count} open issues</div>
        <div class="repository__stat">Topics: ${data.topics.join(", ")}</div>
      </div>
      <div class="repository__languages">
      <canvas id="languages-chart"></canvas>
      </div>
    </div>
    `;
  }

  _generateMarkupTopic(topic) {
    return `
    <div class="repository__stat">${topic}</div>
    `;
  }
}
