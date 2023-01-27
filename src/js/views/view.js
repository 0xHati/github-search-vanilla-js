import icons from "url:../../img/sprite.svg";

export default class View {
  // has always access to parentElement, and container

  render(data) {
    // to make data accessible in the child views

    this._data = data;
    const html = this._generateMarkup(data);
    this._clear();
    this._parentElement.appendChild(this.container);

    this.container.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this.container.innerHTML = "";
  }

  renderSpinner(size = "normal") {
    this._clear();
    this.container.insertAdjacentHTML("afterbegin", this._renderSpinner(size));
  }

  _renderSpinner(size) {
    return `
      <div class="spinner spinner--${size}">
        <svg>
          <use href="${icons}#loader"></use>
        </svg>
      </div>
    `;
  }

  renderMessage(message) {
    this._clear();
    const html = `
    <p class="info-message">${message}</p>
    `;
    this.container.insertAdjacentHTML("beforeend", html);
  }
}
