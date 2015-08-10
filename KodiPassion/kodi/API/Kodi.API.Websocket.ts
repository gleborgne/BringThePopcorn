module Kodi.API.Websocket {

    export var current;

    function socketOpen(evt) {
        console.log('socket opened');
    }

    function socketClosed(evt) {
        current = undefined;
        console.log('socket closed');
    }

    function socketMessage(evt) {
        var data = evt.data ? JSON.parse(evt.data) : undefined;
        console.log(evt.data);

        if (data.method) {
            WinJS.Application.queueEvent({ type: data.method, data: data });
        }
    }

    function socketError(evt) {
        console.log(evt.type);
    }

    function register() {
        current.onopen = socketOpen;
        current.onclose = socketClosed;
        current.onmessage = socketMessage;
        current.onerror = socketError;
    }

    export function init(settings) {
        current = new WebSocket('ws://' + settings.host + ':9090/jsonrpc');

        register();
    }

    export function close() {
        if (isReady()) {
            current.close();
        }
        current = undefined;
    }
    
    export function isReady() {
        return current && current.OPEN === 1;
    }
    
    export function sendData(data, forceCheck, ignoreXBMCErrors) {
        if (!isReady())
            return WinJS.Promise.wrapError({ message : 'websocket not ready' });

        return new WinJS.Promise(function (complete, error) {
            current.onmessage = function (evt) {
                complete(evt.data);
                register();

                if (forceCheck)
                    WinJS.Application.queueEvent({ type: 'xbmcplayercheck' });
            };
            current.onerror = function (evt) {
                if (ignoreXBMCErrors)
                    complete();
                else
                    error(evt.message);

                register();
            };
            var pushdata = JSON.stringify(data);
            current.send(pushdata);
        });
    }
}