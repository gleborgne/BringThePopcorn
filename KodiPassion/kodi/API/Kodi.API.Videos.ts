module Kodi.API.Videos.Movies {
    export interface Movie extends ApiCall {
        movieid: number;
        label: string;
        title: string;
        genre: string;
        allgenres: string[];
        year: string;
        rating: string;
        director: string;
        trailer?: string;
        tagline: string;
        plot?: string;
        plotoutline?: string;
        originaltitle: string;
        lastplayed?: string;
        playcount: string;
        writer?: string;
        studio?: string;
        mpaa?: string;
        cast?: Cast[];
        country?: string;
        set?: string;
        showlink?: string;
        streamdetails?: string;
        votes: string;
        fanart: string;
        thumbnail: string;
        file?: string;
        sorttitle?: string;
        resume?: { position: number, total: number };
        setid?: string;
        art?: any;
        reducedtitle: string;
        reducedgenre: string;
    }

    export interface MovieSet extends ApiCall {
        movieid: number;
        label: string;
        title: string;
        genre: string;
        allgenres: string[];
        year: string;
        rating: string;
        director: string;
        trailer?: string;
        tagline: string;
        plot?: string;
        plotoutline?: string;
        originaltitle: string;
        lastplayed?: string;
        playcount: string;
        writer?: string;
        studio?: string;
        mpaa?: string;
        cast?: Cast[];
        country?: string;
        set?: string;
        showlink?: string;
        streamdetails?: string;
        votes: string;
        fanart: string;
        thumbnail: string;
        file?: string;
        sorttitle?: string;
        resume?: string;
        setid?: string;
    }

    export interface Cast {
        role: string;
        thumbnail: string;
        name: string;
    }

    export interface MovieResultSet extends ApiResultSet {
        moviedetails: Movie;
    }

    export interface MoviesResultSet extends ApiResultSet {
        movies: Movie[];
    }

    export interface MoviesSetResultSet extends ApiResultSet {
        items: MovieSet[];
    }

    export function MovieOptions(detailed?): KodiRequest {
        if (typeof detailed === "undefined") { detailed = false; }
        var res;
        if (detailed) {
            res = {
                "properties": [
                    "title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline",
                    "originaltitle", "lastplayed", "playcount", "writer", "studio", "mpaa", "cast", "country",
                    "set", "showlink", "streamdetails", "dateadded", "runtime",
                    "votes", "fanart", "thumbnail", "file", "sorttitle", "resume", "setid"
                ],
                "sort": { "method": "label", "order": "ascending" }
            };

            if (API.version && API.version.major >= 12) {
                res.properties.push("art");
            }

            return res;
        } else {
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

    export function MovieSetOptions(detailed?): KodiRequest {
        if (typeof detailed === "undefined") { detailed = false; }
        return {
            "properties": [
                "title", "playcount", "fanart", "thumbnail"
            ], "sort": { "method": "label", "order": "ascending" }
        };
    }
    
    export function processMovies(movieset: MoviesResultSet, movieItemCallback?: (Movie) => any) {
        if (movieset && movieset.movies && movieset.movies.length) {
            movieset.movies.forEach(function (movie) {
                if (movie.genre) {
                    var albtype = typeof movie.genre;
                    if (albtype === 'object') {
                        movie.allgenres = <any>movie.genre;
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

    export function getMovieGenres() {
        return API.kodiRequest('VideoLibrary.GetGenres', { type: "movie", "sort": { "method": "label", "order": "ascending" } }, false, true);
    }

    export function getAllMovies() {
        var data = MovieOptions(true);
        return API.kodiRequest<MoviesResultSet>('VideoLibrary.GetMovies', data, false, true).then(function (movies) {
            processMovies(movies);
            return WinJS.Promise.wrap(movies);
        });
    }

    export function getAllMovieSets() {
        var data = MovieSetOptions();
        return API.kodiRequest<MoviesSetResultSet>('VideoLibrary.GetMovieSets', data, false, true);
    }

    export function getMovieDetails(movieid) {
        var data = MovieOptions(true);
        delete data.sort;
        data.movieid = movieid;
        return API.kodiRequest<MovieResultSet>('VideoLibrary.GetMovieDetails', data);
    }

    export function getRecentMovies() {
        var data = MovieOptions(true);
        return API.kodiRequest<MoviesResultSet>('VideoLibrary.GetRecentlyAddedMovies', data, false, true);
    }

    export function playMovie(movieid, resume?:boolean) {
        var data = <any>{ "item": { "movieid": movieid } };
        if (resume) {
            data.options = { resume: true };
        }
        return API.kodiRequest<any>('Player.Open', data, true);
    }

    export function scan() {
        return API.kodiRequest<any>('VideoLibrary.Scan', {});
    }
}