﻿/// <reference path="../../dist/kodi.js" />
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        processed: function (element, options) {
            var page = this;
            //Kodi.API.introspect().then(function (api) {
            //    Windows.Storage.ApplicationData.current.localFolder.createFileAsync("kodiapi.json", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            //        console.log("kodi api details at " + file.path);
            //        return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(api));
            //    });
            //});

            Kodi.Data.loadRootData().then(function (data) {
                page.splitviewtemplate = new WinJS.Binding.Template(null, { href: '/templates/moviesplitview.html', extractChild: true });
                page.mainsplitview.itemTemplate = function (itemPromise) {
                    return itemPromise.then(function (item) {
                        return page.splitviewtemplate.render(item.data).then(function (rendered) {
                            WinJSContrib.UI.tap(rendered, function (elt) {
                                if (!page.element.classList.contains("inactive")) {
                                    WinJS.Navigation.navigate("/pages/movies/detail/moviesdetail.html", { movie: item.data, navigateStacked: true });
                                }
                            }, { disableAnimation: true })
                            return rendered;
                        });
                    })
                }
                page.mainsplitview.itemDataSource = new WinJS.Binding.List(data.recentMovies.movies).dataSource;

                page.listseriestemplate = new WinJS.Binding.Template(null, { href: '/templates/tvshowepisode.html', extractChild: true });
                //page.tvshowslist.itemTemplate = function (itemPromise) {
                //    return itemPromise.then(function (item) {
                //        return page.listseriestemplate.render(item.data);
                //    })
                //}
                page.tvshowslist.renderer.orientation = "vertical";
                page.tvshowslist.scrollContainer = page.element;
                page.tvshowslist.prepareItems(data.tvshowRecentEpisodes.episodes, { itemClassName: 'tvshow-episode', template: page.listseriestemplate });
            });
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
