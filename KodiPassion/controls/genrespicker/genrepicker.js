var KodiPassion;
(function (KodiPassion) {
    var UI;
    (function (UI) {
        var GenrePickerControl = (function () {
            function GenrePickerControl(element, options) {
                var ctrl = this;
                this.element = element || document.createElement('DIV');
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add("genrepickerctrl");
                this.element.classList.add('win-disposable');
                this.render();
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                var nav = WinJS.Navigation;
                this.eventTracker.addEvent(nav, "beforenavigate", function (arg) {
                    ctrl.__pickComplete();
                });
                WinJS.UI.setOptions(this, options);
            }
            GenrePickerControl.prototype.render = function () {
                var ctrl = this;
                ctrl.element.innerHTML = '<div class="btnclose"><i class="kdp-close"></i></div><div class="genre-items"></div>';
                ctrl.itemsContainer = ctrl.element.querySelector(".genre-items");
                ctrl.btnclose = ctrl.element.querySelector(".btnclose");
                WinJSContrib.UI.tap(ctrl.btnclose, function () {
                    ctrl.__pickComplete();
                });
            };
            GenrePickerControl.prototype.pickGenre = function (genres, selected) {
                var ctrl = this;
                var p = new WinJS.Promise(function (complete, error) {
                    ctrl.__pickComplete = complete;
                    ctrl.__pickError = error;
                });
                this.genres = genres;
                this.selected = selected;
                ctrl.renderGenres();
                return p;
            };
            GenrePickerControl.prototype.renderGenres = function () {
                var ctrl = this;
                ctrl.itemsContainer.innerHTML = "";
                if (ctrl.genres) {
                    var container = document.createDocumentFragment();
                    var items = [];
                    var e = document.createElement("DIV");
                    e.className = "genre genre-all";
                    e.style.opacity = "0";
                    e.innerText = "all";
                    WinJSContrib.UI.tap(e, function () {
                        ctrl.__pickComplete("all");
                    });
                    items.push(e);
                    container.appendChild(e);
                    ctrl.genres.forEach(function (genre) {
                        var e = document.createElement("DIV");
                        e.className = "genre";
                        e.style.opacity = "0";
                        e.innerText = genre.label;
                        WinJSContrib.UI.tap(e, function () {
                            ctrl.__pickComplete(genre);
                        });
                        items.push(e);
                        container.appendChild(e);
                    });
                    ctrl.itemsContainer.appendChild(container);
                    WinJS.UI.Animation.enterPage(items);
                }
            };
            GenrePickerControl.prototype.dispose = function () {
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
                this.eventTracker.dispose();
            };
            GenrePickerControl.prototype.hide = function () {
                var ctrl = this;
                return WinJSContrib.UI.Animation.fadeOut(ctrl.element, { duration: 100 }).then(function () {
                    $(ctrl.element).remove();
                    ctrl.dispose();
                });
            };
            return GenrePickerControl;
        })();
        UI.GenrePickerControl = GenrePickerControl;
        UI.GenrePicker = WinJS.Class.mix(GenrePickerControl, WinJS.Utilities.eventMixin, WinJS.Utilities.createEventProperties("myevent"));
        UI.GenrePicker.pick = function (genres, selectedgenre) {
            var ctrl = new KodiPassion.UI.GenrePicker();
            var container = document.getElementById("pageshostwrapper");
            ctrl.element.style.opacity = '0';
            container.appendChild(ctrl.element);
            WinJSContrib.UI.Animation.fadeIn(ctrl.element, { duration: 200 });
            WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(20, 90);
            return ctrl.pickGenre(genres, selectedgenre).then(function (data) {
                WinJSContrib.UI.Application.navigator.pageControl.foWrapper.blurTo(0, 90);
                return ctrl.hide().then(function () {
                    return WinJS.Promise.timeout(50);
                }).then(function () {
                    return data;
                });
            });
        };
    })(UI = KodiPassion.UI || (KodiPassion.UI = {}));
})(KodiPassion || (KodiPassion = {}));
//# sourceMappingURL=genrepicker.js.map