var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var RemoteControlPage = (function () {
                function RemoteControlPage() {
                }
                RemoteControlPage.prototype.processed = function (element, options) {
                };
                RemoteControlPage.url = "/pages/remote/remote.html";
                return RemoteControlPage;
            })();
            Pages.RemoteControlPage = RemoteControlPage;
            WinJS.UI.Pages.define(RemoteControlPage.url, RemoteControlPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=remote.js.map