import View from "./view";

class SearchView extends View {
  _searchForm = document.querySelector(".search");
  _searchBar = document.querySelector(".searchbar-container--center");

  getQuery() {
    return this._searchForm.querySelector(".search__input").value;
  }

  addHandlerSearch(handler) {
    this._searchForm.addEventListener("submit", this._handlerSearch.bind(this, handler, true));
  }

  _handlerSearch(handler, newSearch, e) {
    e.preventDefault();
    // TODO: now the searchbar will be moved to top independently if it's a valid search
    handler(newSearch);
  }

  renderSearchBarTop() {
    this._searchBar.classList.remove(`searchbar-container--center`);
    this._searchBar.classList.add("searchbar-container--top", "navbar");
  }
}

export default new SearchView();
