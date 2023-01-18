export default class View {
  _test = 0;
  addHandlerPageLoad(handler) {
    window.addEventListener("load", function (e) {
      handler();
    });
  }
}
