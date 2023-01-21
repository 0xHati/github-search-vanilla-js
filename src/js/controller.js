import searchView from "./views/searchView";
import searchResultView from "./views/searchResultView";
import * as model from "./model";
import PaginationView from "./views/paginationView";

let paginationViewSearch;

const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (query === "") return;
  // move searchbar to top
  searchView.renderSearchBarTop();
  // fetch search results
  await model.searchRepository(query);

  //render search reults

  searchResultView.render(model.state.search);

  // render pagination component
  if (model.state.search.totalCount != 0) {
    // otherwise a new event gets added everytime a new search happens
    if (!paginationViewSearch) {
      paginationViewSearch = new PaginationView(searchResultView, "search");
      paginationViewSearch.addHandlerClick(controlPagination);
    }
    paginationViewSearch.render(model.state.search);
  }
};

const controlSort = async function (sort) {
  await model.searchRepository(model.state.search.query, 1, sort);
  searchResultView.render(model.state.search);

  // render pagination component
  if (model.state.search.totalCount != 0) {
    // otherwise a new event gets added everytime a new search happens
    if (!paginationViewSearch) {
      paginationViewSearch = new PaginationView(searchResultView, "search");
      paginationViewSearch.addHandlerClick(controlPagination);
    }
    paginationViewSearch.render(model.state.search);
  }
};

const controlPagination = async function (parentView, paginationView, page) {
  //get new data (current page -+ what we get back from the view)
  // model.getResultByPage(model.state.search.currentPage + page)

  //TODO: need to make modular in future
  console.log(model.state.search.currentPage);
  await model.searchRepository(model.state.search.query, model.state.search.currentPage + page, model.state.search.sort, false);

  //render new results
  // containerView.render();
  parentView.render(model.state.search);
  paginationView.render(model.state.search);

  // update pagination, need a way based on which container or view is calling which data to update, can be with a dataset attribute
  // that dataset attribute can be used in model to identify the correct method that needs to be called
  // function that will be called when  button previous or next is pressed
};

const init = function () {
  model.loadState();
  searchView.addHandlerSearch(controlSearchResults);
  searchResultView.addHandlerSort(controlSort);
};

init();
