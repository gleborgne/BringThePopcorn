module KodiPassion.UI {
    export class DataLoaderControl {
        public static url = "/controls/loader/loader.html";
        element: HTMLElement;

        ready(element, options) {
            var page = this;
            WinJSContrib.UI.Application.navigator.closeAllPages();
            Kodi.API.Websocket.init(Kodi.API.currentSettings);

            return WinJS.Promise.join({
                mintime: WinJS.Promise.timeout(1000),
                data: Kodi.Data.loadRootData(true)
            }).then(function (data) {

                document.body.classList.remove("unconnected");
                Kodi.NowPlaying.init();
                
                return WinJS.Navigation.navigate("/pages/home/home.html")
            }, function (err) {
                document.body.classList.add("unconnected");
                return WinJS.Navigation.navigate("/pages/startup/startup.html");
            }).then(function () {
                return WinJS.UI.Animation.exitPage(page.element).then(function () {
                    $(page.element).remove();
                });

            });
        }
    }

    export var DataLoader = <any>WinJS.UI.Pages.define(DataLoaderControl.url, DataLoaderControl);

    DataLoader.showLoader = function (transitionIn, startupArgs) {
        var e = document.createElement("DIV");
        e.className = "page-loader-wrapper";
        document.body.appendChild(e);
        var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
    }
}
