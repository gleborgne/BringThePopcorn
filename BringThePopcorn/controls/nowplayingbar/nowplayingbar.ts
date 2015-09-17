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
        rangeSeek: HTMLInputElement;

        processed(element, options) {
            this.container = <HTMLElement>document.getElementById("contentwrapper");
            this.playingElt = <HTMLElement>document.getElementById("nowplaying");
            this.contentElt = <HTMLElement>document.getElementById("nowplayingcontent");

            WinJS.Navigation.addEventListener("beforenavigate", () => {
                this.minimize(true);
            });

            this.rangeSeek.onchange = () => {
                var progressval = parseInt(this.rangeSeek.value);
                console.log("seek to " + progressval);
                Kodi.API.Player.seek(Kodi.NowPlaying.current.playerid, progressval).then(function (r) {
                    Kodi.NowPlaying.current.progress = progressval;
                }, function (err) {
                    var e = err;
                });
            }

            KodiPassion.mapKodiApi(element);
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
                //var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                //ctrl.playingElt.style.height = 'auto';
                //$.Velocity.hook(ctrl.playingElt, "top", target + "px");
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 120);
                
                document.body.classList.add("nowplaying-expanded");
                Kodi.NowPlaying.current.expanded = true;
            }
        }

        minimize(instantly?:boolean) {
            var ctrl = this;
            if (document.body.classList.contains("nowplaying-expanded")) {
                //if (instantly) {
                //    ctrl.playingElt.style.transform = '';
                //    document.body.classList.remove("nowplaying-expanded");
                //    return;
                //}
               // var target = ctrl.container.clientHeight - ctrl.element.clientHeight;
                //$.Velocity.hook(ctrl.playingElt, "top", "0");
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(0, 90);
                document.body.classList.remove("nowplaying-expanded");
                Kodi.NowPlaying.current.expanded = false;
            }
        }
    }

    export var NowPlayingSummary = WinJS.UI.Pages.define(NowPlayingBarControl.url, NowPlayingBarControl);
}
