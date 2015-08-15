// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
        },

        blur: function () {
            this.fowrapper.blurTo(20, 500);
        },

        unblur: function (element) {
            this.fowrapper.blurTo(0, 200);
        }
    });
})();
