module KodiPassion.UI {

    export class RemoteControllerControl {
        public static url = "/controls/remote/remote.html";
        static logger = WinJSContrib.Logs.getLogger("KDP.Remote");

        btnProfiles: HTMLElement;
        profilesItems: HTMLElement;
        language: HTMLSelectElement;
        subtitle: HTMLSelectElement;
        rangeVolume: HTMLInputElement;
        rangeSeek: HTMLInputElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        shutdownFlyout: WinJS.UI.Flyout;
        profilesFlyout: WinJS.UI.Flyout;

        processed(element, options) {
            KodiPassion.mapKodiApi(element);
            this.loadLanguages();
            this.loadSubtitles();
            this.rangeVolume.onchange = () => {
                var volumeval = parseInt(this.rangeVolume.value);
                Kodi.API.Input.volume(volumeval);
            }

            this.eventTracker.addBinding(Kodi.NowPlaying.current, "expanded", () => {
                if (Kodi.NowPlaying.current.expanded) {
                    this.loadProfiles();
                }
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

            return WinJS.Binding.processAll(element, Kodi.NowPlaying.current);
        }

        loadProfiles() {
            WinJS.Promise.join({
                current: Kodi.API.Profiles.getCurrentProfile(),
                list: Kodi.API.Profiles.getProfiles()
            }).then((profiles) => {
                this.profilesItems.innerHTML = "";
                if (profiles && profiles.list) {
                    if (profiles.list.profiles.length == 1) {
                        this.btnProfiles.style.display = "none";
                        return;
                    } else {
                        this.btnProfiles.style.display = "";
                        profiles.list.profiles.forEach((p) => {
                            var b = document.createElement("BUTTON");
                            b.innerText = p.label;
                            if (profiles.current && p.label == profiles.current.label) {
                                b.classList.add("selected");
                            }

                            this.profilesItems.appendChild(b);
                            WinJSContrib.UI.tap(b, () => {
                                this.profilesFlyout.hide();
                                return Kodi.API.Profiles.loadProfile(p.label).then(() => {
                                    $('.selected', this.profilesItems).removeClass("selected");
                                    b.classList.add("selected");
                                });
                            });
                        });
                    }
                }
                }, (err) => {
                    this.btnProfiles.style.display = "none";
            });
        }

        showProfiles(arg) {
            this.profilesFlyout.show(<HTMLElement>arg.elt, "bottom", "right");
        }

        showPowerOptions(arg) {
            this.shutdownFlyout.show(<HTMLElement>arg.elt, "bottom", "right");
        }

        shutdown() {
            this.shutdownFlyout.hide();
            WinJSContrib.Alerts.messageBox({ content: "This will turn off your media server. After a few seconds, this application Kodi Passion will not be able to reach your media server any more. \r\n\r\nDo you want to proceed ?", title: 'Shutdown media server ?', commands: [{ label: 'Yes' }, { label: 'No', isDefault: true }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.System.shutdown().done(function () {
                        WinJS.Navigation.navigate("/pages/startup/startup.html");
                    });
            });
        }

        restart() {
            this.shutdownFlyout.hide();
            WinJSContrib.Alerts.messageBox({ content: "This will restart your media server.\r\n\r\nDo you want to proceed ?", title: 'Shutdown media server ?', commands: [{ label: 'Yes' }, { label: 'No', isDefault: true }] }).done(function (c) {
                if (c.label == 'Yes')
                    Kodi.API.System.reboot().done(function () {
                        WinJS.Navigation.navigate("/pages/startup/startup.html");
                    });
            });
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
                            RemoteControllerControl.logger.info('subtitles changed to ' + props.currentaudiostream.name);
                            this.language.value = props.currentaudiostream.index;
                            //$('.languagelabel', page.element).html(toStaticHTML(props.currentaudiostream.name));
                        });
                    });
                }
            }
        }

        loadSubtitles() {
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
                                Kodi.NowPlaying.check().done((props: any) => {
                                    RemoteControllerControl.logger.info('subtitles changed to ' + props.currentsubtitle.name);
                                    this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                });
                            });
                        } else {
                            Kodi.NowPlaying.check().done((props: any) => {
                                if (!props.subtitleenabled) {
                                    RemoteControllerControl.logger.info('subtitles changed to off');
                                    this.subtitle.value = 'off';
                                } else {
                                    RemoteControllerControl.logger.info('subtitles changed to ' + props.currentsubtitle.name);
                                    this.subtitle.value = Kodi.NowPlaying.current.currentsubtitle.index;
                                }
                            });
                        }
                    });
                }
            }
        }
    }

    export var RemoteController = WinJS.UI.Pages.define(RemoteControllerControl.url, RemoteControllerControl);
}
