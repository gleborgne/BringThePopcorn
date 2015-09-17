module KodiPassion.UI{
    export class SettingsFormControl {
        public static url = "/controls/settingsform/settingsform.html";

        dataForm: any;
        eventTracker: WinJSContrib.UI.EventTracker;

        get setting() {
            return this.dataForm.item;
        }
        set setting(val) {
            this.dataForm.item = val;
        }

        init(element, options) {
            element.classList.add("settingsformcontrol");
        }

        ready(element, options) {
            var page = this;
            var elts = element.querySelectorAll('.macAddress input');
            for (var i = 0, l = elts.length; i < l; i++) {
                var e = elts[i];
                page.eventTracker.addEvent(e, 'input', function (arg) {
                    page.focusNext(<HTMLInputElement>arg.srcElement);
                });
            }
        }

        focusNext(elt: HTMLInputElement) {
            var page = this;
            if (elt.value && elt.value.length == 2) {
                var allinputs = elt.parentElement.querySelectorAll("input");
                var res = <HTMLInputElement[]>[].slice.call(allinputs);
                var idx = res.indexOf(elt);
                if (res[idx + 1]) {
                    res[idx + 1].focus();
                }
            }
        }

        validate() {
            return this.dataForm.validate();
        }
    }

    export var SettingsForm = WinJS.UI.Pages.define(SettingsFormControl.url, SettingsFormControl);    
}
