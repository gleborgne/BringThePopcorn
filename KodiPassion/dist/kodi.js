var Kodi;
(function (Kodi) {
    var App;
    (function (App) {
        App.DefaultGridLayout = {
            horizontal: { query: '(orientation: landscape)', layout: 'horizontal' },
            vertical: { query: '(orientation: portrait)', layout: 'vertical' },
            snapped: { query: '(orientation: portrait) and (max-width: 340px)', layout: 'vertical' }
        };
        App.DefaultListLayout = {
            hor: { query: '(orientation: landscape)', layout: WinJS.UI.GridLayout, options: { orientation: 'horizontal', groupHeaderPosition: 'left' } },
            vert: { query: '(orientation: portrait)', layout: WinJS.UI.GridLayout, options: { orientation: 'vertical', groupHeaderPosition: 'top' } }
        };
        App.PictureRatios = {
            fanart: 1.7778,
            movieposter: 0.6667,
            tvshowepisode: 1.7778,
            album: 1.1
        };
    })(App = Kodi.App || (Kodi.App = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var Data;
    (function (Data) {
        var pictureslimit = 15;
        Data.SearchDefinitions = {
            movies: { fields: { "label": 10, "genre": 1 } },
            music: { fields: { "label": 10, "artist": 2, "genre": 1 } },
            artists: { fields: { "label": 10 } },
            tvshows: { fields: { "label": 10 } }
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
            if (searchIndex)
                searchIndex.dispose();
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
            if (!forceLoad && library) {
                var cachedprom = WinJS.Promise.wrap(library);
                return cachedprom;
            }
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

var Kodi;
(function (Kodi) {
    var NowPlaying;
    (function (NowPlaying) {
        var ObservablePlaying = WinJS.Binding.define({
            id: 0, position: 0, progress: 0, enabled: 0, speed: 0, label: '', time: '', totaltime: '', type: null,
            thumbnail: undefined, playerid: 0, playlistid: 0, volume: 0, muted: false, reachable: 0,
            subtitleenabled: false, currentsubtitle: null, currentaudiostream: null,
            checking: false, hasLanguages: false, hasSubtitles: false, hasLanguagesOrSubtitles: false,
            isPlaying: false, isPlayingMusic: false, isPlayingVideo: false, isPlayingTvShow: false, isPlayingMovie: false
        });
        NowPlaying.current = new ObservablePlaying();
        NowPlaying.intervaldelay = 10000;
        function forceCheck() {
            check(true);
        }
        WinJS.Application.addEventListener('Player.OnPlay', forceCheck);
        WinJS.Application.addEventListener('Player.OnSeek', forceCheck);
        WinJS.Application.addEventListener('Player.OnStop', forceCheck);
        WinJS.Application.addEventListener('xbmcplayercheck', forceCheck);
        function checkError(err) {
            NowPlaying.current.id = undefined;
            NowPlaying.current.position = undefined;
            NowPlaying.current.playerid = undefined;
            NowPlaying.current.playlistid = undefined;
            NowPlaying.current.type = undefined;
            NowPlaying.current.active = false;
            if (!NowPlaying.current || NowPlaying.current.enabled === true) {
                if (NowPlaying.current) {
                    NowPlaying.current.enabled = false;
                }
            }
            if (NowPlaying.current) {
                if (err === 'noplayer') {
                    NowPlaying.current.reachable = true;
                }
                else {
                    NowPlaying.current.reachable = false;
                }
            }
            NowPlaying.current.checking = false;
        }
        NowPlaying.checkError = checkError;
        function check(standby) {
            return new WinJS.Promise(function (complete, error) {
                if (standby) {
                    NowPlaying.current.checking = true;
                }
                Kodi.API.properties().then(function (p) {
                    NowPlaying.current.muted = p.muted;
                    NowPlaying.current.volume = p.volume;
                }, function () {
                });
                Kodi.API.Player.currentItem(undefined).done(function (currentItem) {
                    var id = Kodi.API.Player.currentPlayer.playerid;
                    Kodi.API.Player.properties(id).done(function (props) {
                        if (props && currentItem) {
                            nowPlaying(props, currentItem.item);
                        }
                        if (NowPlaying.current.checking) {
                            NowPlaying.current.checking = false;
                        }
                        complete(NowPlaying.current);
                    }, function (err) {
                        checkError(err);
                        complete(NowPlaying.current);
                    });
                }, function (err) {
                    checkError(err);
                    complete(NowPlaying.current);
                });
                if (nowPlayingInterval)
                    clearInterval(nowPlayingInterval);
                nowPlayingInterval = setInterval(check, NowPlaying.intervaldelay);
            });
        }
        NowPlaying.check = check;
        function nowPlaying(properties, item) {
            NowPlaying.current.reachable = true;
            var idChanged = item.id != NowPlaying.current.id;
            NowPlaying.current.id = item.id;
            NowPlaying.current.file = item.file;
            if (!properties) {
                return;
            }
            NowPlaying.current.position = properties.position;
            NowPlaying.current.playerid = properties.playerid;
            NowPlaying.current.playlistid = properties.playlistid;
            NowPlaying.current.speed = properties.speed;
            NowPlaying.current.type = item.type;
            NowPlaying.current.isPlayingMusic = item.type == 'song';
            NowPlaying.current.isPlayingMovie = item.type == 'movie';
            NowPlaying.current.isPlayingTvShow = item.type == 'episode';
            NowPlaying.current.isPlayingVideo = NowPlaying.current.isPlayingMovie || NowPlaying.current.isPlayingTvShow;
            NowPlaying.current.isPlaying = NowPlaying.current.isPlayingVideo || NowPlaying.current.isPlayingMusic || item.type == 'unknown';
            NowPlaying.current.subtitles = properties.subtitles;
            if (idChanged || !NowPlaying.current.currentsubtitle || NowPlaying.current.currentsubtitle.index != properties.currentsubtitle.index)
                NowPlaying.current.currentsubtitle = properties.currentsubtitle;
            NowPlaying.current.audiostreams = properties.audiostreams;
            if (idChanged || !NowPlaying.current.currentaudiostream || NowPlaying.current.currentaudiostream.index != properties.currentaudiostream.index)
                NowPlaying.current.currentaudiostream = properties.currentaudiostream;
            NowPlaying.current.subtitleenabled = properties.subtitleenabled;
            NowPlaying.current.hasLanguages = properties.audiostreams && properties.audiostreams.length > 1;
            NowPlaying.current.hasSubtitles = properties.subtitles && properties.subtitles.length > 0;
            NowPlaying.current.hasLanguagesOrSubtitles = NowPlaying.current.hasLanguages || NowPlaying.current.hasSubtitles;
            if (properties.percentage < 0) {
                NowPlaying.current.progress = 0;
            }
            else {
                if (properties.percentage > 100)
                    NowPlaying.current.progress = 100;
                else if (properties.percentage < 0)
                    NowPlaying.current.progress = 0;
                else
                    NowPlaying.current.progress = properties.percentage;
            }
            if (properties.time.minutes < 0) {
                NowPlaying.current.time = '00:00';
            }
            else {
                NowPlaying.current.time = Kodi.Utils.formatPlayerTime(properties, properties.time);
            }
            NowPlaying.current.totaltime = Kodi.Utils.formatPlayerTime(properties, properties.totaltime);
            NowPlaying.current.label = item.label;
            NowPlaying.current.label = NowPlaying.current.label.replace(new RegExp("[_]", 'g'), " ");
            var thumb = item.thumbnail;
            if (!item.thumbnail && item.type == 'unknown') {
                thumb = 'DefaultAlbumCover.png';
            }
            NowPlaying.current.thumbnail = thumb;
            if (!item.type) {
                NowPlaying.current.enabled = false;
            }
            else {
                if (!NowPlaying.current.enabled) {
                    NowPlaying.current.enabled = true;
                }
            }
        }
        var nowPlayingInterval;
        function init() {
            if (nowPlayingInterval)
                clearInterval(nowPlayingInterval);
            NowPlaying.current.enabled = false;
            NowPlaying.current.reachable = false;
            nowPlayingInterval = setInterval(check, NowPlaying.intervaldelay);
            check();
        }
        NowPlaying.init = init;
    })(NowPlaying = Kodi.NowPlaying || (Kodi.NowPlaying = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var Settings;
    (function (Settings) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var kodiServers = 'kodiAPISettings';
        var currentSettings;
        function saveSetting(name, settings) {
            applicationData.roamingSettings.values[name] = JSON.stringify(settings);
        }
        function loadSetting(name) {
            var content = applicationData.roamingSettings.values[name];
            if (!content)
                return;
            return JSON.parse(content);
        }
        function read(name) {
            return currentSettings.servers[name];
        }
        currentSettings = loadSetting(kodiServers);
        if (!currentSettings)
            currentSettings = {
                defaultSetting: 'Default',
                servers: {
                    Default: {
                        name: 'Default',
                        host: '',
                        port: 80,
                        user: 'kodi',
                        password: '',
                        macAddress: []
                    }
                }
            };
        function save(initialName, setting, setDefault) {
            if (initialName !== setting.name) {
                delete currentSettings.servers[initialName];
                if (currentSettings.defaultSetting === initialName)
                    currentSettings.defaultSetting = setting.name;
            }
            if (setDefault) {
                currentSettings.defaultSetting = setting.name;
            }
            currentSettings.servers[setting.name] = setting;
            saveSetting(kodiServers, currentSettings);
        }
        Settings.save = save;
        function remove(name) {
            delete currentSettings.servers[name];
            saveSetting(kodiServers, currentSettings);
        }
        Settings.remove = remove;
        function getSetting(name) {
            return currentSettings.servers[name];
        }
        Settings.getSetting = getSetting;
        function load() {
            var defaultsetting = currentSettings.servers[currentSettings.defaultSetting];
            if (!defaultsetting)
                defaultsetting = {
                    name: currentSettings.defaultSetting,
                    host: '',
                    port: '',
                    user: '',
                    password: '',
                    macAddress: []
                };
            return defaultsetting;
        }
        Settings.load = load;
        function defaultConnection() {
            return currentSettings.defaultSetting;
        }
        Settings.defaultConnection = defaultConnection;
        function list() {
            var res = [];
            for (var key in currentSettings.servers) {
                if (currentSettings.servers.hasOwnProperty(key)) {
                    res.push(key);
                }
            }
            return res;
        }
        Settings.list = list;
    })(Settings = Kodi.Settings || (Kodi.Settings = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var Utils;
    (function (Utils) {
        function bgImage(source, sourceProperty, dest, destProperty, defaultImage) {
            function setImage(url) {
                if (dest.nodeName === "IMG") {
                    dest.src = url;
                }
                else {
                    dest.style.backgroundImage = 'url("' + url + '")';
                }
            }
            function setBg() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data || !data.length) {
                    WinJS.Utilities.addClass(dest, 'imageLoaded');
                    dest.innerHTML = '';
                    if (defaultImage) {
                        setImage(defaultImage);
                        dest.style.backgroundSize = 'contain';
                    }
                    return;
                }
                if (data === 'DefaultAlbumCover.png') {
                    WinJS.Utilities.addClass(dest, 'imageLoaded');
                    dest.innerHTML = '';
                    setImage("/images/cd.png");
                    return;
                }
                var imgUrl = Kodi.API.kodiThumbnail(data);
                setTimeout(function () {
                    WinJSContrib.UI.loadImage(imgUrl).done(function () {
                        WinJS.Utilities.addClass(dest, 'imageLoaded');
                        dest.innerHTML = '';
                        setImage(imgUrl);
                    }, function () {
                        WinJS.Utilities.addClass(dest, 'imageLoaded');
                        dest.innerHTML = '';
                        if (defaultImage) {
                            setImage(defaultImage);
                        }
                    });
                }, 150);
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setBg;
            return WinJS.Binding.bind(source, bindingDesc);
        }
        function imageUrl(source, sourceProperty, dest, destProperty, defaultImage) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var imgUrl = defaultImage;
            if (!data || !data.length) {
                if (!imgUrl)
                    return;
            }
            else {
                imgUrl = Kodi.API.kodiThumbnail(data);
            }
            return WinJS.Binding.oneTime({ url: imgUrl }, ['url'], dest, [destProperty]);
        }
        function formatPlayerTime(props, data) {
            var res = [];
            if (data.hours || props.type === 'video')
                res.push(WinJSContrib.Utils.pad2(data.hours | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.minutes | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.seconds | 0));
            return res.join('');
        }
        Utils.formatPlayerTime = formatPlayerTime;
        Utils.toThumbnailBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toThumbnailImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toFormatedPlayerTime = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            WinJS.Binding.oneTime({ time: Kodi.Utils.formatPlayerTime(source, data) }, ['time'], dest, [destProperty]);
        });
        Utils.toDuration = WinJS.Binding.initializer(function toDurationBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            var totalseconds = parseInt(data);
            var minutes = ((totalseconds / 60) >> 0);
            var seconds = totalseconds - (minutes * 60);
            WinJS.Binding.oneTime({ duration: minutes + 'min' + WinJSContrib.Utils.pad2(seconds) }, ['duration'], dest, [destProperty]);
        });
        Utils.showIfNetworkPath = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data || data.indexOf('\\\\') != 0) {
                dest.style.display = 'none';
            }
            else {
                dest.style.display = '';
            }
        });
        Utils.isCurrent = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            function setClass() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (data) {
                    WinJS.Utilities.addClass(dest, 'iscurrent');
                }
                else {
                    WinJS.Utilities.removeClass(dest, 'iscurrent');
                }
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        function getNetworkPath(mediapath) {
            if (!mediapath)
                return null;
            if (mediapath.indexOf('\\\\') == 0) {
                return mediapath;
            }
            else if (mediapath.indexOf('smb://') == 0) {
                var path = mediapath.substr(4, mediapath.length - 4);
                var pattern = "/", re = new RegExp(pattern, "g");
                path = path.replace(re, '\\');
                return path;
            }
            return null;
        }
        Utils.getNetworkPath = getNetworkPath;
    })(Utils = Kodi.Utils || (Kodi.Utils = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var WOL;
    (function (WOL) {
        function wakeUp(host, macAddress) {
            host = '255.255.255.255';
            //host = '192.168.1.255';
            return WinJS.Promise.join([
                doWakeUp(host, '7', macAddress),
                doWakeUp(host, '9', macAddress)
            ]);
        }
        WOL.wakeUp = wakeUp;
        function doWakeUp(host, service, macAddress) {
            return new WinJS.Promise(function (complete, error) {
                var hostName;
                try {
                    hostName = new Windows.Networking.HostName(host);
                }
                catch (ex) {
                    error({ message: "Invalid host name." });
                    return;
                }
                var clientSocket = new Windows.Networking.Sockets.DatagramSocket();
                function onerror(err) {
                    try {
                        if (clientSocket)
                            clientSocket.close();
                    }
                    catch (ex) {
                    }
                    error(err);
                }
                var ep;
                clientSocket.getOutputStreamAsync(hostName, service).done(function (outputStream) {
                    //});
                    var bytes;
                    bytes = [255, 255, 255, 255, 255, 255];
                    for (var i = 0; i < 16; i++) {
                        for (var m = 0; m < macAddress.length; m++) {
                            bytes.push(macAddress[m]);
                        }
                    }
                    //clientSocket.connectAsync(hostName, service).done(function () {
                    //var clientDataWriter = new Windows.Storage.Streams.DataWriter(clientSocket.outputStream);
                    var clientDataWriter = new Windows.Storage.Streams.DataWriter(outputStream);
                    clientDataWriter.writeBytes(bytes);
                    clientDataWriter.storeAsync().done(function () {
                        clientDataWriter.close();
                        clientSocket.close();
                        complete();
                    }, onerror);
                }, onerror);
            });
        }
    })(WOL = Kodi.WOL || (Kodi.WOL = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Input;
        (function (Input) {
            function properties() {
                return API.kodiRequest('Application.GetProperties', { properties: ["muted", "volume", "version"] });
            }
            Input.properties = properties;
            function mute(mute) {
                Kodi.NowPlaying.current.muted = mute;
                return API.kodiRequest('Application.SetMute', { mute: mute });
            }
            Input.mute = mute;
            function volumeMute() {
                return mute(true);
            }
            Input.volumeMute = volumeMute;
            function volumeUnmute() {
                return mute(false);
            }
            Input.volumeUnmute = volumeUnmute;
            function volume(volume) {
                Kodi.NowPlaying.current.volume = volume;
                return API.kodiRequest('Application.SetVolume', { volume: volume });
            }
            Input.volume = volume;
            function back() {
                return API.kodiRequest('Input.Back');
            }
            Input.back = back;
            function home() {
                return API.kodiRequest('Input.Home');
            }
            Input.home = home;
            function select() {
                return API.kodiRequest('Input.Select');
            }
            Input.select = select;
            function menu() {
                return API.kodiRequest('Input.ContextMenu');
            }
            Input.menu = menu;
            function info() {
                return API.kodiRequest('Input.Info');
            }
            Input.info = info;
            function up() {
                return API.kodiRequest('Input.Up');
            }
            Input.up = up;
            function down() {
                return API.kodiRequest('Input.Down');
            }
            Input.down = down;
            function left() {
                return API.kodiRequest('Input.Left');
            }
            Input.left = left;
            function right() {
                return API.kodiRequest('Input.Right');
            }
            Input.right = right;
            function activateWindow(window, parameters) {
                return API.kodiRequest('GUI.ActivateWindow', { window: window, parameters: parameters }, false, true);
            }
            Input.activateWindow = activateWindow;
            function openMovies() {
                return activateWindow("videos", ["videodb://movies/titles/"]);
            }
            Input.openMovies = openMovies;
            function openTvShows() {
                return activateWindow("videos", ["videodb://tvshows/titles/"]);
            }
            Input.openTvShows = openTvShows;
            function openMusic() {
                return activateWindow("musiclibrary", ["musicdb://albums/ "]);
            }
            Input.openMusic = openMusic;
            function openPictures() {
                return activateWindow("pictures", []);
            }
            Input.openPictures = openPictures;
        })(Input = API.Input || (API.Input = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Music;
        (function (Music) {
            function processAlbums(albumset, albumitemcallback) {
                if (albumset && albumset.albums && albumset.albums.length) {
                    albumset.albums.forEach(function (album) {
                        if (album.artist) {
                            var albtype = typeof album.artist;
                            if (albtype === 'object') {
                                album.allartists = album.artist;
                                album.artist = album.artist[0];
                            }
                        }
                        if (album.genre) {
                            var albtype = typeof album.genre;
                            if (albtype === 'object') {
                                album.allgenres = album.genre;
                                album.genre = album.allgenres.join(', ');
                            }
                        }
                        if (albumitemcallback)
                            albumitemcallback(album);
                    });
                }
            }
            Music.processAlbums = processAlbums;
            function AlbumOptions(detailed) {
                if (typeof detailed === "undefined") {
                    detailed = false;
                }
                if (detailed) {
                    return {
                        "properties": [
                            "title", "description", "artist", "genre", "theme", "mood", "style", "type", "albumlabel",
                            "rating", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart", "thumbnail", "artistid"
                        ]
                    };
                }
                else {
                    return { "properties": ["thumbnail", "fanart", "artist", "style", "albumlabel", "genre", "year", "rating"], "sort": { "method": "label", "order": "ascending" } };
                }
            }
            function getGenres() {
                return API.kodiRequest('AudioLibrary.GetGenres', { "sort": { "method": "label", "order": "ascending" } }, false, true);
            }
            Music.getGenres = getGenres;
            function getArtists() {
                return API.kodiRequest('AudioLibrary.GetArtists', { "sort": { "method": "label", "order": "ascending" } });
            }
            Music.getArtists = getArtists;
            function scan() {
                return API.kodiRequest('AudioLibrary.Scan', {});
            }
            Music.scan = scan;
            //export function getFiles() : WinJS.Promise<any>  {
            //    return xbmcRequest('Files.GetSources', { "media": "music", "sort": { "method": "label", "order": "ascending" } });
            //}
            //export function getFilePath(path) : WinJS.Promise<any>  {
            //    return xbmcRequest('Files.GetDirectory', { "directory": path, "sort": { "method": "label", "order": "ascending" } });
            //}
            function getAllAlbums() {
                var data = AlbumOptions();
                return API.kodiRequest('AudioLibrary.GetAlbums', data, false, true).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAllAlbums = getAllAlbums;
            function getAlbumDetails(albumid) {
                var data = AlbumOptions(true);
                data.albumid = albumid;
                return API.kodiRequest('AudioLibrary.GetAlbumDetails', data);
            }
            Music.getAlbumDetails = getAlbumDetails;
            function getRecentAlbums() {
                var data = AlbumOptions();
                return API.kodiRequest('AudioLibrary.GetRecentlyAddedAlbums', data, false, true).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getRecentAlbums = getRecentAlbums;
            function getAlbumsByArtist(artistid) {
                var data = AlbumOptions();
                data.artistid = artistid;
                return API.kodiRequest('AudioLibrary.GetAlbums', data).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAlbumsByArtist = getAlbumsByArtist;
            function getAlbumsByGenre(genreid) {
                var data = AlbumOptions();
                data.genreid = genreid;
                return API.kodiRequest('AudioLibrary.GetAlbums', data).then(function (albums) {
                    processAlbums(albums);
                    return albums;
                });
            }
            Music.getAlbumsByGenre = getAlbumsByGenre;
            function albumSongs(albumid) {
                if (API.version.major >= 12)
                    return API.kodiRequest('AudioLibrary.GetSongs', { filter: { albumid: albumid }, "properties": ["track", "duration", "file"] /*, "sort": { "method": "track", "order": "ascending" } */ });
                else
                    return API.kodiRequest('AudioLibrary.GetSongs', { "albumid": albumid, "properties": ["track", "duration", "file"], "sort": { "method": "track", "order": "ascending" } });
            }
            Music.albumSongs = albumSongs;
            function playAlbum(albumid) {
                return API.kodiRequest('Player.Open', { "item": { "albumid": albumid } }, true);
            }
            Music.playAlbum = playAlbum;
            function queueAlbum(albumid) {
                return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "albumid": albumid } }, true);
            }
            Music.queueAlbum = queueAlbum;
            function playSong(songid) {
                return API.kodiRequest('Player.Open', { "item": { "songid": songid } }, true);
            }
            Music.playSong = playSong;
            function queueSong(songid) {
                return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "songid": songid } }, true);
            }
            Music.queueSong = queueSong;
        })(Music = API.Music || (API.Music = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Player;
        (function (Player) {
            Player.currentPlayer;
            Player.currentPlayerProperties;
            var lastItem;
            function playerCall(methodname, data, playerid, forceCheck) {
                if (typeof data === "undefined") {
                    data = undefined;
                }
                if (typeof playerid === "undefined") {
                    playerid = undefined;
                }
                if (typeof forceCheck === "undefined") {
                    forceCheck = false;
                }
                return new WinJS.Promise(function (complete, error) {
                    var datacall = data || {};
                    var playerToUse = playerid;
                    //if (!playerToUse && player.currentPlayer) {
                    //    playerToUse = player.currentPlayer.playerid;
                    //}
                    if (playerToUse === undefined) {
                        getActivePlayer().done(function (activeplayers) {
                            if (activeplayers && activeplayers.length) {
                                Player.currentPlayer = activeplayers[0];
                                playerCall(methodname, data, activeplayers[0].playerid, forceCheck).done(function (result) {
                                    complete(result);
                                }, error);
                            }
                            else {
                                error('noplayer');
                            }
                        }, error);
                    }
                    else {
                        datacall.playerid = playerToUse;
                        API.kodiRequest(methodname, datacall, forceCheck, true).done(function (result) {
                            complete(result);
                        }, error);
                    }
                });
            }
            function getActivePlayer() {
                return API.kodiRequest('Player.GetActivePlayers');
            }
            Player.getActivePlayer = getActivePlayer;
            function currentItem(playerid) {
                return playerCall('Player.GetItem', { "properties": ["album", "thumbnail", "file"] }, playerid).then(function (item) {
                    lastItem = item;
                    return WinJS.Promise.wrap(item);
                });
            }
            Player.currentItem = currentItem;
            function properties(playerid) {
                return playerCall('Player.GetProperties', { properties: ["type", "speed", "percentage", "time", "totaltime", "position", "playlistid", "repeat", "canseek", "canchangespeed", "canrepeat", "canzoom", "canrotate", "subtitles", "currentsubtitle", "audiostreams", "currentaudiostream", "subtitleenabled"] }, playerid).then(function (props) {
                    Player.currentPlayerProperties = props;
                    return WinJS.Promise.wrap(props);
                });
            }
            Player.properties = properties;
            function play(playerid, index) {
                return playerCall('Player.PlayPause', { play: true }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.play = play;
            function pause(playerid, index) {
                return playerCall('Player.PlayPause', { play: false }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.pause = pause;
            function playPause(playerid, index) {
                return playerCall('Player.PlayPause', { play: 'toggle' }, playerid).then(function (result) {
                    if (result && result.speed != undefined) {
                        Kodi.NowPlaying.current.speed = result.speed;
                    }
                    return result;
                });
            }
            Player.playPause = playPause;
            function stop(playerid, index) {
                return playerCall('Player.Stop', {}, playerid, true);
            }
            Player.stop = stop;
            function open(path, recursive) {
                var arg = { item: { file: path } };
                if (recursive) {
                    arg = { item: { directory: path } };
                }
                return API.kodiRequest('Player.Open', arg);
            }
            Player.open = open;
            function add(path, recursive) {
                var arg = { playlistid: 0, item: { file: path } };
                if (recursive) {
                    arg = { playlistid: 0, item: { directory: path } };
                }
                return API.kodiRequest('Playlist.Add', arg);
            }
            Player.add = add;
            function moveTo(playerid, index) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: index }, playerid, true);
                }
                else {
                    return playerCall('Player.GoTo', { "position": index }, playerid, true);
                }
            }
            Player.moveTo = moveTo;
            function next(playerid) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: 'next' }, playerid, true);
                }
                else {
                    return playerCall('Player.GoNext', {}, playerid, true);
                }
            }
            Player.next = next;
            function previous(playerid) {
                if (API.version.major >= 12) {
                    return playerCall('Player.GoTo', { to: 'previous' }, playerid, true);
                }
                else {
                    return playerCall('Player.GoPrevious', {}, playerid, true);
                }
            }
            Player.previous = previous;
            function moveUp(playerid) {
                return playerCall('Player.MoveUp', {}, playerid);
            }
            Player.moveUp = moveUp;
            function moveDown(playerid) {
                return playerCall('Player.MoveDown', {}, playerid);
            }
            Player.moveDown = moveDown;
            function moveLeft(playerid) {
                return playerCall('Player.MoveLeft', {}, playerid);
            }
            Player.moveLeft = moveLeft;
            function moveRight(playerid) {
                return playerCall('Player.MoveRight', {}, playerid);
            }
            Player.moveRight = moveRight;
            function rotate(playerid) {
                return playerCall('Player.Rotate', {}, playerid);
            }
            Player.rotate = rotate;
            function setAudioStream(playerid, stream) {
                return playerCall('Player.SetAudioStream', { stream: stream }, playerid);
            }
            Player.setAudioStream = setAudioStream;
            function setSubtitle(playerid, subtitle) {
                return playerCall('Player.SetSubtitle', { subtitle: subtitle }, playerid);
            }
            Player.setSubtitle = setSubtitle;
            function seek(playerid, val) {
                return playerCall('Player.Seek', { value: val }, playerid, true);
            }
            Player.seek = seek;
        })(Player = API.Player || (API.Player = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var apiUrl = 'http://192.168.1.67:80';
        var apiId = 0;
        var apiVersion = '2.0';
        API.defaultCallTimeout = 10;
        API.currentSettings;
        API.version;
        function redirectToSettings(error) {
            if (error === 'noplayer')
                return WinJS.Promise.wrap();
            return WinJS.Navigation.navigate("/pages/settings/settings.html", { setting: API.currentSettings, error: error });
        }
        API.redirectToSettings = redirectToSettings;
        //ws.onopen = function () {
        //    console.log('open');
        //};
        //ws.onclose = function (evt) {
        //    console.log('closed')
        //};
        //ws.onmessage = function (evt) {
        //    console.log(evt.data)
        //};
        //ws.onerror = function (evt) {
        //    console.log(evt.data)
        //};
        function kodiServerRequest(setting, methodname, params, forceCheck, ignoreXBMCErrors, retries) {
            var p, completed = false, completeCallback, errorCallback = null;
            p = new WinJS.Promise(function (complete, error) {
                completeCallback = complete;
                errorCallback = error;
            });
            if (!setting) {
                var err = { message: 'not initialized' };
                setImmediate(function () {
                    errorCallback(err);
                });
                return p;
            }
            var reqdata = {
                "jsonrpc": apiVersion, "method": methodname, "id": apiId
            };
            if (params)
                reqdata.params = params;
            var url = setting.host + '/jsonrpc';
            if (setting.port !== 80) {
                url = setting.host + ':' + setting.port + '/jsonrpc';
            }
            if (!WinJSContrib.Utils.startsWith(url, 'http://')) {
                url = 'http://' + url;
            }
            var callData = JSON.stringify(reqdata);
            console.log('API call for ' + url + ' ' + callData);
            $.ajax({
                url: url,
                type: 'POST',
                username: setting.user,
                password: setting.password,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                data: callData,
                success: function (data) {
                    Kodi.NowPlaying.current.reachable = true;
                    console.log('API call success for ' + url + ' ' + callData);
                    if (p._state && p._state.name && p._state.name == 'error') {
                        if (completed)
                            return;
                        else
                            errorCallback();
                    }
                    //if (ignoreXBMCErrors) {
                    //    complete();
                    //    return;
                    //}
                    if (data.error && !ignoreXBMCErrors && data.error.message !== 'Internal error.') {
                        completed = true;
                        errorCallback({ data: data, method: methodname });
                    }
                    else {
                        completed = true;
                        completeCallback(data.result);
                        if (forceCheck) {
                            setTimeout(function () {
                                WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
                            }, 150);
                        }
                    }
                },
                error: function (data) {
                    console.log('API call error for ' + url + ' ' + callData);
                    if (p._state && p._state.name && p._state.name == 'error') {
                        if (completed)
                            return;
                        else
                            errorCallback();
                    }
                    if (data.status === 0 && !retries) {
                        console.log('API call retry ' + url + ' ' + callData);
                        kodiServerRequest(setting, methodname, params, forceCheck, ignoreXBMCErrors, (retries || 0) + 1).done(function (data) {
                            completed = true;
                            completeCallback(data);
                        }, function (err) {
                            completed = true;
                            errorCallback(err);
                        });
                    }
                    else {
                        completed = true;
                        errorCallback(data);
                    }
                }
            });
            //});
            return WinJS.Promise.timeout(API.defaultCallTimeout * 1000, p);
        }
        API.kodiServerRequest = kodiServerRequest;
        function testServerSetting(setting) {
            return kodiServerRequest(setting, 'Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, false, 2);
        }
        API.testServerSetting = testServerSetting;
        function kodiRequest(methodname, params, forceCheck, ignoreXBMCErrors, retries) {
            return kodiServerRequest(API.currentSettings, methodname, params, forceCheck, ignoreXBMCErrors, retries).then(function (data) {
                if (API.version && API.version.major >= 12 && !Kodi.API.Websocket.current) {
                    Kodi.API.Websocket.init(API.currentSettings);
                }
                return data;
            });
        }
        API.kodiRequest = kodiRequest;
        function kodiThumbnail(thumburl) {
            var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/vfs/' + encodeURIComponent(thumburl);
            if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
                uri = 'http://' + uri;
            return uri;
        }
        API.kodiThumbnail = kodiThumbnail;
        function getFilePath(path) {
            var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/' + path;
            if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
                uri = 'http://' + uri;
            return uri;
        }
        API.getFilePath = getFilePath;
        function introspect() {
            return kodiRequest('JSONRPC.Introspect');
        }
        API.introspect = introspect;
        function properties() {
            return kodiRequest('Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, true);
        }
        API.properties = properties;
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Profiles;
        (function (Profiles) {
            var profileProperties = ["lockmode", "thumbnail"];
            function getCurrentProfile() {
                return new WinJS.Promise(function (complete, error) {
                    API.kodiRequest('Profiles.GetCurrentProfile', { properties: profileProperties }).then(function (profile) {
                        complete(profile);
                    }, function (err) {
                        complete();
                    });
                });
            }
            Profiles.getCurrentProfile = getCurrentProfile;
            function getProfiles() {
                return new WinJS.Promise(function (complete, error) {
                    API.kodiRequest('Profiles.GetProfiles', { properties: profileProperties }).then(function (profiles) {
                        complete(profiles);
                    }, function (err) {
                        complete();
                    });
                });
            }
            Profiles.getProfiles = getProfiles;
            function loadProfile(name, prompt, password) {
                var arg = { profile: name };
                if (prompt !== undefined)
                    arg.prompt = prompt;
                if (password !== undefined)
                    arg.password = password;
                return API.kodiRequest('Profiles.LoadProfile', arg);
            }
            Profiles.loadProfile = loadProfile;
        })(Profiles = API.Profiles || (API.Profiles = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var PlayList;
        (function (PlayList) {
            function getProperties(playlistid) {
                return API.kodiRequest('Playlist.GetProperties', { playlistid: playlistid });
            }
            PlayList.getProperties = getProperties;
            function getItems(playlistid) {
                return API.kodiRequest('Playlist.GetItems', { playlistid: playlistid, properties: ["set", "setid", "albumid", "album", "duration", "artist", "albumartist", "thumbnail", "tvshowid", "season", "episode"] });
            }
            PlayList.getItems = getItems;
            function removeAt(playlistid, position) {
                return API.kodiRequest('Playlist.Remove', { playlistid: playlistid, position: position });
            }
            PlayList.removeAt = removeAt;
            function swap(playlistid, position, position2) {
                return API.kodiRequest('Playlist.Swap', { playlistid: playlistid, position1: position, position2: position2 });
            }
            PlayList.swap = swap;
            function insertSong(playlistid, position, songId) {
                return API.kodiRequest('Playlist.Insert', { playlistid: playlistid, position: position, item: { songid: songId } });
            }
            PlayList.insertSong = insertSong;
        })(PlayList = API.PlayList || (API.PlayList = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Files;
        (function (Files) {
            function getPicturesDirectory(directory) {
                return API.kodiRequest('Files.GetDirectory', { directory: directory, media: 'pictures', properties: ["title", "file", "thumbnail"] }, false, true);
            }
            Files.getPicturesDirectory = getPicturesDirectory;
            function getPicturesSources() {
                return API.kodiRequest('Files.GetSources', { media: 'pictures' }, false, true);
            }
            Files.getPicturesSources = getPicturesSources;
            function download(path) {
                return API.kodiRequest('Files.PrepareDownload', { path: path });
            }
            Files.download = download;
            function getDirectory(media, directory) {
                return API.kodiRequest('Files.GetDirectory', { directory: directory, media: media, properties: ["title", "file", "thumbnail"] }, false, true);
            }
            Files.getDirectory = getDirectory;
            function getSources(media) {
                return API.kodiRequest('Files.GetSources', { media: media }, false, true);
            }
            Files.getSources = getSources;
        })(Files = API.Files || (API.Files = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var System;
        (function (System) {
            function shutdown() {
                return API.kodiRequest('System.Shutdown', {});
            }
            System.shutdown = shutdown;
            function hibernate() {
                return API.kodiRequest('System.Hibernate', {});
            }
            System.hibernate = hibernate;
            function reboot() {
                return API.kodiRequest('System.Reboot', {});
            }
            System.reboot = reboot;
            function properties() {
                return API.kodiRequest('System.GetProperties', { properties: ["canreboot", "cansuspend", "canhibernate", "canshutdown"] }, false, true);
            }
            System.properties = properties;
        })(System = API.System || (API.System = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Videos;
        (function (Videos) {
            var TVShows;
            (function (TVShows) {
                function TVShowOptions(detailed) {
                    var res;
                    if (detailed) {
                        res = {
                            "properties": [
                                "title", "genre", "year", "rating", "plot", "studio", "mpaa", "cast", "playcount",
                                "episode", "imdbnumber", "premiered", "votes", "lastplayed", "fanart", "thumbnail",
                                "file", "originaltitle", "sorttitle", "episodeguide"
                            ]
                        };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                    else {
                        res = { "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "year"], "sort": { "method": "label", "order": "ascending" } };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                }
                TVShows.TVShowOptions = TVShowOptions;
                function TVShowSeasonOptions(detailed) {
                    return {
                        "properties": [
                            "season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid"
                        ], "sort": { "method": "label", "order": "ascending" }
                    };
                }
                TVShows.TVShowSeasonOptions = TVShowSeasonOptions;
                function TVShowEpisodeOptions(detailed) {
                    if (detailed) {
                        return {
                            "properties": [
                                "title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime",
                                "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast",
                                "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid"
                            ]
                        };
                    }
                    else {
                        return { "properties": ["thumbnail", "fanart", "tvshowid", "season", "title", "originaltitle", "showtitle", "episode", "plot"], "sort": { "method": "label", "order": "ascending" } };
                    }
                }
                TVShows.TVShowEpisodeOptions = TVShowEpisodeOptions;
                function processTVShows(tvshowset, tvshowitemcallback) {
                    if (tvshowset && tvshowset.tvshows && tvshowset.tvshows.length) {
                        tvshowset.tvshows.forEach(function (tvshow) {
                            if (tvshow.genre) {
                                var albtype = typeof tvshow.genre;
                                if (albtype === 'object') {
                                    tvshow.allgenres = tvshow.genre;
                                    tvshow.genre = tvshow.allgenres.join(', ');
                                }
                            }
                            if (tvshowitemcallback)
                                tvshowitemcallback(tvshow);
                        });
                    }
                }
                TVShows.processTVShows = processTVShows;
                function getAllTVShows() {
                    var data = TVShowOptions(true);
                    return API.kodiRequest('VideoLibrary.GetTVShows', data, false, true).then(function (tvshows) {
                        processTVShows(tvshows);
                        return WinJS.Promise.wrap(tvshows);
                    });
                }
                TVShows.getAllTVShows = getAllTVShows;
                function getTVShowsGenres() {
                    return API.kodiRequest('VideoLibrary.GetGenres', { type: "tvshow", "sort": { "method": "label", "order": "ascending" } }, false, true);
                }
                TVShows.getTVShowsGenres = getTVShowsGenres;
                function getRecentEpisodes() {
                    var data = TVShowEpisodeOptions(true);
                    return API.kodiRequest('VideoLibrary.GetRecentlyAddedEpisodes', data, false, true);
                }
                TVShows.getRecentEpisodes = getRecentEpisodes;
                function getTVShowDetails(tvshowid) {
                    var data = TVShowOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetTVShowDetails', data);
                }
                TVShows.getTVShowDetails = getTVShowDetails;
                function getTVShowSeasons(tvshowid) {
                    var data = TVShowSeasonOptions(true);
                    data.tvshowid = tvshowid;
                    return API.kodiRequest('VideoLibrary.GetSeasons', data);
                }
                TVShows.getTVShowSeasons = getTVShowSeasons;
                function getTVShowEpisodes(tvshowid, seasonid) {
                    var data = TVShowEpisodeOptions(true);
                    data.tvshowid = tvshowid;
                    data.season = seasonid;
                    return API.kodiRequest('VideoLibrary.GetEpisodes', data);
                }
                TVShows.getTVShowEpisodes = getTVShowEpisodes;
                function getTVShowEpisodeDetails(episodeid) {
                    return API.kodiRequest('VideoLibrary.GetEpisodes', { episodeid: episodeid });
                }
                TVShows.getTVShowEpisodeDetails = getTVShowEpisodeDetails;
                function playEpisode(episodeid) {
                    return API.kodiRequest('Player.Open', { "item": { "episodeid": episodeid } }, true);
                }
                TVShows.playEpisode = playEpisode;
                function queueEpisode(episodeid) {
                    return API.kodiRequest('Playlist.Add', { "playlistid": 0, "item": { "episodeid": episodeid } }, true);
                }
                TVShows.queueEpisode = queueEpisode;
                function scan() {
                    return API.kodiRequest('VideoLibrary.Scan', {});
                }
                TVShows.scan = scan;
            })(TVShows = Videos.TVShows || (Videos.TVShows = {}));
        })(Videos = API.Videos || (API.Videos = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Videos;
        (function (Videos) {
            var Movies;
            (function (Movies) {
                function MovieOptions(detailed) {
                    if (typeof detailed === "undefined") {
                        detailed = false;
                    }
                    var res;
                    if (detailed) {
                        res = {
                            "properties": [
                                "title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline",
                                "originaltitle", "lastplayed", "playcount", "writer", "studio", "mpaa", "cast", "country",
                                "set", "showlink", "streamdetails",
                                "votes", "fanart", "thumbnail", "file", "sorttitle", "resume", "setid"
                            ],
                            "sort": { "method": "label", "order": "ascending" }
                        };
                        if (API.version && API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                    else {
                        res = {
                            "properties": ["thumbnail", "fanart", "title", "originaltitle", "genre", "director", "year", "rating", "lastplayed"],
                            "sort": { "method": "label", "order": "ascending" }
                        };
                        if (Kodi.API.version && Kodi.API.version.major >= 12) {
                            res.properties.push("art");
                        }
                        return res;
                    }
                }
                Movies.MovieOptions = MovieOptions;
                function MovieSetOptions(detailed) {
                    if (typeof detailed === "undefined") {
                        detailed = false;
                    }
                    return {
                        "properties": [
                            "title", "playcount", "fanart", "thumbnail"
                        ], "sort": { "method": "label", "order": "ascending" }
                    };
                }
                Movies.MovieSetOptions = MovieSetOptions;
                function processMovies(movieset, movieItemCallback) {
                    if (movieset && movieset.movies && movieset.movies.length) {
                        movieset.movies.forEach(function (movie) {
                            if (movie.genre) {
                                var albtype = typeof movie.genre;
                                if (albtype === 'object') {
                                    movie.allgenres = movie.genre;
                                    movie.genre = movie.allgenres.join(', ');
                                }
                            }
                            //movie.reducedtitle = MCNEXT.Utils.reduceStringForSearch(movie.label);
                            //movie.reducedgenre = MCNEXT.Utils.reduceStringForSearch(movie.genre);
                            if (movieItemCallback)
                                movieItemCallback(movie);
                        });
                    }
                }
                Movies.processMovies = processMovies;
                function getMovieGenres() {
                    return API.kodiRequest('VideoLibrary.GetGenres', { type: "movie", "sort": { "method": "label", "order": "ascending" } }, false, true);
                }
                Movies.getMovieGenres = getMovieGenres;
                function getAllMovies() {
                    var data = MovieOptions(true);
                    return API.kodiRequest('VideoLibrary.GetMovies', data, false, true).then(function (movies) {
                        processMovies(movies);
                        return WinJS.Promise.wrap(movies);
                    });
                }
                Movies.getAllMovies = getAllMovies;
                function getAllMovieSets() {
                    var data = MovieSetOptions();
                    return API.kodiRequest('VideoLibrary.GetMovieSets', data, false, true);
                }
                Movies.getAllMovieSets = getAllMovieSets;
                function getMovieDetails(movieid) {
                    var data = MovieOptions(true);
                    data.movieid = movieid;
                    return API.kodiRequest('VideoLibrary.GetMovieDetails', data);
                }
                Movies.getMovieDetails = getMovieDetails;
                function getRecentMovies() {
                    var data = MovieOptions(true);
                    return API.kodiRequest('VideoLibrary.GetRecentlyAddedMovies', data, false, true);
                }
                Movies.getRecentMovies = getRecentMovies;
                function playMovie(movieid) {
                    return API.kodiRequest('Player.Open', { "item": { "movieid": movieid } }, true);
                }
                Movies.playMovie = playMovie;
                function scan() {
                    return API.kodiRequest('VideoLibrary.Scan', {});
                }
                Movies.scan = scan;
            })(Movies = Videos.Movies || (Videos.Movies = {}));
        })(Videos = API.Videos || (API.Videos = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

var Kodi;
(function (Kodi) {
    var API;
    (function (API) {
        var Websocket;
        (function (Websocket) {
            Websocket.current;
            function socketOpen(evt) {
                console.log('socket opened');
            }
            function socketClosed(evt) {
                Websocket.current = undefined;
                console.log('socket closed');
            }
            function socketMessage(evt) {
                var data = evt.data ? JSON.parse(evt.data) : undefined;
                console.log(evt.data);
                if (data.method) {
                    WinJS.Application.queueEvent({ type: data.method, data: data });
                }
            }
            function socketError(evt) {
                console.log(evt.type);
            }
            function register() {
                Websocket.current.onopen = socketOpen;
                Websocket.current.onclose = socketClosed;
                Websocket.current.onmessage = socketMessage;
                Websocket.current.onerror = socketError;
            }
            function init(setting) {
                Websocket.current = new WebSocket('ws://' + setting.host + ':9090/jsonrpc');
                register();
            }
            Websocket.init = init;
            function close() {
                if (isReady()) {
                    Websocket.current.close();
                }
                Websocket.current = undefined;
            }
            Websocket.close = close;
            function isReady() {
                return Websocket.current && Websocket.current.OPEN === 1;
            }
            Websocket.isReady = isReady;
            function sendData(data, forceCheck, ignoreXBMCErrors) {
                if (!isReady())
                    return WinJS.Promise.wrapError({ message: 'websocket not ready' });
                return new WinJS.Promise(function (complete, error) {
                    Websocket.current.onmessage = function (evt) {
                        complete(evt.data);
                        register();
                        if (forceCheck)
                            WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
                    };
                    Websocket.current.onerror = function (evt) {
                        if (ignoreXBMCErrors)
                            complete();
                        else
                            error(evt.message);
                        register();
                    };
                    var pushdata = JSON.stringify(data);
                    Websocket.current.send(pushdata);
                });
            }
            Websocket.sendData = sendData;
        })(Websocket = API.Websocket || (API.Websocket = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));

//# sourceMappingURL=kodi.js.map