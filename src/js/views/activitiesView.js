import PaginationView from "./paginationView";
import View from "./view";
import { relativeDate } from "../helper";

export default class ActivitiesView extends View {
  constructor(parentElement) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("sidebar__item", "sidebar__item-activities");
    this._parentElement.appendChild(this.container);
    this._message = "No recent activities found.";
  }

  render(data) {
    super.render(data.data);
    if (data.data.length === 0) {
      this.renderMessage(this._message);
    } else {
      this._paginationView = new PaginationView(this.container, false);
      this._paginationView.render(data);
    }
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
      <div class="activities__user">
        <img src="${activity.actor.avatar_url}" class="activities__user-image" />
        <span class="activities__name">${activity.actor.display_login}</span>
      </div>
        <span class="activities__type">${activity.typeText}</span>
        <span class="activities__date">${relativeDate(activity.created_at)}</span>
    </li>
    `;
  }
}
