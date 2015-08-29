module KodiPassion.UI {
    export class DataLoaderControl {
        public static url = "/controls/loader/loader.html";
        element: HTMLElement;
        container: HTMLElement;
        content: HTMLElement;

        processed(element, options) {
        }

        ready(element, options) {
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
                    })
                })
            }).then(function (data) {
                document.body.classList.remove("unconnected");
                Kodi.NowPlaying.init();

                return WinJS.Navigation.navigate("/pages/home/home.html")
            }, function (err) {
                document.body.classList.add("unconnected");
                return WinJS.Navigation.navigate("/pages/startup/startup.html");
            }).then(function () {
                page.container.classList.add('exit');
                //return WinJSContrib.UI.afterTransition(page.container);
                return WinJS.Promise.timeout(700);
            }).then(function () {
                $(page.element).remove();
                (<any>page).dispose();
            });
        }
    }

    export var DataLoader = <any>WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);

    DataLoader.showLoader = function (transitionIn, startupArgs) {
        var e = <HTMLElement>document.createElement("DIV");
        e.className = "page-loader-wrapper";
        if (transitionIn)
            e.style.opacity = '0';

        document.body.appendChild(e);
        var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
    }
}
