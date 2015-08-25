/// <reference path="winjscontrib.core.js" />
(function () {
    'use strict';
    WinJS.Namespace.define("WinJSContrib.UI", {
        AspectRatio: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.element.winControl = this;
            this.element.style.display = 'none';
            this.element.classList.add('mcn-aspectratio');
            this.element.classList.add('win-disposable');
            this.element.classList.add('mcn-layout-ctrl');
            WinJS.UI.setOptions(this, options);
            this.render();
        }, {
            ratio: {
                get: function () {
                    return this._ratio;
                },
                set: function (val) {
                    this._ratio = val;
                }
            },

            basedOn: {
                get: function () {
                    return this._basedOn;
                },
                set: function (val) {
                    this._basedOn = val;
                }
            },

            target: {
                get: function () {
                    return this._target;
                },
                set: function (val) {
                    this._target = val;
                }
            },

            render: function () {
                var ctrl = this;
                if (!ctrl.styleElt) {
                    ctrl.styleElt = document.createElement('STYLE');
                    ctrl.element.parentElement.appendChild(ctrl.styleElt);
                }
                ctrl.updateLayout();
            },

            pageLayout: function () {
                this.updateLayout();
            },

            updateLayout: function (retry) {
                var ctrl = this;
                setImmediate(function () {
                    retry = retry || 0;
                    if (!ctrl.parentpage)
                        ctrl.parentpage = WinJSContrib.Utils.getScopeControl(ctrl.element);

                    if (ctrl.parentpage && ctrl.target && ctrl.ratio) {
                        var elements = ctrl.parentpage.element.querySelectorAll(ctrl.target);
                        if (elements.length) {
                            var eltW = elements[0].clientWidth;
                            var eltH = elements[0].clientHeight;
                            var classname = ctrl.target;
                            if (ctrl.prefix) {
                                classname = ctrl.prefix + ' ' + classname;
                            }
                            if (ctrl.basedOn == "height" && eltH > 0) {
                                var targetW = (eltH * ctrl.ratio) << 0;
                                ctrl.styleElt.innerHTML = classname + "{ width:" + targetW + "px}";
                            } else if (eltW > 0) {
                                var targetH = (eltW / ctrl.ratio) << 0;
                                if (ctrl.max) {
                                    var maxH = (ctrl.parentpage.element.clientHeight * ctrl.max / 100) << 0;
                                    if (targetH > maxH) {
                                        targetH = maxH;
                                    }
                                }
                                ctrl.styleElt.innerHTML = classname + "{ height:" + targetH + "px}";
                            }
                        }
                    }
                });
            },

            dispose: function () {
                var ctrl = this;
                ctrl.parentpage = null;
                ctrl.styleElt.parentElement.removeChild(ctrl.styleElt);
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
            }
        }),
		WinJS.Utilities.eventMixin,
		WinJS.Utilities.createEventProperties("myevent"))
    });
})();