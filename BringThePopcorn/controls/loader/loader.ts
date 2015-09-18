module BtPo.UI {
    export class DataLoaderControl {
        public static url = "/controls/loader/loader.html";
        element: HTMLElement;
        container: HTMLElement;
        content: HTMLElement;

        processed(element, options) {
        }

        ready(element, options) {
            var page = this;
           
            var p = WinJS.Promise.wrap().then(() => {
                WinJSContrib.UI.Application.navigator.closeAllPages();
                Kodi.API.Websocket.init(Kodi.API.currentSettings);
                WinJS.Navigation.history.backstack = [];
            });

            if (options && options.transitionIn) {
                p = p.then(() => {
                    return WinJSContrib.UI.Animation.fadeIn(element);
                });
            }

            p.then(function () {
                return WinJSContrib.UI.Animation.enterGrow(page.content, { easing: WinJSContrib.UI.Animation.Easings.easeOutBack }).then(function () {
                    return WinJS.Promise.join({
                        mintime: WinJS.Promise.timeout(1000),
                        data: Kodi.Data.loadRootData(true)
                    })
                })
            }).then(function (data) {
                document.body.classList.remove("unconnected");
                Kodi.NowPlaying.init();
                
                return WinJS.Navigation.navigate("/pages/home/home.html", { clearNavigationHistory: true })
            }, function (err) {
                document.body.classList.add("unconnected");
                return WinJS.Navigation.navigate("/pages/startup/startup.html", { clearNavigationHistory: true });
            }).then(function () {
                WinJS.Application.queueEvent({ type: "ServerChanged" });
                page.container.classList.add('exit');
                //return WinJSContrib.UI.afterTransition(page.container);
                return WinJS.Promise.timeout(700);
            }).then(function () {
                $(page.element).remove();
                (<any>page).dispose();
                currentLoader = null;
            });
        }
    }

    export var DataLoader = <any>WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);
    var currentLoader = null;
    DataLoader.showLoader = function (transitionIn, startupArgs) {
        if (currentLoader)
            return;

        var e = <HTMLElement>document.createElement("DIV");
        e.className = "page-loader-wrapper";
        if (transitionIn)
            e.style.opacity = '0';

        document.body.appendChild(e);
        var loader = new BtPo.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
        currentLoader = loader;
    }
}
