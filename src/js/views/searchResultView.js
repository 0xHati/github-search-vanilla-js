import icons from "url:../../img/sprite.svg";
import { formatNumber } from "../helper";
import PaginationView from "./paginationView";

class SearchResult {
  _parentElement = document.querySelector("main");

  container = document.createElement("div");

  constructor() {
    this.container.classList.add("searchresult");
  }

  addHandlerSelectRepository(handler) {
    this.container.addEventListener("click", function (e) {
      const repositoryItem = e.target.closest(".searchresult__item");
      if (!repositoryItem) return;
      console.log(repositoryItem);

      handler(repositoryItem.dataset.owner, repositoryItem.dataset.name);
    });
  }

  addHandlerSort(handler) {
    this.container.addEventListener("click", this._handlerSort.bind(this, handler));
  }

  addHandlerPagination(handler) {
    this.container.addEventListener("click", this._handlerPagination.bind(this, handler));
  }

  _handlerPagination(handler, e) {
    this._paginationView.handlerClick(handler, e);
  }

  _handlerSort(handler, e) {
    const itemSelected = e.target.closest("#searchresult-sort > li");

    if (!itemSelected || this._searchSelected.textContent === itemSelected.textContent) return;
    handler(itemSelected.dataset.search);
  }

  render(data) {
    console.log(data);
    this._clear();
    let html = "";
    html += this._generateMarkupInfo(data.totalCount);
    html += this._generateMarkupList(data.currentPageResult);

    this._parentElement.appendChild(this.container);
    this.container.insertAdjacentHTML("afterbegin", html);
    this._paginationView = new PaginationView(this, "search");
    this._paginationView.render(data);

    this._searchSort = document.querySelector("#searchresult-sort");
    this._searchSelected = document.querySelector(".dropdown__default");
    this._selectSorted(data.sort);
  }

  _clear() {
    this.container.innerHTML = "";
  }

  _selectSorted(sortMethod) {
    const listItems = this._searchSort.querySelectorAll("li");
    console.log(sortMethod);
    const itemSelected = [...listItems].find((item) => item.dataset.search === sortMethod);
    itemSelected.classList.add("dropdown__item--selected");
    this._searchSelected.textContent = itemSelected.textContent;
  }
  _generateMarkupInfo(totalCount) {
    const formatter = new Intl.NumberFormat(navigator.locale);

    return `
    <div class="searchresult__info">
      <p><span class="searchresult__amount">${formatter.format(totalCount)}</span>&nbsp;repositories found</p>
      <div class="dropdown">
            <div class="searchresult__sort dropdown__label">
              sort: <span class="dropdown__default">best match</span>
              <svg class="dropdown__icon">
                <use href="${icons}#chevron-down"></use>
              </svg>
            </div>
            <ul class="dropdown__list" id="searchresult-sort" role="listbox">
              <li class="dropdown__item" role="listitem" data-search="best-match">best match</li>
              <li class="dropdown__item" role="listitem" data-search="stars">stars</li>
              <li class="dropdown__item" role="listitem" data-search="forks">forks</li>
              <li class="dropdown__item" role="listitem" data-search="help-wanted-issues">help-wanted-issues</li>
              <li class="dropdown__item" role="listitem" data-search="updated">updated</li>
            </ul>
          </div>
    </div>

    `;
  }

  _generateMarkupList(data) {
    return `
    <ul class="searchresult__items">
    ${data.map(this._generateMarkupItem.bind(this)).join("")}
    </ul>`;
  }

  _generateMarkupItem(repository) {
    console.log(repository);
    return `
    <li class="searchresult__item" data-owner="${repository.owner.login}" data-name="${repository.name}">
      <div class="searchresult__item-left">
        <div class="searchresult__title">${repository.full_name}</div>
        <div class="searchresult__description">
        ${repository.description ? repository.description : ""}
        </div>
        <div class="searchresult__repository-info">
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#star"></use>
            </svg>
            <span class="respository__star-count">${formatNumber(repository.stargazers_count)}</span>
          </div>
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#repo-forked"></use>
            </svg>
            <span class="respository__fork-count">${formatNumber(repository.forks)}</span>
          </div>
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#person"></use>
            </svg>
            <span>2.7k</span>
          </div>
        </div>
      </div>
      <div class="searchresult__item-right">
        <div class="repository__element">
          <img
            src="/static/language-icons/${repository.language?.toLowerCase()}-original.svg"
            alt="language icon"
            class="repository__icon repository__icon--big" onError="this.remove();"/>
          <span class="repository__language">${repository.language ? repository.language : ""}</span>
        </div>
      </div>
    </li>
    `;
  }
}

export default new SearchResult();
