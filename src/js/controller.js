import searchView from "./views/searchView";
import searchResultView from "./views/searchResultView";
import * as model from "./model";

const controlSearchResults = async function () {
  const query = searchView.getQuery();
  if (window.location.pathname != "/result.html") {
    window.location.assign("/result.html");
  }
  await model.searchRepository(query);
  const pageResult = model.getResultByPage(model.state.search.currentPage);
  console.log(model.state.search);
  searchResultView.render(pageResult.data, model.state.search.totalCount);
};

// const controlUpdateState = function () {
//   model.loadState();
// };

const init = function () {
  model.loadState();

  searchView.addHandlerSearch(controlSearchResults);
  searchView.addHandlerPageLoad(controlSearchResults);
};

init();
