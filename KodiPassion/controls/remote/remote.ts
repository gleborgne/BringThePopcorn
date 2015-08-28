module KodiPassion.UI {

    export class RemoteControllerControl {
        public static url = "/controls/remote/remote.html";

        language: HTMLSelectElement;
        subtitle: HTMLSelectElement;
        rangeVolume: HTMLInputElement;
        rangeSeek: HTMLInputElement;
        eventTracker: WinJSContrib.UI.EventTracker;

        processed(element, options) {
            KodiPassion.mapKodiApi(element);
            this.loadLanguages();
            this.loadSubtitles();
            this.rangeVolume.onchange = () => {
                var volumeval = parseInt(this.rangeVolume.value);
                Kodi.API.Input.volume(volumeval);
            }

            this.rangeSeek.onchange = () => {
                var progressval = parseInt(this.rangeSeek.value);
                console.log("seek to " + progressval);
                Kodi.API.Player.seek(Kodi.NowPlaying.current.playerid, progressval).then(function (r) {
                    Kodi.NowPlaying.current.progress = progressval;
                }, function (err) {
                    var e = err;
                });
            }

            return WinJS.Binding.processAll(element, Kodi.NowPlaying.current);
        }

        loadLanguages() {
            this.eventTracker.addBinding(Kodi.NowPlaying.current, "hasLanguages", () => {
                this.language.innerHTML = "";
                if (Kodi.NowPlaying.current.audiostreams) {
                    Kodi.NowPlaying.current.audiostreams.forEach((audiostream) => {
                        var selected = Kodi.NowPlaying.current.currentaudiostream.name == audiostream.name;
                        var o = <HTMLOptionElement>document.createElement("OPTION");
                        o.selected = selected;
                        o.value = audiostream.index;
                        o.innerText = audiostream.name;
                        this.language.appendChild(o);
                    });
                }
            });


            this.language.onchange = () => {
                var lng = <any>this.language.value;
                if (lng) {
                    lng = parseInt(lng);
                    Kodi.API.Player.setAudioStream(Kodi.NowPlaying.current.playerid, lng).done(() => {
                        Kodi.NowPlaying.check().done((props: any) => {
                            console.log('subtitles changed to ' + props.currentaudiostream.name);
                            this.language.value = props.currentaudiostream.index;
                            //$('.languagelabel', page.element).html(toStaticHTML(props.currentaudiostream.name));
                        });
                    });
                }
            }
        }

        loadSubtitles(){
            this.eventTracker.addBinding(Kodi.NowPlaying.current, "id", () => {
                this.subtitle.innerHTML = "";
                if (Kodi.NowPlaying.current.subtitles) {
                    var o = <HTMLOptionElement>document.createElement("OPTION");
                    o.value = "off";
                    o.innerText = "off";
                    o.selected = !Kodi.NowPlaying.current.subtitleenabled;
                    this.subtitle.appendChild(o);

                    Kodi.NowPlaying.current.subtitles.forEach((subtitle) => {
                        var selected = Kodi.NowPlaying.current.currentsubtitle.name == subtitle.name;
                        var o = <HTMLOptionElement>document.createElement("OPTION");
                        o.selected = selected;
                        o.value = subtitle.index;
                        o.innerText = subtitle.name;
                        this.subtitle.appendChild(o);
                    });
                }
            });


            this.subtitle.onchange = () => {
                var subtitle = <any>this.subtitle.value;
                    if (subtitle) {
                        if (subtitle != 'off')
                            subtitle = parseInt(subtitle);

                        Kodi.API.Player.setSubtitle(Kodi.NowPlaying.current.playerid, subtitle).done(() => {
                            if (subtitle != 'off' && !Kodi.NowPlaying.current.subtitleenabled) {
                                Kodi.API.Player.setSubtitle(Kodi.NowPlaying.current.playerid, 'on').done(() => {
                                    Kodi.NowPlaying.check().done((props:any) => {
                                        console.log('subtitles changed to ' + props.currentsubtitle.name);
                                        this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    });
                                });
                            } else {
                                Kodi.NowPlaying.check().done((props:any) => {
                                    if (!props.subtitleenabled) {
                                        console.log('subtitles changed to off');
                                        this.subtitle.value = 'off';
                                    } else {
                                        console.log('subtitles changed to ' + props.currentsubtitle.name);
                                        this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                    }
                                });
                            }
                        });
                    }
            }

            //var subtitles = $('#subtitle', element);
            //subtitles.html('');
            //if (subtitles.length && XBMC.NowPlaying.current.subtitles && XBMC.NowPlaying.current.subtitles.length) {
            //    subtitles.append('<option ' + (XBMC.NowPlaying.current.subtitleenabled ? 'selected' : '') + ' value="off">off</option>')
            //    XBMC.NowPlaying.current.subtitles.forEach(function (subtitle) {
            //        var selected = XBMC.NowPlaying.current.subtitleenabled ? (XBMC.NowPlaying.current.currentsubtitle.name == subtitle.name ? 'selected' : '') : '';
            //        subtitles.append('<option ' + selected + ' value="' + subtitle.index + '">' + subtitle.name + '</option>');
            //    });
            //    subtitles[0].onchange = function () {
            //        var subtitle = subtitles.val();
            //        if (subtitle) {
            //            if (subtitle != 'off')
            //                subtitle = parseInt(subtitle);

            //            XBMC.API.Player.setSubtitle(XBMC.NowPlaying.current.playerid, subtitle).done(function () {
            //                if (subtitle != 'off' && !XBMC.NowPlaying.current.subtitleenabled) {
            //                    XBMC.API.Player.setSubtitle(XBMC.NowPlaying.current.playerid, 'on').done(function () {
            //                        XBMC.NowPlaying.check().done(function (props) {
            //                            console.log('subtitles changed to ' + props.currentsubtitle.name);
            //                            subtitles.val(XBMC.NowPlaying.current.currentsubtitle.index);
            //                        });
            //                    });
            //                } else {
            //                    XBMC.NowPlaying.check().done(function (props) {
            //                        if (!props.subtitleenabled) {
            //                            console.log('subtitles changed to off');
            //                            subtitles.val('off');
            //                        } else {
            //                            console.log('subtitles changed to ' + props.currentsubtitle.name);
            //                            subtitles.val(XBMC.NowPlaying.current.currentsubtitle.index);
            //                        }
            //                    });
            //                }
            //            });
            //        }
            //    };
            //}
        }
    }

    export var RemoteController = WinJS.UI.Pages.define(RemoteControllerControl.url, RemoteControllerControl);
}
