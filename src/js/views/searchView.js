import View from "./view";

export default class SearchView extends View {
  _searchForm = document.querySelector(".search");

  getQuery() {
    return this._searchForm.querySelector(".search__input").value;
  }

  addHandlerSearch(handler) {
    this._searchForm.addEventListener("submit", this._handlerSearch.bind(this, handler, true));
  }

  _handlerSearch(handler, newSearch, e) {
    e.preventDefault();
    handler(0, newSearch);
  }
}
