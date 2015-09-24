module BtPo.UI.Pages {
    interface ITvShowViewSetting {
        group: string;
        view: string;
    }

    export class TvShowsListPage {
        public static url = "/pages/tvshows/list/tvshowslist.html";

        itemsPromise: WinJS.Promise<any>;
        selectedGenre: string;
        semanticzoom: any;
        filterByPlayed: boolean;
        element: HTMLElement;
        onlyUnplayed: HTMLInputElement;
        genretitle: HTMLElement;
        menu: HTMLElement;
        menuGroups: HTMLElement;
        menuViews: HTMLElement;
        itemsStyle: HTMLStyleElement;
        tvshows: Kodi.API.Videos.TVShows.TVShow[];
        genres: Kodi.API.Genre[];
        viewSetting: ITvShowViewSetting;

        static tvshowsGroups = {
            "none": {
                name: "no grouping",
                groupKind: null,
                groupField: null
            },
            "alphabetic": {
                name: "alphabetic",
                groupKind: WinJSContrib.UI.DataSources.Grouping.alphabetic,
                groupField: 'title'
            },
            "year": {
                name: "year",
                groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                groupField: 'year'
            },
            "studio": {
                name: "studio",
                groupKind: WinJSContrib.UI.DataSources.Grouping.byField,
                groupField: 'studio'
            }
        }

        static tvshowsViews = {
            "poster": {
                name: "poster",
                template: BtPo.Templates.tvshowposter
            },
            "bigposter": {
                name: "big poster",
                template: BtPo.Templates.tvshowposter
            },
            //"detailed": {
            //    name: "detailed",
            //    template: BtPo.Templates.tvshowposter
            //}
        }

        init(element, options) {
            this.filterByPlayed = false;
            element.classList.add("listpage");
            element.classList.add("page-tvshowslist");
            this.itemsPromise = Kodi.Data.loadRootData();
            this.viewSetting = {
                group: "none",
                view: "poster"
            }
            var s = localStorage["tvshowsListView"];
            if (s) {
                this.viewSetting = <ITvShowViewSetting>JSON.parse(s);
            }
        }

        saveViewSetting() {
            localStorage["tvshowsListView"] = JSON.stringify(this.viewSetting);
        }

        processed(element, options) {
            var page = this;
            if (options && options.genre) {
                page.selectedGenre = options.genre;
                page.genretitle.innerText = page.selectedGenre;
            }

            page.itemsStyle = <HTMLStyleElement>document.createElement("STYLE");
            page.element.appendChild(page.itemsStyle);
            page.itemsPromise = page.itemsPromise.then((data: Kodi.Data.IMediaLibrary) => {
                page.tvshows = data.tvshows.tvshows;
                page.genres = data.tvshowGenres.genres;
                
                BtPo.ListHelpers.renderMenu({
                    views: TvShowsListPage.tvshowsViews,
                    groups: TvShowsListPage.tvshowsGroups,
                    root: page.element,
                    viewsContainer: page.menuViews,
                    groupsContainer: page.menuGroups,
                    dsManager: page.semanticzoom,
                    setting: page.viewSetting,
                    defaultView: "poster",
                    defaultGroup: "none",
                    saveSetting: () => {
                        this.saveViewSetting();
                    }
                });

                page.semanticzoom.dataManager.filter = (tvshow: Kodi.API.Videos.TVShows.TVShow) => {
                    if (page.filterByPlayed && tvshow.allplayed)
                        return false;

                    if (!page.selectedGenre)
                        return true;

                    var hasgenre = tvshow.allgenres.indexOf(page.selectedGenre) >= 0;
                    return hasgenre;
                }
                page.semanticzoom.listview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.listview.layout.orientation = "vertical";
                page.semanticzoom.zoomedOutListview.layout = new WinJS.UI.GridLayout();
                page.semanticzoom.zoomedOutListview.layout.orientation = "vertical";
                page.semanticzoom.listview.oniteminvoked = (arg) => {
                    arg.detail.itemPromise.then(function (item) {
                        WinJS.Navigation.navigate("/pages/tvshows/seriedetail/tvshowsseriedetail.html", { tvshow: item.data, navigateStacked: true });
                    });
                }
            });
            page.onlyUnplayed.onchange = () => {
                page.filterByPlayed = page.onlyUnplayed.checked;
                this.semanticzoom.dataManager.refresh();
            }
        }

        ready() {
            var page = this;
            page.itemsPromise.then(function () {
                page.calcItemsSizes();
                page.semanticzoom.dataManager.items = page.tvshows;
            });
        }

        pickGenre() {
            var page = this;
            BtPo.UI.GenrePicker.pick(page.genres).then(function (genre) {
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
        }

        updateLayout(element) {
            var page = this;
            this.calcItemsSizes();
            page.semanticzoom.listview.forceLayout();
        }

        calcItemsSizes() {
            var page = this;
            var w = page.element.clientWidth;
            if (w) {
                var content = [];

                var nbitems = ((w / 260) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1;
                var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                content.push(".page-tvshowslist.view-poster .tvshow { width:" + posterW + "px; height:" + posterH + "px}");

                var nbitems = ((w / 400) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1;
                var posterH = (posterW / Kodi.App.PictureRatios.movieposter) << 0;
                content.push(".page-tvshowslist.view-bigposter .tvshow { width:" + posterW + "px; height:" + posterH + "px}");

                var nbitems = ((w / 1024) << 0) + 1;
                var posterW = ((w / nbitems) << 0) - 1;
                var posterH = (posterW / Kodi.App.PictureRatios.fanart) << 0;
                content.push(".page-tvshowslist.view-detailed .tvshow { width:" + posterW + "px; height:" + posterH + "px}");
                page.itemsStyle.innerHTML = content.join("\r\n");
            }
        }

        showMenu() {
            if (this.menu) this.menu.classList.add("visible");
        }

        hideMenu() {
            if (this.menu) this.menu.classList.remove("visible");
        }
    }
    
    WinJS.UI.Pages.define(TvShowsListPage.url, TvShowsListPage);
}
