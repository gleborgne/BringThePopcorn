(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/movies/list/movieslist.html", {
        init: function (element, options) {
            var page = this;
            page.itemsPromise = Kodi.Data.loadRootData().then(function (data) {
                return page.renderComplete.then(function () {
                    page.listitemtemplate = new WinJS.Binding.Template(null, { href: '/templates/movieposter.html' });
                    page.semanticzoom.dataManager.field = 'title';
                    page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                    page.semanticzoom.listview.layout.orientation = "vertical";
                    page.semanticzoom.listview.oniteminvoked = function (arg) {
                        arg.detail.itemPromise.then(function (item) { 
                            WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                        });
                    }
                    page.semanticzoom.listview.itemTemplate = page.listitemtemplate.element;
                    return data.movies.movies;
                });
            });
        },

        processed: function (element, options) {
            var page = this;

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
