import openIssuesView from "./openIssuesView";
import ChartView from "./chartView";
import icons from "url:../../img/sprite.svg";
import { formatNumber } from "../helper";

class RepositoryView {
  constructor() {
    this._parentElement = document.querySelector("main");
    this.container = document.createElement("div");
    this.container.classList.add("main-content");
  }

  render(data) {
    this._clear();
    // render info
    let html = "";
    html += this._generateRepositoryInfoMarkup(data);
    this._parentElement.appendChild(this.container);
    this.container.insertAdjacentHTML("afterbegin", html);
    // render chart
    // render sidebar
    this.chartView = new ChartView(this._parentElement);
    // sidebar.render()
    // chartView.render()
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _generateRepositoryInfoMarkup(data) {
    console.log(data);
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
