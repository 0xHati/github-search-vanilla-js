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
}
