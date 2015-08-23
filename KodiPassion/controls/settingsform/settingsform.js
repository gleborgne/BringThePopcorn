(function () {
    "use strict";

    var ctor = WinJS.UI.Pages.define("/controls/settingsform/settingsform.html", {
        ready: function (element, options) {
        },
    });

    WinJS.Namespace.define("KodiPassion.UI", {
        SettingsForm : ctor
    })
})();
