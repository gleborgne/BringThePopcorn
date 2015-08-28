module KodiPassion.UI{
    export class SettingsFormControl {
        public static url = "/controls/settingsform/settingsform.html";

        dataForm: any;

        get setting() {
            return this.dataForm.item;
        }
        set setting(val) {
            this.dataForm.item = val;
        }

        ready(element, options) {
        }

        validate() {
            return this.dataForm.validate();
        }
    }

    export var SettingsForm = WinJS.UI.Pages.define(SettingsFormControl.url, SettingsFormControl);    
}
