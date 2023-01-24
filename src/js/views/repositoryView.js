import openIssuesView from "./openIssuesView";
import ChartView from "./chartView";
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
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  render() {
    // render info

    this._clear();
    window.scrollTo(0, 0), { "scroll-behavior": "auto" };

    this._parentElement.appendChild(this.container);

    this.container.appendChild(this._mainContent);
    this.container.appendChild(this._sideBar);
  }

  renderInfo(data) {
    let html = "";
    html += this._generateInfoMarkup(data);
    this._mainContent.insertAdjacentHTML("afterbegin", html);
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
      <h1 class="repository__title">${data.full_name}</h1>
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
          <use href="${icons}#person"></use>
          </svg>
          <span>2.7k</span>
        </div>
      </div>
        <div class="repository__stat">${data.open_issues_count} open issues</div>
        <div class="repository__stat">35% health score</div>
      </div>
    </div>
    `;
  }
}
