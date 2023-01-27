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
    languages: "",
    topics: "",
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

export const getRepositoryInfo = async function (owner, repoName) {
  await _getRepository(owner, repoName);
  await _getRepositoryLanguages(owner, repoName);
  await _getRepositoryTopics(owner, repoName);
};

const _getRepository = async function (owner, repoName) {
  const data = await makeRequest(API_URL + `/repos/${owner}/${repoName}`);

  state.repository.data = data;
};

const _getRepositoryLanguages = async function (owner, repoName) {
  const data = await makeRequest(API_URL + `/repos/${owner}/${repoName}/languages`);
  const sum = Object.values(data).reduce(function (sum, item) {
    return (sum += item);
  });

  for (let [key, value] of Object.entries(data)) {
    data[key] = (value / sum) * 100;
  }

  state.repository.languages = data;
};

const _getRepositoryTopics = async function (owner, repoName) {
  const data = makeRequest(API_URL + `/repos/${owner}/${repoName}/topics`);
  state.repository.topics = data;
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
  state.repository.recentActivity.data.map(_updateActivityName.bind(this));
};

const _updateActivityName = function (activity) {
  switch (activity.type) {
    case "CreateEvent":
      return (activity.typeText = `created ${activity.payload.ref_type}`);
    case "DeleteEvent":
      return (activity.typeText = `deleted ${activity.payload.ref_type}`);
    case "ForkEvent":
      return (activity.typeText = "forked");
    case "GollumEvent":
      return (activity.typeText = "wiki page updated/created");
    case "IssueCommentEvent":
      return (activity.typeText = `issue comment ${activity.payload.action}`);
    case "IssuesEvent":
      return (activity.typeText = `issue ${activity.payload.action}`);
    case "MemberEvent":
      return (activity.typeText = `member ${activity.payload.action}`);
    case "PublicEvent":
      return (activity.typeText = "made repo public");
    case "PullRequestEvent":
      return (activity.typeText = `pull request ${activity.payload.number} ${activity.payload.action}`);
    case "PullRequestReviewEvent":
      return (activity.typeText = "pull request review");
    case "PullRequestReviewCommentEvent":
      return (activity.typeText = "pull request review comment");
    case "PullRequestReviewThreadEvent":
      return (activity.typeText = "pull request thread");
    case "PushEvent":
      return (activity.typeText = "commit pushed");
    case "ReleaseEvent":
      return (activity.typeText = `release ${activity.payload.action}`);
    case "SponsorshipEvent":
      return (activity.typeText = `sponsorship event`);

    case "WatchEvent":
      return (activity.typeText = "watching");
  }
};

export const fetchRepoHistory = async function () {
  const starGazersCount = state.repository.data.stargazers_count; // 200000
  const owner = state.repository.data.owner.login;
  const name = state.repository.data.name;

  const step = Math.ceil(starGazersCount / DATA_POINTS); // 2000
  const requestCount = step >= 100 ? 100 : step;

  const urls = [];

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
          if (!response?.ok) {
          } else {
            return response.json();
          }
        })
      ).then((response) => {
        if (step >= 100) {
          return response.map((v, i) => {
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
