var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var SettingsFormControl = (function () {
            function SettingsFormControl() {
            }
            Object.defineProperty(SettingsFormControl.prototype, "setting", {
                get: function () {
                    return this.dataForm.item;
                },
                set: function (val) {
                    this.dataForm.item = val;
                },
                enumerable: true,
                configurable: true
            });
            SettingsFormControl.prototype.init = function (element, options) {
                element.classList.add("settingsformcontrol");
            };
            SettingsFormControl.prototype.ready = function (element, options) {
                var page = this;
                var elts = element.querySelectorAll('.macAddress input');
                for (var i = 0, l = elts.length; i < l; i++) {
                    var e = elts[i];
                    page.eventTracker.addEvent(e, 'input', function (arg) {
                        page.focusNext(arg.srcElement);
                    });
                }
            };
            SettingsFormControl.prototype.focusNext = function (elt) {
                var page = this;
                if (elt.value && elt.value.length == 2) {
                    var allinputs = elt.parentElement.querySelectorAll("input");
                    var res = [].slice.call(allinputs);
                    var idx = res.indexOf(elt);
                    if (res[idx + 1]) {
                        res[idx + 1].focus();
                    }
                }
            };
            SettingsFormControl.prototype.validate = function () {
                return this.dataForm.validate();
            };
            SettingsFormControl.url = "/controls/settingsform/settingsform.html";
            return SettingsFormControl;
        })();
        UI.SettingsFormControl = SettingsFormControl;
        UI.SettingsForm = WinJS.UI.Pages.define(SettingsFormControl.url, SettingsFormControl);
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));

//# sourceMappingURL=../../../KodiPassion/controls/settingsform/settingsform.js.map