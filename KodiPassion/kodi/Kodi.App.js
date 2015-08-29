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
        function playLocalMedia(kodipath) {
            return new WinJS.Promise(function (complete, error) {
                var path = Kodi.Utils.getNetworkPath(kodipath);
                var uri = new Windows.Foundation.Uri(path);
                var opt = new Windows.System.LauncherOptions();
                opt.desiredRemainingView = (Windows.UI.ViewManagement).ViewSizePreference.useNone;
                Windows.System.Launcher.launchUriAsync(uri, opt).done(function (a) {
                    if (a == true) {
                        complete();
                    }
                    else {
                        complete();
                        WinJSContrib.Alerts.message('unable to play media', 'cannot play this media. Check the network path you set in your Kodi/XBMC (due to Windows constraints, path with server IP will not work, use server name instead within your media server)');
                    }
                }, error);
            });
        }
        App.playLocalMedia = playLocalMedia;
    })(App = Kodi.App || (Kodi.App = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.App.js.map