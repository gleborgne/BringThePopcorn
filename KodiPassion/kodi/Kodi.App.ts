
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