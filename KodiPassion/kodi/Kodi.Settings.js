var Kodi;
(function (Kodi) {
    var Settings;
    (function (Settings) {
        var applicationData = Windows.Storage.ApplicationData.current;
        var kodiServers = 'xbmcAPISettings';
        var currentSettings;
        function saveSetting(name, settings) {
            applicationData.roamingSettings.values[name] = JSON.stringify(settings);
        }
        function loadSetting(name) {
            var content = applicationData.roamingSettings.values[name];
            if (!content)
                return;
            return JSON.parse(content);
        }
        function read(name) {
            return currentSettings.servers[name];
        }
        currentSettings = loadSetting(kodiServers);
        if (!currentSettings)
            currentSettings = {
                defaultSetting: 'Default',
                servers: {
                    Default: {
                        name: 'Default',
                        host: '',
                        port: '',
                        user: '',
                        password: '',
                        macAddress: []
                    }
                }
            };
        function save(initialName, setting, setDefault) {
            if (initialName !== setting.name) {
                delete currentSettings.servers[initialName];
                if (currentSettings.defaultSetting === initialName)
                    currentSettings.defaultSetting = setting.name;
            }
            if (setDefault) {
                currentSettings.defaultSetting = setting.name;
            }
            currentSettings.servers[setting.name] = setting;
            saveSetting(kodiServers, currentSettings);
        }
        Settings.save = save;
        function remove(name) {
            delete currentSettings.servers[name];
            saveSetting(kodiServers, currentSettings);
        }
        Settings.remove = remove;
        function getSetting(name) {
            return currentSettings.servers[name];
        }
        Settings.getSetting = getSetting;
        function load() {
            var defaultsetting = currentSettings.servers[currentSettings.defaultSetting];
            if (!defaultsetting)
                defaultsetting = {
                    name: currentSettings.defaultSetting,
                    host: '',
                    port: '',
                    user: '',
                    password: '',
                    macAddress: []
                };
            return defaultsetting;
        }
        Settings.load = load;
        function defaultConnection() {
            return currentSettings.defaultSetting;
        }
        Settings.defaultConnection = defaultConnection;
        function list() {
            var res = [];
            for (var key in currentSettings.servers) {
                if (currentSettings.servers.hasOwnProperty(key)) {
                    res.push(key);
                }
            }
            return res;
        }
        Settings.list = list;
    })(Settings = Kodi.Settings || (Kodi.Settings = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.Settings.js.map