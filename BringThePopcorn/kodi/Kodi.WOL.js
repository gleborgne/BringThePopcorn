var Kodi;
(function (Kodi) {
    var WOL;
    (function (WOL) {
        function wakeUp(macAddress) {
            var host = '255.255.255.255';
            //host = '192.168.1.255';
            return WinJS.Promise.join([
                doWakeUp(host, '1', macAddress),
                doWakeUp(host, '2', macAddress),
                doWakeUp(host, '3', macAddress),
                doWakeUp(host, '4', macAddress),
                doWakeUp(host, '5', macAddress),
                doWakeUp(host, '6', macAddress),
                doWakeUp(host, '7', macAddress),
                doWakeUp(host, '8', macAddress),
                doWakeUp(host, '9', macAddress)
            ]);
        }
        WOL.wakeUp = wakeUp;
        function doWakeUp(host, service, macAddress) {
            return new WinJS.Promise(function (complete, error) {
                var hostName;
                try {
                    hostName = new Windows.Networking.HostName(host);
                }
                catch (ex) {
                    error({ message: "Invalid host name." });
                    return;
                }
                var clientSocket = new Windows.Networking.Sockets.DatagramSocket();
                function onerror(err) {
                    try {
                        if (clientSocket)
                            clientSocket.close();
                    }
                    catch (ex) {
                    }
                    error(err);
                }
                var ep;
                clientSocket.getOutputStreamAsync(hostName, service).done(function (outputStream) {
                    //});
                    var bytes;
                    bytes = [255, 255, 255, 255, 255, 255];
                    for (var i = 0; i < 16; i++) {
                        for (var m = 0; m < macAddress.length; m++) {
                            bytes.push(parseInt(macAddress[m], 16));
                        }
                    }
                    //clientSocket.connectAsync(hostName, service).done(function () {
                    //var clientDataWriter = new Windows.Storage.Streams.DataWriter(clientSocket.outputStream);
                    var clientDataWriter = new Windows.Storage.Streams.DataWriter(outputStream);
                    clientDataWriter.writeBytes(bytes);
                    clientDataWriter.storeAsync().done(function () {
                        clientDataWriter.close();
                        clientSocket.close();
                        complete();
                    }, onerror);
                }, onerror);
            });
        }
    })(WOL = Kodi.WOL || (Kodi.WOL = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.WOL.js.map