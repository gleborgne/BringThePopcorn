var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var DataLoaderControl = (function () {
            function DataLoaderControl() {
            }
            DataLoaderControl.prototype.ready = function (element, options) {
                var page = this;
                WinJSContrib.UI.Application.navigator.closeAllPages();
                Kodi.API.Websocket.init(Kodi.API.currentSettings);
                return WinJS.Promise.join({
                    mintime: WinJS.Promise.timeout(1000),
                    data: Kodi.Data.loadRootData(true)
                }).then(function (data) {
                    document.body.classList.remove("unconnected");
                    Kodi.NowPlaying.init();
                    return WinJS.Navigation.navigate("/pages/home/home.html");
                }, function (err) {
                    document.body.classList.add("unconnected");
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                }).then(function () {
                    return WinJS.UI.Animation.exitPage(page.element).then(function () {
                        $(page.element).remove();
                    });
                });
            };
            DataLoaderControl.url = "/controls/loader/loader.html";
            return DataLoaderControl;
        })();
        UI.DataLoaderControl = DataLoaderControl;
        UI.DataLoader = WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);
        UI.DataLoader.showLoader = function (transitionIn, startupArgs) {
            var e = document.createElement("DIV");
            e.className = "page-loader-wrapper";
            document.body.appendChild(e);
            var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
        };
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=loader.js.map