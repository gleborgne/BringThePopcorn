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
    })(App = Kodi.App || (Kodi.App = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.App.js.map