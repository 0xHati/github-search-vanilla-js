import SearchResultView from "./views/searchResultView";
import * as model from "./model";
import RepositoryView from "./views/repositoryView";
import NavigationView from "./views/navigationView";
import SearchView from "./views/searchView";

import * as dotenv from "dotenv";

let searchResultView;
let repositoryView;
let navigationView;
let searchView;

const controlSearchResults = async function (page = 0, isNewSearch = false) {
  if (isNewSearch) {
    const query = searchView.getQuery();
    if (query === "") return;

    searchResultView = new SearchResultView();
    navigationView = new NavigationView();
    searchView = navigationView._searchView;
    searchView.addHandlerSearch(controlSearchResults);
    searchResultView.addHandlerPagination(controlSearchResults);
    searchResultView.addHandlerSort(controlSort);
    searchResultView.addHandlerSelectRepository(controlSelectRepository);
    searchResultView.renderSpinner("big");

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
    await model.getRepositoryInfo(owner, name).then(() => repositoryView.renderInfo(model.state.repository));
    await model.searchIssues(model.state.repository.issues.currentPage).then(() => repositoryView.renderIssues(model.state.repository.issues));
    await model
      .searchRecentActivity(model.state.repository.recentActivity.currentPage)
      .then(() => repositoryView.renderActivities(model.state.repository.recentActivity));
    await model.fetchRepoHistory().then(() => repositoryView.renderChart(model.state.repository));
  } catch (err) {
    console.error(err);
  }

  repositoryView._activiesView.addHandlerPagination(controlActivities);
  repositoryView._issuesView.addHandlerPagination(controlIssues);
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

  const matches = window.matchMedia("(prefers-color-scheme: dark)");

  document.documentElement.setAttribute("data-theme", matches ? "dark" : "light");

  const currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  searchView = new SearchView();
  searchView.addHandlerSearch(controlSearchResults);
  navigationView = new NavigationView(false);
};

dotenv.config();
init();
