var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var DataLoaderControl = (function () {
            function DataLoaderControl() {
            }
            DataLoaderControl.prototype.processed = function (element, options) {
            };
            DataLoaderControl.prototype.ready = function (element, options) {
                var page = this;
                var p = WinJS.Promise.wrap().then(function () {
                    WinJSContrib.UI.Application.navigator.closeAllPages();
                    Kodi.API.Websocket.init(Kodi.API.currentSettings);
                    WinJS.Navigation.history.backstack = [];
                });
                if (options && options.transitionIn) {
                    p = p.then(function () {
                        return WinJSContrib.UI.Animation.fadeIn(element);
                    });
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
                    Kodi.Data.showHideMenus();
                    return WinJS.Navigation.navigate("/pages/home/home.html", { clearNavigationHistory: true });
                }, function (err) {
                    document.body.classList.add("unconnected");
                    return WinJS.Navigation.navigate("/pages/startup/startup.html", { clearNavigationHistory: true });
                }).then(function () {
                    WinJS.Application.queueEvent({ type: "ServerChanged" });
                    WinJS.UI.Animation.fadeOut(page.message);
                    page.container.classList.add('exit');
                    //return WinJSContrib.UI.afterTransition(page.container);
                    return WinJS.Promise.timeout(700);
                }).then(function () {
                    $(page.element).remove();
                    page.dispose();
                    currentLoader = null;
                });
            };
            DataLoaderControl.url = "/controls/loader/loader.html";
            return DataLoaderControl;
        })();
        UI.DataLoaderControl = DataLoaderControl;
        UI.DataLoader = WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);
        var currentLoader = null;
        UI.DataLoader.showLoader = function (transitionIn, startupArgs) {
            if (currentLoader)
                return;
            var e = document.createElement("DIV");
            e.className = "page-loader-wrapper";
            if (transitionIn)
                e.style.opacity = '0';
            document.body.appendChild(e);
            var loader = new BtPo.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
            currentLoader = loader;
        };
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=loader.js.map