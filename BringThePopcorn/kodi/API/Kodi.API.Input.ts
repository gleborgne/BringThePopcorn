module Kodi.API.Input {
    //export function properties() {
    //    return API.kodiRequest<any>('Application.GetProperties', { properties: ["muted", "volume", "version"] });
    //}
    
    export function mute(mute:boolean) {
        if (Kodi.NowPlaying.current)
            Kodi.NowPlaying.current.muted = mute;
        return API.kodiRequest<any>('Application.SetMute', { mute: mute });
    }

    export function volumeMute() {        
        return mute(true);
    }

    export function volumeUnmute() {
        return mute(false);
    }
    
    export function volume(volume) {
        if (Kodi.NowPlaying.current)
            Kodi.NowPlaying.current.volume = volume;
        return API.kodiRequest<any>('Application.SetVolume', { volume: volume });
    }

    export function back() {
        return API.kodiRequest<any>('Input.Back');
    }

    export function home() {
        return API.kodiRequest<any>('Input.Home');
    }

    export function select() {
        return API.kodiRequest<any>('Input.Select');
    }

    export function menu() {
        return API.kodiRequest<any>('Input.ContextMenu');
    }

    export function info() {
        return API.kodiRequest<any>('Input.Info');
    }

    export function up() {
        return API.kodiRequest<any>('Input.Up');
    }

    export function down() {
        return API.kodiRequest<any>('Input.Down');
    }

    export function left() {
        return API.kodiRequest<any>('Input.Left');
    }

    export function right() {
        return API.kodiRequest<any>('Input.Right');
    }

    export function activateWindow(window, parameters) {
        return kodiRequest('GUI.ActivateWindow', { window: window, parameters: parameters }, false, true);
    }

    export function openMovies() {
        return activateWindow("videos", ["videodb://movies/titles/"]);
    }

    export function openTvShows() {
        return activateWindow("videos", ["videodb://tvshows/titles/"]);
    }

    export function openMusic() {
        return activateWindow("musiclibrary", ["musicdb://albums/"]);
    }

    export function openPictures() {
        return activateWindow("pictures", ["picturedb://"]);
    }
}