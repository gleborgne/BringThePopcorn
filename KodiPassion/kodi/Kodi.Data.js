var Kodi;
(function (Kodi) {
    var Data;
    (function (Data) {
        var pictureslimit = 15;
        var invalidatedcache = false;
        var _invalidateAndRefresh = function () {
            invalidatedcache = true;
            loadRootData(true);
        };
        var _invalidate = function () {
            invalidatedcache = true;
        };
        WinJS.Application.addEventListener("VideoLibrary.OnScanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("VideoLibrary.OnCleanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("MusicLibrary.OnScanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("MusicLibrary.OnCleanFinished", _invalidateAndRefresh);
        WinJS.Application.addEventListener("VideoLibrary.OnUpdate", _invalidate);
        WinJS.Application.addEventListener("VideoLibrary.OnRemove", _invalidate);
        WinJS.Application.addEventListener("MusicLibrary.OnUpdate", _invalidate);
        WinJS.Application.addEventListener("MusicLibrary.OnRemove", _invalidate);
        Data.SearchDefinitions = {
            movies: { definition: { fields: { "label": 10, "allgenres": 1 } } },
            music: { definition: { fields: { "label": 10, "allartists": 2, "allgenres": 1 } } },
            artists: { definition: { fields: { "label": 20 } } },
            tvshows: { definition: { fields: { "label": 10, "allgenres": 1 } } }
        };
        var searchIndex = null;
        var library;
        var searchResults = {};
        function activeAllMenus() {
            $('#menumovies, #menumusic, #menuartists, #menutvshow, #menupictures').show();
        }
        function DistinctArray(array, ignorecase) {
            if (typeof ignorecase == "undefined" || array == null || array.length == 0)
                return null;
            if (typeof ignorecase == "undefined")
                ignorecase = false;
            var sMatchedItems = "";
            var foundCounter = 0;
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                var sFind = ignorecase ? item.toLowerCase() : item;
                if (sMatchedItems.indexOf("|" + sFind + "|") < 0) {
                    sMatchedItems += "|" + sFind + "|";
                    newArray[foundCounter++] = array[i];
                }
            }
            return newArray;
        }
        function musicDataCalls() {
            return [
                Kodi.API.Music.getAllAlbums(),
                Kodi.API.Music.getGenres(),
                Kodi.API.Music.getRecentAlbums(),
                Kodi.API.Files.getSources('music')
            ];
        }
        function videoDataCalls() {
            return [
                Kodi.API.Videos.Movies.getAllMovies(),
                Kodi.API.Videos.TVShows.getAllTVShows(),
                Kodi.API.Videos.Movies.getMovieGenres(),
                Kodi.API.Videos.TVShows.getTVShowsGenres(),
                Kodi.API.Videos.Movies.getRecentMovies(),
                Kodi.API.Videos.TVShows.getRecentEpisodes(),
                Kodi.API.Videos.Movies.getAllMovieSets(),
                Kodi.API.Files.getSources('video')
            ];
        }
        function rootDataCalls() {
            return [
                WinJS.Promise.join(musicDataCalls()),
                WinJS.Promise.join(videoDataCalls()),
                Kodi.API.Files.getPicturesSources(),
                Kodi.API.Profiles.getProfiles()
            ];
        }
        function buildMusicLibrary(library, data, searchIndex) {
            var artists = [];
            var allAlbums = data[0];
            if (allAlbums && allAlbums.albums && allAlbums.albums.length) {
                var tmp = [];
                allAlbums.albums.forEach(function (album) {
                    if (album.artist && album.artist.length)
                        tmp.push(album.artist);
                });
                tmp = DistinctArray(tmp, true);
                tmp = tmp.sort();
                tmp.forEach(function (artist) {
                    artists.push({ label: artist });
                });
                if (searchIndex) {
                    searchIndex.indexes.music.addRange(allAlbums.albums);
                    searchIndex.indexes.artists.addRange(artists);
                }
            }
            var pics = [];
            function selectAlbumPictures(album) {
                if (pics.length > pictureslimit)
                    return;
                if (album.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(album.thumbnail));
                }
            }
            if (data[2] && data[2].albums) {
                var picsAlbums = data[2].albums.forEach(selectAlbumPictures);
            }
            if (pics.length < pictureslimit && data[0] && data[0].albums) {
                data[0].albums.forEach(selectAlbumPictures);
            }
            library.musicPictures = pics;
            library.artists = artists;
            library.music = data[0];
            library.musicGenres = data[1];
            library.recentMusic = data[2];
            library.musicSources = data[3];
            library.hasAlbums = (library.music && library.music.albums && library.music.albums.length > 0);
            library.hasMusic = library.hasAlbums || (library.musicSources && library.musicSources.sources && library.musicSources.sources.length > 0);
            library.hasRecentMusic = (library.recentMusic && library.recentMusic.albums && library.recentMusic.albums.length);
            if (library.hasRecentMusic) {
                library.recentMusic.albums.sort(function (a, b) {
                    return b.albumid - a.albumid;
                });
            }
        }
        function buildVideoLibrary(library, data, searchIndex) {
            var pics = [];
            function selectMoviePictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.art && movie.art.poster) {
                    pics.push(Kodi.API.kodiThumbnail(movie.art.poster));
                }
                else if (movie.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(movie.thumbnail));
                }
            }
            if (data[4] && data[4].movies) {
                var picsAlbums = data[4].movies.forEach(selectMoviePictures);
            }
            if (pics.length < pictureslimit && data[0] && data[0].movies) {
                data[0].movies.forEach(selectMoviePictures);
            }
            if (data[0] && data[0].movies && searchIndex) {
                searchIndex.indexes.movies.addRange(data[0].movies);
            }
            if (data[1] && data[1].tvshows && searchIndex) {
                searchIndex.indexes.tvshows.addRange(data[1].tvshows);
            }
            library.moviesPictures = pics;
            library.movies = data[0];
            library.movieGenres = data[2];
            library.recentMovies = data[4];
            library.tvshows = data[1];
            library.tvshowGenres = data[3];
            library.tvshowRecentEpisodes = data[5];
            library.videoSources = data[7];
            library.hasVideos = (library.videoSources && library.videoSources.sources && library.videoSources.sources.length > 0);
            library.hasMovies = (library.movies && library.movies.movies && library.movies.movies.length > 0);
            library.hasRecentMovies = (library.recentMovies && library.recentMovies.movies && library.recentMovies.movies.length > 0);
            library.hasTvshows = (library.tvshows && library.tvshows.tvshows && library.tvshows.tvshows.length > 0);
            library.hasRecentTvshows = (library.tvshowRecentEpisodes && library.tvshowRecentEpisodes.episodes && library.tvshowRecentEpisodes.episodes.length > 0);
            if (library.hasRecentMovies) {
                library.recentMovies.movies.sort(function (a, b) {
                    return b.movieid - a.movieid;
                });
            }
            if (library.hasRecentTvshows) {
                library.tvshowRecentEpisodes.episodes.sort(function (a, b) {
                    return b.episodeid - a.episodeid;
                });
            }
            pics = [];
            function selectTVShowEpisodePictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.thumbnail) {
                    pics.push(Kodi.API.kodiThumbnail(movie.thumbnail));
                }
            }
            function selectTVShowPictures(movie) {
                if (pics.length > pictureslimit)
                    return;
                if (movie.art && movie.art.poster) {
                    pics.push(Kodi.API.kodiThumbnail(movie.art.poster));
                }
            }
            if (data[1] && data[1].tvshows) {
                data[1].tvshows.forEach(selectTVShowPictures);
            }
            if (pics.length < pictureslimit && data[5] && data[5].episodes) {
                var picsAlbums = data[5].episodes.forEach(selectTVShowEpisodePictures);
            }
            library.tvshowsPictures = pics;
            library.moviesets = data[6];
        }
        function buildLibrary(data) {
            var tmplibrary = {};
            if (searchIndex) {
                searchIndex.dispose();
            }
            searchIndex = new WinJSContrib.Search.IndexGroup(Data.SearchDefinitions);
            buildMusicLibrary(tmplibrary, data[0], searchIndex);
            buildVideoLibrary(tmplibrary, data[1], searchIndex);
            tmplibrary.pictures = data[2];
            tmplibrary.profiles = (data[3] ? data[3].profiles : []);
            tmplibrary.currentprofile = null;
            if (tmplibrary.profiles.length) {
                Kodi.API.Profiles.getCurrentProfile().done(function (profile) {
                    if (profile)
                        tmplibrary.currentprofile = profile.label;
                });
            }
            library = tmplibrary;
            searchIndex.save();
            if (searchIndex) {
                searchIndex.dispose();
                searchIndex = null;
            }
        }
        function showHideMenus() {
            if (!library.movies || !library.movies.movies || !library.movies.movies.length) {
                $(' #menumovies').hide();
            }
            if (!library.music || !library.music.albums || !library.music.albums.length) {
                $('#menumusic, #menuartists').hide();
            }
            if (!library.tvshows || !library.tvshows.tvshows || !library.tvshows.tvshows.length) {
                $('#menutvshows').hide();
            }
            if (!library.pictures || !library.pictures.sources || !library.pictures.sources.length) {
                $('#menupictures').hide();
            }
        }
        function checkConnectivity() {
            if (!Kodi.API.currentSettings || !Kodi.API.currentSettings.host) {
                Kodi.API.currentSettings = Kodi.Settings.load();
                Kodi.API.Websocket.close();
            }
            return Kodi.API.properties();
        }
        Data.checkConnectivity = checkConnectivity;
        function loadRootData(forceLoad) {
            if (!Kodi.API.currentSettings || !Kodi.API.currentSettings.host) {
                Kodi.API.currentSettings = Kodi.Settings.load();
                Kodi.API.Websocket.close();
            }
            if (!invalidatedcache && !forceLoad && library) {
                var cachedprom = WinJS.Promise.wrap(library);
                return cachedprom;
            }
            invalidatedcache = false;
            var prom = new WinJS.Promise(function (complete, error) {
                Kodi.API.properties().done(function (sysprops) {
                    if (sysprops) {
                        Kodi.NowPlaying.current.volume = sysprops.volume;
                        Kodi.NowPlaying.current.muted = sysprops.muted;
                        Kodi.API.version = sysprops.version;
                    }
                    searchResults = {};
                    WinJS.Promise.join(rootDataCalls()).done(function (data) {
                        activeAllMenus();
                        buildLibrary(data);
                        showHideMenus();
                        WinJS.Application.queueEvent({ type: 'appdata.changed', catalog: library });
                        complete(library);
                    }, function (err) {
                        error(err);
                    });
                }, function (err) {
                    error(err);
                });
            });
            return prom;
        }
        Data.loadRootData = loadRootData;
        function checkSystemProperties() {
            Kodi.API.properties().done(function (sysprops) {
                Kodi.NowPlaying.current.volume = sysprops.volume;
                Kodi.NowPlaying.current.muted = sysprops.muted;
            });
        }
        Data.checkSystemProperties = checkSystemProperties;
        function search(queryText) {
            return new WinJS.Promise(function (complete, error) {
                if (!searchIndex) {
                    error();
                    return;
                }
                var res = searchIndex.search(queryText);
                complete(res);
            });
        }
        Data.search = search;
        function hasGenre(obj, queryText) {
            if (!obj || !obj.genre)
                return;
            if (typeof obj.genre !== 'string') {
                if (obj.genre.forEach) {
                    for (var i = 0; i < obj.genre.length; i++) {
                        if (obj.genre[i].toLowerCase().indexOf(queryText) >= 0)
                            return true;
                    }
                }
            }
            else {
                if (obj.genre.toLowerCase().indexOf(queryText) >= 0)
                    return true;
            }
            return false;
        }
        function scanMovies() {
            var text = "Your media center will scan the library for new movies. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new movies. \r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan video library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Videos.Movies.scan();
            });
        }
        Data.scanMovies = scanMovies;
        function scanTvshows() {
            var text = "Your media center will scan the library for new tvshows. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new tvshows.\r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Videos.Movies.scan();
            });
        }
        Data.scanTvshows = scanTvshows;
        function scanAlbums() {
            var text = "Your media center will scan the library for new albums. Unfortunately, you won't get notified in this app when the task is over (upgrade to XBMC 12 to get this feature). \r\n\r\nDo you want to proceed ?";
            if (Kodi.API.Websocket.isReady()) {
                text = "Your media center will scan the library for new albums.\r\n\r\nDo you want to proceed ?";
            }
            WinJSContrib.Alerts.messageBox({ content: text, title: 'Scan library', commands: [{ label: 'Yes' }, { label: 'No' }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.Music.scan();
            });
        }
        Data.scanAlbums = scanAlbums;
        WinJS.Application.addEventListener('VideoLibrary.OnScanFinished', function (arg) {
            WinJS.Promise.join(videoDataCalls()).done(function (data) {
                buildVideoLibrary(library, data);
                showHideMenus();
                WinJSContrib.Alerts.toast('video library scan is finished');
                WinJS.Application.queueEvent({ type: 'VideoLibraryUpdate', library: library });
            });
        });
        WinJS.Application.addEventListener('AudioLibrary.OnScanFinished', function (arg) {
            WinJS.Promise.join(musicDataCalls()).done(function (data) {
                buildMusicLibrary(library, data);
                showHideMenus();
                WinJSContrib.Alerts.toast('audio library scan is finished');
                WinJS.Application.queueEvent({ type: 'AudioLibraryUpdate', library: library });
            });
        });
    })(Data = Kodi.Data || (Kodi.Data = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.Data.js.map