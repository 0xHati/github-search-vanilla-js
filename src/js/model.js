import { API_TOKEN, API_URL, RES_PER_PAGE } from "./config";

export let state = {
  search: {
    query: "",
    currentPage: 1,
    result: [],
    totalPages: "",
    totalCount: "",
  },
};

export const searchRepository = async function (query, page = 1, newSearch = true) {
  state.search.query = query;
  state.search.currentPage = page;
  if (newSearch) state.search.result = [];

  try {
    const response = await fetch(API_URL + `/search/repositories?q=${state.search.query}&page=${page}&per_page=${RES_PER_PAGE}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const data = await response.json();
    state.search.totalCount = data.total_count;
    state.search.totalPages = Math.ceil(state.search.totalCount / RES_PER_PAGE);

    state.search.result.push({ page: state.search.currentPage, data: data.items });

    saveState();
    console.log(state);
  } catch (err) {
    throw err;
  }
};

const saveState = function () {
  sessionStorage.setItem("state", JSON.stringify(state));
};

export const loadState = function () {
  state = JSON.parse(sessionStorage?.getItem("state")) || state;
  console.log("state loaded");
};

export function getResultByPage(page) {
  return state.search.result.find((i) => i.page === page);
}
