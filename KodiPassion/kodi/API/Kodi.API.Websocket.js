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
                console.info(evt.data);
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
//# sourceMappingURL=Kodi.API.Websocket.js.map