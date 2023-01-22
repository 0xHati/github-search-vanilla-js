import PaginationView from "./paginationView";
import View from "./view";

export default class ActivitiesView extends View {
  constructor(parentElement) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("sidebar__item");
  }

  _generateMarkup() {
    return this._generateActivitiesMarkup() + this._generatePaginationMarkup("");
  }

  _generatePaginationMarkup(data) {
    this._paginationView = new PaginationView(this.container, false);
    return this._paginationView.getMarkup(data);
  }

  _generateActivitiesMarkup(data) {
    return `
      <h3 class="heading-tertiary">Recent Activity</h3>
      <ul class="activities">
        <li class="activities__item">
          <img src="src/img/person.svg" class="activities__user-image" />
          <span class="activities__name">John Doe</span>
          <span class="activities__type">commit</span>
          <span class="activities__date">14/01/2022</span>
        </li>
        <li class="activities__item">
          <img src="src/img/person.svg" class="activities__user-image" />
          <span class="activities__name">John Doe</span>
          <span class="activities__type">commit</span>
          <span class="activities__date">14/01/2022</span>
        </li>
      </ul>
    `;
  }
}
