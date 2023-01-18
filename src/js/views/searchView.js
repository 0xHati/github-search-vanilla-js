import View from "./view";

class SearchView extends View {
  _searchForm = document.querySelector(".search");

  getQuery() {
    const query = this._searchForm.querySelector(".search__input").value;
    return query;
  }

  addHandlerSearch(handler) {
    this._searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
