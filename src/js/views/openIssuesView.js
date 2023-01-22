import PaginationView from "./paginationView";
import View from "./view";

export default class OpenIssuesView extends View {
  constructor(parentElement) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("sidebar__item");
  }

  _generateMarkup() {
    return this._generateIssuesMarkup() + this._generatePaginationMarkup("");
  }

  _generateIssuesMarkup(data) {
    return `
    <h3 class="heading-tertiary">Open issues</h3>
    <ul class="open-issues">
      <li class="open-issues__item">
        <div class="open-issues__left">
          <img src="src/img/person.svg" alt="" class="open-issues__user-image" />
        </div>
        <div class="open-issues__content">
          <h4 class="open-issues__title">Lorem ipsum dolor sit amet.</h4>
          <div class="open-issues__description">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit eum atque sunt totam fugiat obcaecati!
          </div>
        </div>
        <div class="open-issues__bottom">
          <div class="open-issues__tags">
            <span class="open-issues__tag">Tag 1</span>
            <span class="open-issues__tag">Tag 2</span>
            <span class="open-issues__tag">Tag 3</span>
          </div>
          <div class="open-issues__dates">
            <span class="open-issues__date">Created at: 14/01/2022</span>
            <span class="open-issues__date">Last updated at: 14/01/2022</span>
          </div>
        </div>
      </li>
      <li class="open-issues__item">
        <div class="open-issues__left">
          <img src="src/img/person.svg" alt="" class="open-issues__user-image" />
        </div>
        <div class="open-issues__content">
          <h4 class="open-issues__title">Lorem ipsum dolor sit amet.</h4>
          <div class="open-issues__description">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit eum atque sunt totam fugiat obcaecati!
          </div>
        </div>
        <div class="open-issues__bottom">
          <div class="open-issues__tags">
            <span class="open-issues__tag">Tag 1</span>
            <span class="open-issues__tag">Tag 2</span>
            <span class="open-issues__tag">Tag 3</span>
          </div>
          <div class="open-issues__dates">
            <span class="open-issues__date">Created at: 14/01/2022</span>
            <span class="open-issues__date">Last updated at: 14/01/2022</span>
          </div>
        </div>
      </li>
    </ul>
    `;
  }

  _generatePaginationMarkup(data) {
    this._paginationView = new PaginationView(this.container, false);
    return this._paginationView.getMarkup(data);
  }
}
