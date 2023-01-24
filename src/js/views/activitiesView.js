import PaginationView from "./paginationView";
import View from "./view";
import { formatDate } from "../helper";

export default class ActivitiesView extends View {
  constructor(parentElement) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("sidebar__item", "sidebar__item-activities");
    this._parentElement.appendChild(this.container);
  }

  render(data) {
    super.render(data.data);
    this._paginationView = new PaginationView(this.container, false);
    this._paginationView.render(data);
  }

  addHandlerPagination(handler) {
    this.container.addEventListener("click", this._handlerPagination.bind(this, handler));
  }

  _handlerPagination(handler, e) {
    this._paginationView.handlerClick(handler, e);
  }

  _generateMarkup(data) {
    return this._generateActivitiesMarkup(data);
  }

  _generateActivitiesMarkup(data) {
    return `
      <h3 class="heading-tertiary">Recent Activity</h3>
      <ul class="activities">
       ${data.map(this._generateActivityMarkup.bind(this)).join("")}
      </ul>
    `;
  }

  _generateActivityMarkup(activity) {
    return `
    <li class="activities__item">
      <img src="${activity.actor.avatar_url}" class="activities__user-image" />
      <span class="activities__name">${activity.actor.display_login}</span>
      <span class="activities__type">${activity.type}</span>
      <span class="activities__date">${formatDate(activity.created_at)}</span>
    </li>
    `;
  }
}
