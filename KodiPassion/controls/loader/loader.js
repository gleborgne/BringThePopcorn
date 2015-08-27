// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var ctor = WinJS.UI.Pages.define("/controls/loader/loader.html", {
        ready: function (element, options) {
            var page = this;
            WinJSContrib.UI.Application.navigator.closeAllPages();
            return WinJS.Promise.join({
                mintime: WinJS.Promise.timeout(1000),
                data: Kodi.Data.loadRootData(true)
            }).then(function (data) {
                
                document.body.classList.remove("unconnected");
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
    });

    ctor.showLoader = function (transitionIn, startupArgs) {
        var e = document.createElement("DIV");
        e.className = "page-loader-wrapper";
        document.body.appendChild(e);
        var loader = new KodiPassion.UI.DataLoader(e, { transitionIn: transitionIn, startupArgs: startupArgs });
    }

    WinJS.Namespace.define("KodiPassion.UI", {
        DataLoader: ctor
    });
})();
