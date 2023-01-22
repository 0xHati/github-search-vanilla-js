import openIssuesView from "./openIssuesView";
import ChartView from "./chartView";
import icons from "url:../../img/sprite.svg";
import { formatNumber } from "../helper";
import ActivitiesView from "./activitiesView";
import OpenIssuesView from "./openIssuesView";

class RepositoryView {
  constructor() {
    this._parentElement = document.querySelector("main");

    // container
    this._container = document.createElement("div");
    this._container.classList.add("repository-container");
    // main content area
    this._mainContent = document.createElement("div");
    this._mainContent.classList.add("main-content");
    // sidebar area
    this._sideBar = document.createElement("div");
    this._sideBar.classList.add("sidebar");
  }

  render(data) {
    this._clear();
    // render info
    let html = "";
    html += this._generateRepositoryInfoMarkup(data);
    this._mainContent.insertAdjacentHTML("afterbegin", html);
    // render chart
    // render _sidebar
    this._chartView = new ChartView(this._mainContent);
    this._chartView.render(data);
    // sidebar.render()
    // activties
    this._activiesView = new ActivitiesView(this._sideBar);
    this._activiesView.render("");

    //open issues
    this._openIssuesView = new OpenIssuesView(this._sideBar);
    this._openIssuesView.render("");

    this._parentElement.appendChild(this._container);
    this._container.appendChild(this._mainContent);
    this._container.appendChild(this._sideBar);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _generateRepositoryInfoMarkup(data) {
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
        <div class="repository__stat">120 open issues</div>
        <div class="repository__stat">35% health score</div>
      </div>
    </div>
    `;
  }
}

export default new RepositoryView();
