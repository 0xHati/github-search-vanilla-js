import searchView from "./views/searchView";
import searchResultView from "./views/searchResultView";
import * as model from "./model";
import PaginationView from "./views/paginationView";
import repositoryView from "./views/repositoryView";

let paginationViewSearch;

const controlSearchResults = async function (newSearch, page = 0) {
  if (newSearch) {
    const query = searchView.getQuery();
    if (query === "") return;
    searchView.renderSearchBarTop();

    await model.searchRepositories(query);
  }
  if (!newSearch) {
    await model.searchRepositories(model.state.search.query, model.state.search.currentPage + page, model.state.search.sort, false);
  }

  searchResultView.render(model.state.search);
};

//TODO: is controlSearchResult
const controlSort = async function (sort) {
  await model.searchRepositories(model.state.search.query, 1, sort);
  searchResultView.render(model.state.search);
};

const controlSelectRepository = async function (owner, name) {
  await model.getRepository(owner, name);
  repositoryView.render(model.state.repository);

  // render respository overview
  // repositoryView.render()
};

const init = function () {
  model.loadState();
  searchView.addHandlerSearch(controlSearchResults);
  searchResultView.addHandlerPagination(controlSearchResults);

  searchResultView.addHandlerSort(controlSort);
  searchResultView.addHandlerSelectRepository(controlSelectRepository);

  //TODO: can use the controlSearch because a new page is basically a new search,
  // set parameter newSearch to False to make a check in the funciton
};

init();
