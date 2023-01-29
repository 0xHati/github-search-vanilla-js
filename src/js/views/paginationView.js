import * as icons from "../../img/sprite.svg";
import View from "./view";

export default class PaginationView extends View {
  constructor(parentElement, showCurrentPage = true) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("pagination");
    this._showCurrentPage = showCurrentPage;
    this._parentElement.appendChild(this.container);
  }

  handlerClick(handler, e) {
    const btn = e.target.closest(".pagination > .btn");
    if (!btn || btn.classList.contains("btn--disabled")) return;
    if (btn.classList.contains("pagination__previous")) handler(-1);
    if (btn.classList.contains("pagination__next")) handler(1);
    this.scroll(e);
  }

  scroll(e) {
    const parent = e.target.closest(".pagination");
    console.dir(parent);
    parent.scrollIntoView(true);
  }

  _generateMarkup(data) {
    return `
      <button class="pagination__previous btn ${data.currentPage === 1 ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-left-thick"></use>
        </svg>
      </button>
      ${
        this._showCurrentPage ? `<p class="pagination__current-page">Current page: <span class="pagination__page">${data.currentPage}</span></p>` : ""
      }     
      <button class="pagination__next btn ${data.currentPage === data.totalPages ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-right-thick"></use>
        </svg>
      </button>
    `;
  }
}
