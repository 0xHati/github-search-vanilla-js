export default class ChartView {
  constructor(parentElement) {
    this._container = document.createElement("div");
    this._container.classList.add("chart");
    this._parentElement = parentElement;
    this.render("");
  }

  //TODO: I want that if I had a handler for an event to the chartview
  // that I dont have to go via the 'parentView' since I would have to make handlers for every parent
  // need to bind the handler from the controller directly to here
  // so the controller needs to know this view
  render(data) {
    this._clear();
    let html = "";
    html += this._generateMarkupChartStarHistory(data);
    this._parentElement.appendChild(this._container);

    this._container.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this._container.innerHTML = "";
  }

  _generateMarkupChartStarHistory(data) {
    return `
    <canvas id="chart-star-history"></canvas>
    `;
  }
}
