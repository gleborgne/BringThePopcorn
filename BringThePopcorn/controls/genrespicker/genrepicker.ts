module BtPo.UI {
    export class GenrePickerControl {
        element: HTMLElement;
        eventTracker: WinJSContrib.UI.EventTracker;
        itemsContainer: HTMLElement;
        btnclose: HTMLElement;
        genres: Kodi.API.Genre[];
        selected: Kodi.API.Genre;
        __pickComplete: any;
        __pickError: any;

        constructor(element?: HTMLElement, options?:any) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.element.winControl = this;
            this.element.classList.add("genrepickerctrl");
            this.element.classList.add('win-disposable');
            this.render();
            this.eventTracker = new WinJSContrib.UI.EventTracker();
            var nav = <any>WinJS.Navigation;
            this.eventTracker.addEvent(nav, "beforenavigate", (arg) => {
                this.__pickComplete();
            });

            WinJS.UI.setOptions(this, options);
        }

        render() {
            if (!this.element)
                return;

            this.element.innerHTML = '<div class="btnclose"><i class="btpo-close"></i></div><div class="genre-items"></div>';
            this.itemsContainer = <HTMLElement>this.element.querySelector(".genre-items");
            this.btnclose = <HTMLElement>this.element.querySelector(".btnclose");
            WinJSContrib.UI.tap(this.btnclose, () => {
                this.__pickComplete();
            });
        }

        pickGenre(genres, selected) {
            var p = new WinJS.Promise((complete, error) => {
                this.__pickComplete = complete;
                this.__pickError = error;
            });
            this.genres = genres;
            this.selected = selected;
            this.renderGenres();
            return p;
        }

        renderGenres() {            
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
                WinJSContrib.UI.tap(e, () => {
                    this.__pickComplete("all");
                });
                items.push(e);
                container.appendChild(e);

                this.genres.forEach((genre) => {
                    var e = document.createElement("DIV");
                    e.className = "genre";
                    e.style.opacity = "0";
                    e.innerText = genre.label;
                    WinJSContrib.UI.tap(e, () => {
                        this.__pickComplete(genre);
                    });
                    items.push(e);
                    container.appendChild(e);
                });
                this.itemsContainer.appendChild(container);
                WinJS.UI.Animation.enterPage(items);
            }
        }

        dispose() {
            WinJS.Utilities.disposeSubTree(this.element);
            this.element = null;
            if (this.eventTracker) {
                this.eventTracker.dispose();
            }
        }

        hide() {
            return WinJSContrib.UI.Animation.fadeOut(this.element, { duration : 100 }).then(() => {
                $(this.element).remove();
                this.dispose();
            });
        }
    }

    export var GenrePicker = WinJS.Class.mix(GenrePickerControl, WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("myevent"));

    GenrePicker.pick = function (genres, selectedgenre) {
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
    }
}