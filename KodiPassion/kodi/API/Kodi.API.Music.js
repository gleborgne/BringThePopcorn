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
//# sourceMappingURL=Kodi.API.Music.js.map