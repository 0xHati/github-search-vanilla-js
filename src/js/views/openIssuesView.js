import PaginationView from "./paginationView";
import View from "./view";
import { formatDate, relativeDate } from "../helper";

export default class OpenIssuesView extends View {
  constructor(parentElement) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("sidebar__item", "sidebar__item-issues");
    this._parentElement.appendChild(this.container);
    this._message = "No open issues found.";
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
    return this._generateIssuesMarkup(data);
  }

  _generateIssuesMarkup(data) {
    return ` 
    <h3 class="heading-tertiary">Open issues</h3>
    <ul class="open-issues">
    ${data.map(this._generateIssueMarkup.bind(this)).join("")}  
    </ul>
    `;
  }

  _generateIssueMarkup(issue) {
    return `
    <li class="">
      <a class="link--block open-issues__item" href="${issue.html_url}" target="_blank">
        <img src="${issue.user.avatar_url}" alt="" class="open-issues__user-image" />
        <div class=open-issues__content>
          <div class="open-issues__left">
            <h4 class="open-issues__title">${issue.title}</h4> 
            <div class="open-issues__tags">
              ${issue.labels.map(this._generateLabel.bind(this)).join("")}
            </div>
          </div>
          <div class="open-issues__right">
            <span class="open-issues__date">Last updated ${relativeDate(issue.updated_at)}</span>
            <span class="open-issues__date open-issues__date-open">Open since ${relativeDate(issue.created_at)}</span>
          </div>
        </div>
      </a>  
    </li>`;
  }

  _generateLabel(label) {
    return `
      <span class="open-issues__tag" style="border-color: #${label.color}">${label.name}</span>
    `;
  }
}
