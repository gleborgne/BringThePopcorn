/// <reference path="../../dist/kodi.js" />
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        processed: function (element, options) {
            var page = this;
            Kodi.API.introspect().then(function (api) {
                Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                    console.log("kodi api details at " + file.path);
                    return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
                });
            });

            Kodi.Data.loadRootData().then(function (data) {
                page.splitviewtemplate = new WinJS.Binding.Template(null, { href: '/templates/moviesplitview.html', extractChild: true });
                page.mainsplitview.itemTemplate = function (itemPromise) {
                    return itemPromise.then(function (item) {
                        return page.splitviewtemplate.render(item.data).then(function (rendered) {
                            WinJSContrib.UI.tap(rendered, function (elt) {
                                if (!page.element.classList.contains("inactive")) {
                                    //page.foWrapper.element.style.opacity = '0.2';
                                    //page.foWrapper.blurTo(20, 300);
                                    //page.blurred = true;
                                    WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true, skipHistory: true });
                                }
                                //if (!page.blurred) {
                                //    page.foWrapper.element.style.opacity = '0.2';
                                //    page.foWrapper.blurTo(20, 300);
                                //    page.blurred = true;
                                //} else {
                                //    page.foWrapper.element.style.opacity = '';
                                //    page.foWrapper.blurTo(0, 160);
                                //    page.blurred = false;
                                //}
                            }, { disableAnimation: true })
                            return rendered;
                        });
                    })
                }
                page.mainsplitview.itemDataSource = new WinJS.Binding.List(data.recentMovies.movies).dataSource;

                page.listseriestemplate = new WinJS.Binding.Template(null, { href: '/templates/tvshowepisode.html', extractChild: true });
                page.tvshowslist.itemTemplate = function (itemPromise) {
                    return itemPromise.then(function (item) {
                        return page.listseriestemplate.render(item.data);
                    })
                }
                page.tvshowslist.itemDataSource = new WinJS.Binding.List(data.tvshowRecentEpisodes.episodes).dataSource;
            });
        },

        navdeactivate: function () {
            this.foWrapper.element.style.opacity = '0.2';
            this.foWrapper.blurTo(20, 160);
            return WinJS.Promise.timeout(100);
        },

        navactivate: function () {
            this.foWrapper.element.style.opacity = '';
            this.foWrapper.blurTo(0, 90);
            return WinJS.Promise.timeout(3000);
        },

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
