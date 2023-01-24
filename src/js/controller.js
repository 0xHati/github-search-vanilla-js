import searchView from "./views/searchView";
import SearchResultView from "./views/searchResultView";
import * as model from "./model";
import PaginationView from "./views/paginationView";
import RepositoryView from "./views/repositoryView";

//these are the pages of the site
let searchResultView;
let repositoryView;

const controlSearchResults = async function (page = 0, isNewSearch = false) {
  console.log(isNewSearch);
  if (isNewSearch) {
    searchView.renderSearchBarTop();
    searchResultView = new SearchResultView();
    searchResultView.addHandlerPagination(controlSearchResults);
    searchResultView.addHandlerSort(controlSort);
    searchResultView.addHandlerSelectRepository(controlSelectRepository);
    searchResultView.renderSpinner("big");

    const query = searchView.getQuery();
    if (query === "") return;
    try {
      await model.searchRepositories(query);
    } catch (err) {
      console.error(err);
    }
  }
  if (!isNewSearch) {
    await model.searchRepositories(model.state.search.query, model.state.search.currentPage + page, model.state.search.sort, false);
  }

  searchResultView.render(model.state.search);
};

//TODO: is controlSearchResult
const controlSort = async function (sort) {
  searchResultView.renderSpinner("big");
  await model.searchRepositories(model.state.search.query, 1, sort);
  searchResultView.render(model.state.search);
};

const controlSelectRepository = async function (owner, name) {
  repositoryView = new RepositoryView();
  repositoryView.render();
  repositoryView._activiesView.renderSpinner();
  repositoryView._issuesView.renderSpinner();
  repositoryView._chartView.renderSpinner();

  try {
    await model.getRepository(owner, name).then(() => repositoryView.renderInfo(model.state.repository.data));
    await model.searchIssues(model.state.repository.issues.currentPage).then(() => repositoryView.renderIssues(model.state.repository.issues));
    await model
      .searchRecentActivity(model.state.repository.recentActivity.currentPage)
      .then(() => repositoryView.renderActivities(model.state.repository.recentActivity));
    await model.fetchRepoHistory().then(() => repositoryView.renderChart(model.state.repository.history));
  } catch (err) {
    console.error(err);
  }

  repositoryView._activiesView.addHandlerPagination(controlActivities);
  repositoryView._issuesView.addHandlerPagination(controlIssues);

  // render respository overview
  // repositoryView.render()
};

const controlActivities = async function (page) {
  repositoryView._activiesView.renderSpinner();
  await model.searchRecentActivity(model.state.repository.recentActivity.currentPage + page);
  repositoryView._activiesView.render(model.state.repository.recentActivity);
};

const controlIssues = async function (page) {
  repositoryView._issuesView.renderSpinner();

  await model.searchIssues(model.state.repository.issues.currentPage + page);
  repositoryView._issuesView.render(model.state.repository.issues);
};

const init = function () {
  // model.loadState();
  searchView.addHandlerSearch(controlSearchResults);

  //TODO: can use the controlSearch because a new page is basically a new search,
  // set parameter newSearch to False to make a check in the funciton
};

init();
