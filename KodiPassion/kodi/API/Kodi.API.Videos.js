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
                            ]
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
                    var data = MovieOptions();
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
                    var data = MovieOptions();
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
//# sourceMappingURL=Kodi.API.Videos.js.map