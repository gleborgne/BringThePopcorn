(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/about/about.html", {
        processed: function (element, options) {
            var version = Windows.ApplicationModel.Package.current.id.version;
            this.versionNumber.innerText = version.major + '.' + version.minor + '.' + version.build + "." + version.revision;
        }
    });
})();
