(function () {
    "use strict";

    var ctor = WinJS.UI.Pages.define("/controls/settingsform/settingsform.html", {
        setting : {
            get: function () {
                return this.dataForm.item;
            },
            set: function (val) {
                this.dataForm.item = val;
            }
        },

        ready: function (element, options) {
        },

        validate: function () {
            return this.dataForm.validate();
        }
    });

    WinJS.Namespace.define("KodiPassion.UI", {
        SettingsForm : ctor
    })
})();
