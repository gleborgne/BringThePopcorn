module Kodi.Settings {
    export interface KodiServerSetting {
        name: string;
        host: string;
        port: number;
        user: string;
        password: string;
        macAddress: string[];
    }

    var applicationData = Windows.Storage.ApplicationData.current;
    var kodiServers = 'kodiAPISettings';
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
                Default: <KodiServerSetting>{
                    name: 'Default',
                    host: '',
                    port: 80,
                    user: 'kodi',
                    password: '',
                    macAddress: []
                }
            }
        };

    export function save(initialName, setting, setDefault) {
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
    
    export function remove(name) {
        delete currentSettings.servers[name];
        saveSetting(kodiServers, currentSettings);
    }
    
    export function getSetting(name) {
        return currentSettings.servers[name];
    }
    
    export function load() {
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
    
    export function defaultConnection() {
        return currentSettings.defaultSetting;
    }

    export function list() {
        var res = [];
        for (var key in currentSettings.servers) {
            if (currentSettings.servers.hasOwnProperty(key)) {
                res.push(key);
            }
        }
        return res;
    }
}