module Kodi.API {

    var apiUrl = 'http://192.168.1.67:80';
    var apiId = 0;
    var apiVersion = '2.0';
    export var defaultCallTimeout = 10;

    export var currentSettings: Kodi.Settings.KodiServerSetting;
    export var version;
    export interface KodiRequest {
        albumid?: number;
        genreid?: number;
        artistid?: number;
        movieid?: number;
        tvshowid?: number;
        season?: number;
        properties?: string[];
        sort?: {
            method: string;
            order: string;
        }
    }

    export function redirectToSettings(error) {
        if (error === 'noplayer')
            return WinJS.Promise.wrap();

        return WinJS.Navigation.navigate("/pages/settings/settings.html", { setting: API.currentSettings, error: error });
    }
    
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

    export function kodiServerRequest<T>(setting: Kodi.Settings.KodiServerSetting, methodname, params?, forceCheck?, ignoreXBMCErrors?, retries?): WinJS.Promise<T> {
        var p, completed = false, completeCallback, errorCallback = null;
        p = new WinJS.Promise<T>(function (complete, error) {
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

        var reqdata = <any>{
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
                } else {
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
                } else {
                    completed = true;
                    errorCallback(data);
                }
            }
        });
        //});

        return WinJS.Promise.timeout(API.defaultCallTimeout * 1000, p);
    }

    export function testServerSetting(setting: Kodi.Settings.KodiServerSetting): WinJS.Promise<any> {
        return kodiServerRequest(setting, 'Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, false, 2);
    }

    export function kodiRequest<T>(methodname, params?, forceCheck?, ignoreXBMCErrors?, retries?): WinJS.Promise<T> {
        return kodiServerRequest(API.currentSettings, methodname, params, forceCheck, ignoreXBMCErrors, retries).then(function (data) {
            if (API.version && API.version.major >= 12 && !Kodi.API.Websocket.current) {
                Kodi.API.Websocket.init(API.currentSettings);
            }

            return data;
        });
    }
    
    export function kodiThumbnail(thumburl) {
        var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/vfs/' + encodeURIComponent(thumburl);
        if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
            uri = 'http://' + uri;
        return uri;
    }
    
    export function getFilePath(path) {
        var uri = API.currentSettings.host + ':' + API.currentSettings.port + '/' + path;
        if (!WinJSContrib.Utils.startsWith(uri, 'http://'))
            uri = 'http://' + uri;
        return uri;
    }
    
    export function introspect() {
        return kodiRequest('JSONRPC.Introspect');
    }

    

    export function properties(): WinJS.Promise<any> {
        return kodiRequest('Application.GetProperties', { properties: ["volume", "muted", "version", "name"] }, false, true);
    }

    export interface ApiCall {
        error?: any;
    }

    export interface ApiResultSet extends ApiCall {
        limits: any;
    }

    export interface Genre {
        label: string;
    }

    export interface GenresResultSet extends ApiResultSet {
        genres: Genre[];
    }
}

module Kodi.API.Profiles {
    var profileProperties = ["lockmode", "thumbnail"]
    export function getCurrentProfile(): WinJS.Promise<any> {
        return new WinJS.Promise(function (complete, error) {
            kodiRequest('Profiles.GetCurrentProfile', { properties: profileProperties }).then(function (profile) {
                complete(profile);
            }, function (err) {
                complete();
            });
        });
    }
    
    export function getProfiles(): WinJS.Promise<any> {
        return new WinJS.Promise(function (complete, error) {
            kodiRequest('Profiles.GetProfiles', { properties: profileProperties }).then(function (profiles) {
                complete(profiles);
            }, function (err) {
                complete();
            })
        });

    }
    
    export function loadProfile(name, prompt, password) {
        var arg = <any>{ profile: name };
        if (prompt !== undefined)
            arg.prompt = prompt;
        if (password !== undefined)
            arg.password = password;

        return kodiRequest('Profiles.LoadProfile', arg);
    }    
}


module Kodi.API.PlayList {
    export function getProperties(playlistid) {
        return kodiRequest('Playlist.GetProperties', { playlistid: playlistid });
    }

    export function getItems(playlistid) {
        return kodiRequest('Playlist.GetItems', { playlistid: playlistid, properties: ["set", "setid", "albumid", "album", "duration", "artist", "albumartist", "thumbnail", "tvshowid", "season", "episode"] });
    }

    export function removeAt(playlistid, position) {
        return kodiRequest('Playlist.Remove', { playlistid: playlistid, position: position });
    }

    export function swap(playlistid, position, position2) {
        return kodiRequest('Playlist.Swap', { playlistid: playlistid, position1: position, position2: position2 });
    }

    export function insertSong(playlistid, position, songId) {
        return kodiRequest('Playlist.Insert', { playlistid: playlistid, position: position, item: { songid: songId } });
    }
}

module Kodi.API.Files {
    export function getPicturesDirectory(directory) {
        return kodiRequest('Files.GetDirectory', { directory: directory, media: 'pictures', properties: ["title", "file", "thumbnail"] }, false, true);
    }

    export function getPicturesSources() {
        return kodiRequest('Files.GetSources', { media: 'pictures' }, false, true);
    }

    export function download(path) {
        return kodiRequest('Files.PrepareDownload', { path: path });
    }

    export function getDirectory(media, directory) {
        return kodiRequest('Files.GetDirectory', { directory: directory, media: media, properties: ["title", "file", "thumbnail"] }, false, true);
    }

    export function getSources(media) {
        return kodiRequest('Files.GetSources', { media: media }, false, true);
    }
}

module Kodi.API.System {
    export function shutdown() {
        return kodiRequest('System.Shutdown', {});
    }

    export function hibernate() {
        return kodiRequest('System.Hibernate', {});
    }

    export function reboot() {
        return kodiRequest('System.Reboot', {});
    }

    export function properties() {
        return kodiRequest('System.GetProperties', { properties: ["canreboot", "cansuspend", "canhibernate", "canshutdown"] }, false, true);
    }
}