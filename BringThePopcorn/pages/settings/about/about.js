(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/about/about.html", {
        processed: function (element, options) {
            var ctrl = this;
            var version = Windows.ApplicationModel.Package.current.id.version;
            this.versionNumber.innerText = version.major + '.' + version.minor + '.' + version.build + "." + version.revision;
            //if (ctrl.runerror) {
            //    ctrl.runerror.onclick = function () {
            //        ctrl.throwError();
            //    };
            //}
            //ctrl.throwError();
        },

        throwError: function () {
            throw new Error("test oups there was an error");
        }
    });
})();
