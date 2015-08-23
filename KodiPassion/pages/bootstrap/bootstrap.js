(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/bootstrap/bootstrap.html", {
        init: function () {
            document.body.classList.add("unconnected");
        },

        ready: function (element, options) {
            // TODO: Initialize the page here.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
