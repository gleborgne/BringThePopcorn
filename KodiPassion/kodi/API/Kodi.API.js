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
                            WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
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
//# sourceMappingURL=Kodi.API.js.map