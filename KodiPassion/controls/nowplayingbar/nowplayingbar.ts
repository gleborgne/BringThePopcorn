interface JQueryStatic {
    Velocity: any;
}

module KodiPassion.UI{
    export class NowPlayingBarControl {
        public static url = "/controls/nowplayingbar/nowplayingbar.html";
        element: HTMLElement;
        container: HTMLElement;
        playingElt: HTMLElement;
        contentElt: HTMLElement;

        processed(element, options) {
            this.container = <HTMLElement>document.getElementById("contentwrapper");
            this.playingElt = <HTMLElement>document.getElementById("nowplaying");
            this.contentElt = <HTMLElement>document.getElementById("nowplayingcontent");

            WinJS.Navigation.addEventListener("beforenavigate", () => {
                this.minimize(true);
            });

            return WinJS.Binding.processAll(this.element, Kodi.NowPlaying.current);
        }

        toggleView() {
            var ctrl = this;

            if (document.body.classList.contains("nowplaying-expanded")) {
                this.minimize();
            } else {
                this.maximize();
            }
        }

        maximize() {
            var ctrl = this;
            if (!document.body.classList.contains("nowplaying-expanded")) {
                var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                ctrl.playingElt.style.height = 'auto';
                $.Velocity.hook(ctrl.playingElt, "top", target + "px");
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 120);
                $.Velocity(ctrl.playingElt, { top: '0px' }, { duration: 200, easing: 'easeOutQuart' }).then(function () {
                    document.body.classList.add("nowplaying-expanded");
                });
            }
        }

        minimize(instantly?:boolean) {
            var ctrl = this;
            if (document.body.classList.contains("nowplaying-expanded")) {
                if (instantly) {
                    ctrl.playingElt.style.top = '';
                    ctrl.playingElt.style.height = '';
                    document.body.classList.remove("nowplaying-expanded");
                    return;
                }
                var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                $.Velocity.hook(ctrl.playingElt, "top", "0");
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(0, 90);
                $.Velocity(ctrl.playingElt, { top: target + 'px' }, { duration: 90, easing: 'easeOutQuart' }).then(function () {
                    ctrl.playingElt.style.height = '';
                    ctrl.playingElt.style.top = '';
                    document.body.classList.remove("nowplaying-expanded");
                });
            }
        }
    }

    export var NowPlayingSummary = WinJS.UI.Pages.define(NowPlayingBarControl.url, NowPlayingBarControl);
}
