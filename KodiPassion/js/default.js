// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	WinJSContrib.UI.enableSystemBackButton = true;

	function appInit() {
	    var settingName = Kodi.Settings.defaultConnection();
	    var pageshost = document.getElementById("pageshost");
	    pageshost.winControl.fragmentInjector = function (element) {
	        var wrapper = new WinJSContrib.UI.FOWrapper();
	        wrapper.content.appendChild(element);
	        setImmediate(function () { 
	            element.winControl.foWrapper = wrapper;
	        });
	        return wrapper.element;
	    }
	    if (settingName) {
	        var currentSetting = Kodi.Settings.getSetting(settingName);
	        if (currentSetting && currentSetting.host) {
	            return Kodi.Data.loadRootData(true).then(function (data) {
	                return WinJS.Navigation.navigate("/pages/home/home.html");
	            },
                function (err) {
                    console.error(err);
                    return WinJS.Navigation.navigate("/pages/settings/settings.html");
	            });
	        }
	    }
	    
	    return WinJS.Navigation.navigate("/pages/settings/settings.html");
	}

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				// TODO: This application has been newly launched. Initialize your application here.
			} else {
				// TODO: This application was suspended and then terminated.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
			}
			args.setPromise(WinJS.UI.processAll().then(function(){
			    return appInit();
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
