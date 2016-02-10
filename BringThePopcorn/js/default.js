//app insight 
//https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
//https://azure.microsoft.com/fr-fr/documentation/articles/app-insights-javascript/
var BtPo;
(function (BtPo) {
    BtPo.debug = true;
})(BtPo || (BtPo = {}));
WinJSContrib.DataContainer.WinRTFilesContainer.makeCurrent();
if (BtPo.debug) {
    WinJSContrib.UI.Pages.verboseTraces = true;
    WinJSContrib.Logs.configure("WinJSContrib.UI.Pages", { level: WinJSContrib.Logs.Levels.debug, appenders: ["DefaultConsole"] });
    WinJSContrib.Logs.configure("KDP.API", { level: WinJSContrib.Logs.Levels.info, appenders: ["DefaultConsole"] });
    WinJSContrib.Logs.configure("KDP.API.Websocket", { level: WinJSContrib.Logs.Levels.debug, appenders: ["DefaultConsole"] });
}
var BtPo;
(function (BtPo) {
    var Templates;
    (function (Templates) {
        Templates.search = new WinJS.Binding.Template(null, { href: "/templates/searchitem.html", extractChild: true });
        Templates.album = new WinJS.Binding.Template(null, { href: "/templates/album.html", extractChild: true });
        Templates.song = new WinJS.Binding.Template(null, { href: "/templates/song.html", extractChild: true });
        Templates.movieposter = new WinJS.Binding.Template(null, { href: "/templates/movieposter.html", extractChild: true });
        Templates.tvshowposter = new WinJS.Binding.Template(null, { href: "/templates/tvshowposter.html", extractChild: true });
    })(Templates = BtPo.Templates || (BtPo.Templates = {}));
})(BtPo || (BtPo = {}));
var BtPo;
(function (BtPo) {
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJSContrib.UI.enableSystemBackButton = false;
    WinJSContrib.UI.enableSystemBackButtonVisibility = true;
    WinJSContrib.UI.defaultTapBehavior.awaitAnim = true;
    WinJSContrib.UI.defaultTapBehavior.animDown = function (elt) {
        var w = elt.clientWidth;
        var h = elt.clientHeight;
        var target = { scaleX: (w - 10) / w, scaleY: (h + 10) / h };
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
    };
    WinJSContrib.UI.defaultTapBehavior.animUp = function (elt) {
        var p = new WinJS.Promise(function (complete, error) {
            dynamics.animate(elt, {
                scaleX: 1,
                scaleY: 1
            }, {
                type: dynamics.spring,
                frequency: 300,
                duration: 700,
                friction: 105,
                anticipationSize: 216,
                anticipationStrength: 572,
                complete: complete
            });
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
    };
    WinJSContrib.UI.Pages.defaultFragmentMixins.push({
        navdeactivate: function () {
            if (this.foWrapper) {
                this.foWrapper.element.style.opacity = '0.2';
                this.foWrapper.blurTo(20, 160);
                return WinJS.Promise.timeout(50);
            }
            else {
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
            }
            else {
                console.error("fowrapper not present");
            }
            if (this.pageNavActivate) {
                this.pageNavActivate();
            }
        }
    });
    function appInit(args) {
        WinJSContrib.Logs.getLogger("WinJSContrib.DataContainer.WinRT", { level: WinJSContrib.Logs.Levels.verbose, appenders: ["DefaultConsole"] });
        var pageshost = document.getElementById("pageshost");
        var qualifiers = Windows.ApplicationModel.Resources.Core.ResourceContext.getForCurrentView();
        if (qualifiers.qualifierValues.DeviceFamily !== "Desktop") {
            WinJSContrib.UI.FOWrapper.disabled = true;
        }
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
            };
            proxy.winControl.updateLayout = function () {
                wrapper.updateLayout();
                if (_updateLayout) {
                    _updateLayout.apply(this);
                }
            };
            proxy.appendChild(wrapper.element);
            parent.appendChild(proxy);
            wrapper.content.appendChild(pagecontrol.element);
            pagecontrol.foWrapper = wrapper;
        };
        var settingName = Kodi.Settings.defaultConnection();
        if (settingName) {
            var currentSetting = Kodi.Settings.getSetting(settingName);
            if (currentSetting && currentSetting.host) {
                return Kodi.API.testServerSetting(currentSetting).then(function (p) {
                    Kodi.API.currentSettings = currentSetting;
                    return BtPo.UI.DataLoader.showLoader(false, args);
                }, function (err) {
                    return WinJS.Navigation.navigate("/pages/startup/startup.html");
                });
            }
        }
        return WinJS.Navigation.navigate("/pages/bootstrap/bootstrap.html");
    }
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            }
            else {
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
    function mapKodiApi(element) {
        var items = element.querySelectorAll("*[kodiapi]");
        var processItem = function (item) {
            var api = item.getAttribute("kodiapi");
            if (api) {
                var fn = WinJSContrib.Utils.resolveValue(item, "global:" + api);
                if (fn && typeof fn === "function") {
                    WinJSContrib.UI.tap(item, function (arg) {
                        return fn();
                    }, {});
                }
            }
        };
        for (var i = 0, l = items.length; i < l; i++) {
            processItem(items[i]);
        }
    }
    BtPo.mapKodiApi = mapKodiApi;
})(BtPo || (BtPo = {}));
var BtPo;
(function (BtPo) {
    var ListHelpers;
    (function (ListHelpers) {
        function renderMenu(args) {
            var setView = function (viewname) {
                viewname = viewname || args.defaultView;
                for (var v in args.views) {
                    args.root.classList.remove("view-" + v);
                }
                var view = args.views[viewname] || args.views[args.defaultView];
                args.root.classList.add("view-" + viewname);
                $('.item[view].selected', args.viewsContainer).removeClass("selected");
                $('.item[view="' + viewname + '"]', args.viewsContainer).addClass("selected");
                args.dsManager.listview.itemTemplate = view.template.element;
                args.setting.view = viewname;
                args.saveSetting();
            };
            var setGroup = function (groupname) {
                groupname = groupname || args.defaultGroup;
                for (var v in args.groups) {
                    args.root.classList.remove("group-" + v);
                }
                var view = args.groups[groupname] || args.groups["none"];
                if (view.groupKind) {
                    args.dsManager.dataManager.field = view.groupField;
                    args.dsManager.dataManager.groupKind = view.groupKind;
                }
                else {
                    args.dsManager.dataManager.groupKind = null;
                    args.dsManager.dataManager.field = null;
                }
                $('.item[grouping].selected', args.groupsContainer).removeClass("selected");
                $('.item[grouping="' + groupname + '"]', args.groupsContainer).addClass("selected");
                args.root.classList.add("group-" + groupname);
                args.setting.group = groupname;
                args.saveSetting();
            };
            var renderMenuGroupItem = function (name, group) {
                var e = document.createElement("DIV");
                e.className = "item group";
                e.innerHTML = group.name;
                e.setAttribute("grouping", name);
                args.groupsContainer.appendChild(e);
                WinJSContrib.UI.tap(e, function () {
                    setGroup(name);
                    args.dsManager.dataManager.refresh();
                });
            };
            var renderMenuViewItem = function (name, group) {
                var e = document.createElement("DIV");
                e.className = "item view";
                e.innerHTML = group.name;
                e.setAttribute("view", name);
                args.viewsContainer.appendChild(e);
                WinJSContrib.UI.tap(e, function () {
                    setView(name);
                    args.dsManager.dataManager.refresh();
                });
            };
            var renderMenu = function () {
                var groups = 0;
                for (var name in args.groups) {
                    groups++;
                    var g = args.groups[name];
                    renderMenuGroupItem(name, g);
                }
                if (groups < 2) {
                    args.groupsContainer.style.display = "none";
                }
                var views = 0;
                for (var name in args.views) {
                    views++;
                    var g = args.views[name];
                    renderMenuViewItem(name, g);
                }
                if (views < 2) {
                    args.viewsContainer.style.display = "none";
                }
            };
            renderMenu();
            setView(args.setting.view);
            setGroup(args.setting.group);
            $(args.root).on("click", ".win-groupheadercontainer", function () {
                args.dsManager.semanticZoom.zoomedOut = true;
            });
        }
        ListHelpers.renderMenu = renderMenu;
    })(ListHelpers = BtPo.ListHelpers || (BtPo.ListHelpers = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=default.js.map