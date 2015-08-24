(function () {
    "use strict";

    var moviesViews = {
        "wall": {
            groupKind: null,
            groupField: null,
            template: '/templates/movieposter.html'
        },
        "alphabetic": {
            groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
            groupField: 'title',
            template: '/templates/movieposter.html'
        },
        "year": {
            groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
            groupField: 'year',
            template: '/templates/movieposter.html'
        }
    }

    WinJS.UI.Pages.define("/pages/movies/list/movieslist.html", {
        init: function (element, options) {
            var page = this;
            var view = moviesViews["wall"];
            page.itemsPromise = Kodi.Data.loadRootData();
            if (options && options.genre) {
                page.selectedGenre = options.genre;
            }
        },

        setView: function (viewname) {
            var page = this;
            page.cleanViewClasses();
            var view = moviesViews[viewname] || moviesViews["wall"];
            if (view.groupKind) {
                page.semanticzoom.dataManager.groupKind = view.groupKind;
                page.semanticzoom.dataManager.field = view.groupField;
            }
            page.element.classList.add("view-" + viewname);
            page.listitemtemplate = new WinJS.Binding.Template(null, { href: view.template });
            page.semanticzoom.listview.itemTemplate = page.listitemtemplate.element;
        },

        cleanViewClasses: function () {
            var page = this;
            for (var v in moviesViews) {
                page.element.classList.remove("view-" + v);
            }
        },

        processed: function (element, options) {
            var page = this;
            page.itemsStyle = document.createElement("STYLE");
            page.element.appendChild(page.itemsStyle);
            page.itemsPromise = page.itemsPromise.then(function (data) {
                page.movies = data.movies.movies;
                page.genres = data.movieGenres.genres;
                page.setView("wall");
                page.semanticzoom.dataManager.filter = function (movie) {
                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = movie.allgenres.indexOf(page.selectedGenre) >= 0;
                    return hasgenre;
                }
                page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.listview.layout.orientation = "vertical";
                page.semanticzoom.listview.oniteminvoked = function (arg) {
                    arg.detail.itemPromise.then(function (item) {
                        WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                    });
                }
            });
        },

        ready: function () {
            var page = this;
            page.itemsPromise.then(function () {
                page.calcItemsSizes();
                page.semanticzoom.dataManager.items = page.movies;
            });
        },

        pickGenre: function () {
            var page = this;
            KodiPassion.UI.GenrePicker.pick(page.genres).then(function (genre) {
                if (genre) {
                    if (genre === "all") {
                        page.selectedGenre = null;
                        page.genretitle.innerText = "all";
                    } else {
                        page.selectedGenre = genre.label;
                        page.genretitle.innerText = page.selectedGenre;
                    }
                    page.semanticzoom.dataManager.refresh();
                }
            });
        },

        updateLayout: function (element) {
            var page = this;
            this.calcItemsSizes();
            page.semanticzoom.listview.forceLayout();
        },

        calcItemsSizes: function (element) {
            var page = this;
            var w = page.element.clientWidth;
            if (w) {
                var nbitems = ((w / 260) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1;
                var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                page.itemsStyle.innerHTML = ".view-wall .movie { width:" + posterW + "px; height:" + posterH + "px}";                
            }
        }
    });
})();
