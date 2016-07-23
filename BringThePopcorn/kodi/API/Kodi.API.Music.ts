module Kodi.API.Music {
    export interface Album {
        albumid: number;
        title: string;
        label: string;
        description?: string;
        allartists: string[];
        artist: string;
        allgenres: string[];
        genre: string;
        theme?: string;
        mood?: string;
        style: string;
        type?: string;
        albumlabel: string;
        rating: number;
        year: number;
        musicbrainzalbumid?: number;
        musicbrainzalbumartistid?: number;
        fanart: string;
        thumbnail: string;
        artistid?: number;
        reducedtitle: string;
        reducedartist: string;
        reducedgenre: string;
    }

    export interface AlbumsResultSet extends API.ApiResultSet {
        albums: Album[];
    }

    export interface AlbumDetailResultSet extends API.ApiResultSet {
        albumdetails: Album;
    }

    export interface Song {
        songid: number;
        track: string;
        file: string;
        duration: number;
    }

    export interface SongsResultSet extends API.ApiResultSet {
        songs: Song[];
    }

    export interface Artist {
        label: string;
        reducedlabel?: string;
    }

    export function processAlbums(albumset: AlbumsResultSet, albumitemcallback?: (Album) => void) {
        if (albumset && albumset.albums && albumset.albums.length) {
            albumset.albums.forEach(function (album) {                
                if (album.artist) {
                    var albtype = typeof album.artist;
                    if (albtype === 'object') {
                        album.allartists = <any>album.artist;
                        album.artist = album.artist[0];
                    }
                }
                if (album.genre) {
                    var albtype = typeof album.genre;
                    if (albtype === 'object') {
                        album.allgenres = <any>album.genre;
                        album.genre = album.allgenres.join(', ');
                    }
                }

                if (albumitemcallback)
                    albumitemcallback(album);
            });
        }
    }
    
    function AlbumOptions(detailed?): KodiRequest {
        if (typeof detailed === "undefined") { detailed = false; }
        if (detailed) {
            return {
                "properties": [
                    "title", "description", "artist", "genre", "theme", "mood", "style", "type", "albumlabel",
                    "rating", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart", "thumbnail", "artistid"
                ]
            };
        } else {
            return { "properties": ["thumbnail", "fanart", "artist", "style", "albumlabel", "genre", "year", "rating"], "sort": { "method": "label", "order": "ascending" } };
        }
    }

    export function getGenres(): WinJS.Promise<GenresResultSet> {
        return API.kodiRequest('AudioLibrary.GetGenres', { "sort": { "method": "label", "order": "ascending" } }, false, true);
    }

    export function getArtists() {
        return API.kodiRequest('AudioLibrary.GetArtists', { "sort": { "method": "label", "order": "ascending" } });
    }

    export function scan() {
        return API.kodiRequest('AudioLibrary.Scan', {});
    }

    export function clean() {
        return API.kodiRequest('AudioLibrary.Clean', {});
    }


    //export function getFiles() : WinJS.Promise<any>  {
    //    return xbmcRequest('Files.GetSources', { "media": "music", "sort": { "method": "label", "order": "ascending" } });
    //}
    //export function getFilePath(path) : WinJS.Promise<any>  {
    //    return xbmcRequest('Files.GetDirectory', { "directory": path, "sort": { "method": "label", "order": "ascending" } });
    //}
    export function getAllAlbums() {
        var data = AlbumOptions();
        return API.kodiRequest<AlbumsResultSet>('AudioLibrary.GetAlbums', data, false, true).then(function (albums) {
            processAlbums(albums);
            return albums;
        });
    }
    
    export function getAlbumDetails(albumid) {
        var data = AlbumOptions(true);
        data.albumid = albumid;
        return API.kodiRequest<AlbumDetailResultSet>('AudioLibrary.GetAlbumDetails', data);
    }

    export function getRecentAlbums() {
        var data = AlbumOptions();
        return API.kodiRequest<AlbumsResultSet>('AudioLibrary.GetRecentlyAddedAlbums', data, false, true).then(function (albums) {
            processAlbums(albums);
            return albums;
        });
    }

    export function getAlbumsByArtist(artistid) {
        var data = AlbumOptions();
        data.artistid = artistid;
        return API.kodiRequest<AlbumsResultSet>('AudioLibrary.GetAlbums', data).then(function (albums) {
            processAlbums(albums);
            return albums;
        });
    }

    export function getAlbumsByGenre(genreid) {
        var data = AlbumOptions();
        data.genreid = genreid;
        return API.kodiRequest<AlbumsResultSet>('AudioLibrary.GetAlbums', data).then(function (albums) {
            processAlbums(albums);
            return albums;
        });
    }
    
    export function albumSongs(albumid) {
        if (API.version.major >= 12)
            return API.kodiRequest<SongsResultSet>('AudioLibrary.GetSongs', { filter: { albumid: albumid }, "properties": ["track", "duration", "file"] /*, "sort": { "method": "track", "order": "ascending" } */ });
        else
            return API.kodiRequest<SongsResultSet>('AudioLibrary.GetSongs', { "albumid": albumid, "properties": ["track", "duration", "file"], "sort": { "method": "track", "order": "ascending" } });
    }
    
    export function playAlbum(albumid) {
        return API.kodiRequest<any>('Player.Open', { "item": { "albumid": albumid } }, true);
    }

    export function queueAlbum(albumid) {
        return API.kodiRequest<any>('Playlist.Add', { "playlistid": 0, "item": { "albumid": albumid } }, true);
    }

    export function playSong(songid) {
        return API.kodiRequest<any>('Player.Open', { "item": { "songid": songid } }, true);
    }

    export function queueSong(songid) {
        return API.kodiRequest<any>('Playlist.Add', { "playlistid": 0, "item": { "songid": songid } }, true);
    }
}