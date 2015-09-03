declare module WinJSContrib.UI {
    var FOWrapper: any;
    var enableSystemBackButton: boolean;
}
declare var dynamics: any;

module KodiPassion.Templates {
    export var album = new WinJS.Binding.Template(null, { href: "/templates/album.html", extractChild: true });
    export var song = new WinJS.Binding.Template(null, { href: "/templates/song.html", extractChild: true });
    export var movieposter = new WinJS.Binding.Template(null, { href: "/templates/movieposter.html", extractChild: true });
}

module KodiPassion {
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    WinJSContrib.UI.enableSystemBackButton = true;
    WinJSContrib.UI.defaultTapBehavior.awaitAnim = true;
    WinJSContrib.UI.defaultTapBehavior.animDown = function (elt) {
        var w = elt.clientWidth;
        var h = elt.clientHeight;

        var target = { scaleX: (w - 10) / w, scaleY: (h + 10)/h };

        //if (elt.clientWidth < 70 && elt.clientHeight < 70)
        //    target = { scaleX: 0.8, scaleY: 1.2 };
        //else if (elt.clientWidth < 100 && elt.clientHeight < 100)
        //    target = { scaleX: 0.9, scaleY: 1.1 };

        //    return $.Velocity(elt, target, { duration: 90 });

        return new WinJS.Promise(function (complete, error) {
            dynamics.animate(elt, target, {
                type: dynamics.spring,
                duration: 160,
                frequency: 1,
                friction: 166,
                complete: complete
            });
        });

        //return WinJS.UI.executeTransition(elt, {
        //    property: "transform",
        //    delay: 0,
        //    duration: 167,
        //    timing: "cubic-bezier(0.1, 0.9, 0.2, 1)",
        //    to: "scale(0.7, 1.2)"
        //});
    }

    WinJSContrib.UI.defaultTapBehavior.animUp = function (elt) {
        var p = new WinJS.Promise(function (complete, error) {
            dynamics.animate(elt, {
                scaleX: 1,
                scaleY: 1
            }, {
                type: dynamics.spring,
                frequency: 300,
                duration: 700,
                friction : 105,
                anticipationSize: 216,
                anticipationStrength: 572,
                complete: complete
            })
        });
        return WinJS.Promise.timeout(50);

        //return WinJS.UI.executeTransition(elt, {
        //    property: "transform",
        //    delay: 0,
        //    duration: 300,
        //    timing: WinJSContrib.UI.Animation.Easings.easeOutBack, //"cubic-bezier(.39,.66,.5,1)", 
        //    to: "scale(1, 1)"
        //});

        //$.Velocity(elt, { scaleX: 1, scaleY: 1 }, { duration: 800, easing: [600, 25] });
        //return WinJS.Promise.timeout(50);
    }

    WinJSContrib.UI.Pages.defaultFragmentMixins.push({
        navdeactivate: function () {
            if (this.foWrapper) {
                this.foWrapper.element.style.opacity = '0.2';
                this.foWrapper.blurTo(20, 160);
                return WinJS.Promise.timeout(50);
            } else {
                console.error("fowrapper not present");
            }
            if (this.pageNavDeactivate) {
                this.pageNavDeactivate();
            }
        },

        navactivate: function () {
            if (this.foWrapper) {
                this.foWrapper.element.style.opacity = '';
                this.foWrapper.blurTo(0, 160);
                //return WinJS.Promise.timeout(3000);
            } else {
                console.error("fowrapper not present");
            }
            if (this.pageNavActivate) {
                this.pageNavActivate();
            }
        }
    });

    function appInit(args) {
        var pageshost = document.getElementById("pageshost");

        pageshost.winControl.fragmentInjector = function (pagecontrol) {
            var parent = pagecontrol.element.parentElement;
            var wrapper = new WinJSContrib.UI.FOWrapper();
            var _unload = pagecontrol.unload;
            var _updateLayout = pagecontrol.updateLayout;
            var proxy = document.createElement("DIV");
            proxy.className = "pagecontrolproxy pagecontrol";
            proxy.winControl = pagecontrol;
            proxy.winControl.unload = function () {
                $(proxy).remove();
                if (_unload) {
                    _unload.apply(this);
                }
            }
            proxy.winControl.updateLayout = function () {
                wrapper.updateLayout();
                if (_updateLayout) {
                    _updateLayout.apply(this);
                }
            }
            proxy.appendChild(wrapper.element);
            parent.appendChild(proxy);
            wrapper.content.appendChild(pagecontrol.element);
            pagecontrol.foWrapper = wrapper;
        }

        var settingName = Kodi.Settings.defaultConnection();
        if (settingName) {
            var currentSetting = Kodi.Settings.getSetting(settingName);
            if (currentSetting && currentSetting.host) {
                return Kodi.API.testServerSetting(currentSetting).then(function (p) {
                    Kodi.API.currentSettings = currentSetting;
                    return KodiPassion.UI.DataLoader.showLoader(false, args);
                }, function (err) {
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                });
            }
        }

        return WinJS.Navigation.navigate("/pages/bootstrap/bootstrap.html");
    }

    app.onactivated = function (args : any) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                return appInit(args);
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };

    app.start();

    export function mapKodiApi(element: HTMLElement) {
        var items = element.querySelectorAll("*[kodiapi]");
        var processItem = function (item: HTMLElement) {
            var api = item.getAttribute("kodiapi");
            if (api) {
                var fn = WinJSContrib.Utils.resolveValue(item, "global:" + api);
                if (fn && typeof fn === "function") {
                    WinJSContrib.UI.tap(item, function (arg) {
                        return fn();
                    }, { /*tapOnDown : true*/ });
                }
            }
        }

        for (var i = 0, l = items.length; i < l; i++) {
            processItem(<HTMLElement>items[i]);            
        }
    }
}
