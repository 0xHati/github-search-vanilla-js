class SearchResult {
  _searchResult = document.querySelector(".searchresult__template");
  _searchResultItems = document.querySelector(".searchresult__items");

  addHandlerRender(handler) {
    _searchResult.addEventListener(load, handler);
  }

  render(data, totalCount) {
    const amount = document.querySelector(".searchresult__amount");

    amount.textContent = totalCount;

    data.forEach((repository) => {
      const clone = this._searchResult.content.cloneNode(true);

      const starCount = clone.querySelector(".respository__star-count");
      const forkCount = clone.querySelector(".respository__fork-count");
      const title = clone.querySelector(".searchresult__title");
      const description = clone.querySelector(".searchresult__description");
      const language = clone.querySelector(".repository__language");
      const languageIcon = clone.querySelector(".repository__language-icon");

      starCount.textContent = repository.stargazers_count;
      forkCount.textContent = repository.forks;
      title.textContent = repository.full_name;
      description.textContent = repository.description;
      language.textContent = repository.language;

      languageIcon.src = `/static/language-icons/${repository.language?.toLowerCase()}-original.svg`;
      languageIcon.onerror = function () {
        this.remove();
        console.log(this);
      };
      this._searchResultItems.appendChild(clone);
    });
  }
}

export default new SearchResult();
