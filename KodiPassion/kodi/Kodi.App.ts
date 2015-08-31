
module Kodi.App {
    export var DefaultGridLayout = {
        horizontal: { query: '(orientation: landscape)', layout: 'horizontal' },
        vertical: { query: '(orientation: portrait)', layout: 'vertical' },
        snapped: { query: '(orientation: portrait) and (max-width: 340px)', layout: 'vertical' }
    };

    export var DefaultListLayout = {
        hor: { query: '(orientation: landscape)', layout: WinJS.UI.GridLayout, options: { orientation: 'horizontal', groupHeaderPosition: 'left' } },
        vert: { query: '(orientation: portrait)', layout: WinJS.UI.GridLayout, options: { orientation: 'vertical', groupHeaderPosition: 'top' } }
    };      
    
    export var PictureRatios = {
        fanart: 1.7778,
        movieposter: 0.6667,
        tvshowepisode: 1.7778,
        album: 1.1,
        actor: 0.6667,
    }; 

    export function playLocalMedia(kodipath){
        return new WinJS.Promise((complete, error) => {
            var path = Kodi.Utils.getNetworkPath(kodipath);
            var uri = new Windows.Foundation.Uri(path);
            var opt = <any>new Windows.System.LauncherOptions();
            opt.desiredRemainingView = (<any>(Windows.UI.ViewManagement)).ViewSizePreference.useNone;
            Windows.System.Launcher.launchUriAsync(uri, opt).done((a) => {
                if (a == true) {
                    complete();
                }
                else {
                    error();
                    WinJSContrib.Alerts.message('unable to play media', 'cannot play this media. Check the network path you set in your Kodi/XBMC (due to Windows constraints, path with server IP will not work, use server name instead within your media server)');
                }
            }, error);
        });
    }
}

interface JQuery {
    winControl();
    tap(handler: (eventObject: HTMLElement) => any);
    untap();
    afterTransition(callback?: (JQuery) => void): WinJS.Promise<any>;
    afterAnimation(callback?: (JQuery) => void): WinJS.Promise<any>;
    classBasedAnimation(className: string);
    winJSAnimation(animName: string, offset?);
    scrollToView(horizontal?: boolean);
    scrollInView(offset: number);
    ctrlShow(elt?);
    ctrlHide();
}