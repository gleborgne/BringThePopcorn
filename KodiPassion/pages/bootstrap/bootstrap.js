(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/bootstrap/bootstrap.html", {
        init: function () {
            document.body.classList.add("unconnected");
        },

        processed: function (element, options) {
            var page = this;
            page.defaultname = Kodi.Settings.defaultConnection();
            
            page.settingsForm.setting = Kodi.Settings.getSetting(page.defaultname);
        },

        testConnection: function () {
            var page = this;
            page.messages.innerHTML = "";
            if (page.settingsForm.validate()) {
                var setting = page.settingsForm.setting;
                return Kodi.API.testServerSetting(setting).then(function () {
                    Kodi.Settings.save(page.defaultname, setting, true);
                    return KodiPassion.UI.DataLoader.showLoader(true);
                }, function () {
                    page.messages.innerText = "Server cannot be reached. Please verify that your Kodi or XBMC is running and check it's configuration. Also check your network settings like firewall configuration";
                });
            }
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
