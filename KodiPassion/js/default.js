// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    WinJSContrib.UI.enableSystemBackButton = true;
    WinJSContrib.UI.defaultTapBehavior.awaitAnim = true;
    WinJSContrib.UI.defaultTapBehavior.animDown = function (elt) {
        if (elt.clientWidth > 200 || elt.clientHeight > 200)
            return $.Velocity(elt, { scaleX: 0.95, scaleY: 1.1 }, { duration: 90 });
        else if (elt.clientWidth > 70 || elt.clientHeight > 70)
            return $.Velocity(elt, { scaleX: 0.9, scaleY: 1.1 }, { duration: 90 });
        else
            return $.Velocity(elt, { scaleX: 0.8, scaleY: 1.2 }, { duration: 90 });
    }

    WinJSContrib.UI.defaultTapBehavior.animUp = function (elt) {
        $.Velocity(elt, { scaleX: 1, scaleY: 1 }, { duration: 800, easing: [600,25] });
        return WinJS.Promise.timeout(50);
    }

    WinJSContrib.UI.Pages.defaultFragmentMixins.push({
        navdeactivate: function () {
            this.foWrapper.element.style.opacity = '0.2';
            this.foWrapper.blurTo(20, 300);
            return WinJS.Promise.timeout(100);
        },

        navactivate: function () {
            this.foWrapper.element.style.opacity = '';
            this.foWrapper.blurTo(0, 160);
            return WinJS.Promise.timeout(3000);
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
                return Kodi.Data.checkConnectivity().then(function (p) {
                    return KodiPassion.UI.DataLoader.showLoader(false, args);
                }, function (err) {
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                });
                //return Kodi.Data.loadRootData(true).then(function (data) {
                //    return WinJS.Navigation.navigate("/pages/home/home.html");
                //},
                //function (err) {
                //    console.error(err);
                //    return WinJS.Navigation.navigate("/pages/settings/settings.html");
                //});
            }
        }

        return WinJS.Navigation.navigate("/pages/bootstrap/bootstrap.html");
    }

    app.onactivated = function (args) {
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
})();
