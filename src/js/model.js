import { API_TOKEN, API_URL, RES_PER_PAGE, RES_PER_PAGE_SEARCH, DATA_POINTS, MAX_STAR_HISTORY } from "./config";

export let state = {
  search: {
    query: "",
    currentPage: 1,
    result: [],
    currentPageResult: "",
    totalPages: "",
    totalCount: "",
    sort: "best-match",
  },
  repository: {
    data: "",
    recentActivity: {
      currentPage: 1,
      data: {},
    },
    issues: {
      currentPage: 1,
      data: "",
    },
    history: [],
  },
};

export const searchRepositories = async function (query, page = 1, sort = "best-match", newSearch = true) {
  state.search.query = query;
  state.search.currentPage = page;
  state.search.sort = sort;
  if (newSearch) state.search.result = [];

  const data = await makeRequest(
    API_URL + `/search/repositories?q=${state.search.query}&page=${page}&per_page=${RES_PER_PAGE_SEARCH}&sort=${state.search.sort}`
  );

  state.search.totalCount = data.total_count;
  state.search.totalPages = Math.ceil(state.search.totalCount / RES_PER_PAGE);

  state.search.result.push({ page: state.search.currentPage, data: data.items });
  state.search.currentPageResult = data.items;

  saveState();
};

export const getRepository = async function (owner, name) {
  const data = await makeRequest(API_URL + `/repos/${owner}/${name}`);

  state.repository.data = data;
};

export const searchIssues = async function (page = 1) {
  state.repository.issues.currentPage = page;
  const data = await makeRequest(
    API_URL + `/repos/${state.repository.data.owner.login}/${state.repository.data.name}/issues?per_page=${RES_PER_PAGE}&page=${page}`
  );
  state.repository.issues.data = data;
};

export const searchRecentActivity = async function (page = 1) {
  state.repository.recentActivity.currentPage = page;

  const data = await makeRequest(
    API_URL +
      `/repos/${state.repository.data.owner.login}/${state.repository.data.name}/events?per_page=${RES_PER_PAGE}&page=${page}
  `
  );
  state.repository.recentActivity.data = data;
};

export const fetchRepoHistory = async function () {
  const starGazersCount = state.repository.data.stargazers_count; // 200000
  const owner = state.repository.data.owner.login;
  const name = state.repository.data.name;

  const step = Math.ceil(starGazersCount / DATA_POINTS); // 2000
  console.log(step);
  const requestCount = step >= 100 ? 100 : step;

  const urls = [];

  // pag1
  // pag 20 (step / 100 (res per pag))
  // pag 40
  // pag 60

  // tot pag * 100 <= stargazers

  let count = 1;

  for (let i = 1; i <= requestCount; i++) {
    const currentPage = step >= 100 ? Math.floor((step * i) / 100) : i;
    if (currentPage * 100 >= MAX_STAR_HISTORY) {
      break;
    } else {
      urls.push(
        fetch(API_URL + `/repos/${owner}/${name}/stargazers?per_page=100&page=${currentPage}`, {
          headers: {
            accept: "application/vnd.github.star+json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
        })
      );
    }
  }

  // if our steps are greater than 100 we need to get first result of every page and multiply by the current index to get the number of stars
  // if it's less than 100, we have to get the item every x (steps)
  try {
    const data = await Promise.all(urls).then((responses) =>
      Promise.all(
        responses.map((response) => {
          console.log(response);
          if (!response?.ok) {
            console.log(response);
          } else {
            return response.json();
          }
        })
      ).then((response) => {
        if (step >= 100) {
          return response.map((v, i) => {
            console.log(v);
            return {
              x: new Date(v[0].starred_at).getTime(),
              y: i * step,
            };
          });
        } else {
          return response
            .flat(1)
            .filter((v, i) => i % step === 0)
            .map((v, i) => {
              {
                return {
                  x: new Date(v.starred_at).getTime(),
                  y: i * step,
                };
              }
            });
        }
      })
    );

    console.log(data);
    state.repository.history = data;
  } catch (err) {
    throw err;
  }
};

export const getContributors = async function (owner, name) {
  const data = await makeRequest(
    API_URL +
      ` /repos/${owner}/${name}/collaborators
  `
  );
};

const saveState = function () {
  sessionStorage.setItem("state", JSON.stringify(state));
};

export const loadState = function () {
  state = JSON.parse(sessionStorage?.getItem("state")) || state;
};

export function getResultByPage(page) {
  return state.search.result.find((i) => i.page === page);
}

const makeRequest = async function (endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/vnd.github+json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    if (response?.ok) {
      return await response.json();
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    // throw err;
  }
};
