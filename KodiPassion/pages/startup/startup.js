var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var StartUpPage = (function () {
                function StartUpPage() {
                }
                StartUpPage.prototype.processed = function (element, options) {
                };
                StartUpPage.url = "/pages/startup/startup.html";
                return StartUpPage;
            })();
            Pages.StartUpPage = StartUpPage;
            WinJS.UI.Pages.define(StartUpPage.url, StartUpPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=startup.js.map