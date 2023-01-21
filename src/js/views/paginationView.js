import * as icons from "../../img/sprite.svg";

export default class PaginationView {
  constructor(parentView, name) {
    this._parentView = parentView;
    this._parentElement = parentView.container;
    this._name = name;
  }

  handlerClick(handler, e) {
    // console.log(e);

    const btn = e.target.closest("#pagination-search > .btn");
    if (!btn || btn.classList.contains("btn--disabled")) return;
    if (btn.classList.contains("pagination__previous")) handler(false, -1);
    if (btn.classList.contains("pagination__next")) handler(false, 1);
    this._parentElement.scrollIntoView(true);
  }

  _clear() {
    this._pagination?.remove();
  }

  render(data) {
    this._clear();
    const html = `
    <div class="pagination" id="pagination-search" data-${this._name}>
      <button class="pagination__previous btn ${data.currentPage === 1 ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-left-thick"></use>
        </svg>
      </button>
      <p class="pagination__current-page">Current page: <span class="pagination__page">${data.currentPage}</span></p>
      <button class="pagination__next btn ${data.currentPage === data.totalPages ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-right-thick"></use>
        </svg>
      </button>
    </div>
    `;

    this._parentElement.insertAdjacentHTML("beforeend", html);
    this._pagination = this._parentElement.querySelector(".pagination");
  }
}
