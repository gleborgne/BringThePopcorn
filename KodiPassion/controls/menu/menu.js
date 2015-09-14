var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var MainMenuControl = (function () {
            function MainMenuControl() {
            }
            MainMenuControl.prototype.openremote = function () {
                WinJS.Navigation.navigate("/pages/remote/remote.html", { navigateStacked: true });
            };
            MainMenuControl.url = "/controls/menu/menu.html";
            return MainMenuControl;
        })();
        UI.MainMenu = WinJS.UI.Pages.define(MainMenuControl.url, MainMenuControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));

//# sourceMappingURL=../../../KodiPassion/controls/menu/menu.js.map