var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var GenrePickerControl = (function () {
            function GenrePickerControl(element, options) {
                var _this = this;
                this.element = element || document.createElement('DIV');
                options = options || {};
                this.element.winControl = this;
                this.element.classList.add("genrepickerctrl");
                this.element.classList.add('win-disposable');
                this.render();
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                var nav = WinJS.Navigation;
                this.eventTracker.addEvent(nav, "beforenavigate", function (arg) {
                    _this.__pickComplete();
                });
                WinJS.UI.setOptions(this, options);
            }
            GenrePickerControl.prototype.render = function () {
                var _this = this;
                if (!this.element)
                    return;
                this.element.innerHTML = '<div class="btnclose"><i class="btpo-close"></i></div><div class="genre-items"></div>';
                this.itemsContainer = this.element.querySelector(".genre-items");
                this.btnclose = this.element.querySelector(".btnclose");
                WinJSContrib.UI.tap(this.btnclose, function () {
                    _this.__pickComplete();
                });
            };
            GenrePickerControl.prototype.pickGenre = function (genres, selected) {
                var _this = this;
                var p = new WinJS.Promise(function (complete, error) {
                    _this.__pickComplete = complete;
                    _this.__pickError = error;
                });
                this.genres = genres;
                this.selected = selected;
                this.renderGenres();
                return p;
            };
            GenrePickerControl.prototype.renderGenres = function () {
                var _this = this;
                if (!this.itemsContainer)
                    return;
                this.itemsContainer.innerHTML = "";
                if (this.genres) {
                    var container = document.createDocumentFragment();
                    var items = [];
                    var e = document.createElement("DIV");
                    e.className = "genre genre-all";
                    e.style.opacity = "0";
                    e.innerText = "all";
                    WinJSContrib.UI.tap(e, function () {
                        _this.__pickComplete("all");
                    });
                    items.push(e);
                    container.appendChild(e);
                    this.genres.forEach(function (genre) {
                        var e = document.createElement("DIV");
                        e.className = "genre";
                        e.style.opacity = "0";
                        e.innerText = genre.label;
                        WinJSContrib.UI.tap(e, function () {
                            _this.__pickComplete(genre);
                        });
                        items.push(e);
                        container.appendChild(e);
                    });
                    this.itemsContainer.appendChild(container);
                    WinJS.UI.Animation.enterPage(items);
                }
            };
            GenrePickerControl.prototype.dispose = function () {
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
                if (this.eventTracker) {
                    this.eventTracker.dispose();
                }
            };
            GenrePickerControl.prototype.hide = function () {
                var _this = this;
                return WinJSContrib.UI.Animation.fadeOut(this.element, { duration: 100 }).then(function () {
                    $(_this.element).remove();
                    _this.dispose();
                });
            };
            return GenrePickerControl;
        })();
        UI.GenrePickerControl = GenrePickerControl;
        UI.GenrePicker = WinJS.Class.mix(GenrePickerControl, WinJS.Utilities.eventMixin, WinJS.Utilities.createEventProperties("myevent"));
        UI.GenrePicker.pick = function (genres, selectedgenre) {
            var ctrl = new BtPo.UI.GenrePicker();
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
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));
//# sourceMappingURL=genrepicker.js.map