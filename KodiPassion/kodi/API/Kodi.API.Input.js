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
        })(Input = API.Input || (API.Input = {}));
    })(API = Kodi.API || (Kodi.API = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.API.Input.js.map