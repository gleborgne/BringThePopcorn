var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var DataLoaderControl = (function () {
            function DataLoaderControl() {
            }
            DataLoaderControl.prototype.processed = function (element, options) {
            };
            DataLoaderControl.prototype.ready = function (element, options) {
                var page = this;
                WinJSContrib.UI.Application.navigator.closeAllPages();
                Kodi.API.Websocket.init(Kodi.API.currentSettings);
                WinJS.Navigation.history.backstack = [];
                var p = WinJS.Promise.wrap();
                if (options && options.transitionIn) {
                    p = WinJSContrib.UI.Animation.fadeIn(element);
                }
                p.then(function () {
                    return WinJSContrib.UI.Animation.enterGrow(page.content, { easing: WinJSContrib.UI.Animation.Easings.easeOutBack }).then(function () {
                        return WinJS.Promise.join({
                            mintime: WinJS.Promise.timeout(1000),
                            data: Kodi.Data.loadRootData(true)
                        });
                    });
                }).then(function (data) {
                    document.body.classList.remove("unconnected");
                    Kodi.NowPlaying.init();
                    return WinJS.Navigation.navigate("/pages/home/home.html");
                }, function (err) {
                    document.body.classList.add("unconnected");
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                }).then(function () {
                    page.container.classList.add('exit');
                    //return WinJSContrib.UI.afterTransition(page.container);
                    return WinJS.Promise.timeout(700);
                }).then(function () {
                    $(page.element).remove();
                    page.dispose();
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
            if (transitionIn)
                e.style.opacity = '0';
            document.body.appendChild(e);
            var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
        };
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=loader.js.map