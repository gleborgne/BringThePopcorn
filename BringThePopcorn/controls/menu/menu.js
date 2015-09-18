var BtPo;
(function (BtPo) {
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
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=menu.js.map