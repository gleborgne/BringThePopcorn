var BtPo;
(function (BtPo) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            var FilesPage = (function () {
                function FilesPage() {
                }
                FilesPage.prototype.init = function (element, options) {
                    var _this = this;
                    this.stack = [];
                    this.itemsPromise = Kodi.Data.loadRootData().then(function (data) {
                        _this.data = data;
                        return data;
                    });
                    if (options.media) {
                        this.itemsPromise = this.itemsPromise.then(function (data) {
                            _this.openmedia(options.media);
                            return data;
                        });
                    }
                };
                FilesPage.prototype.processed = function (element, options) {
                    this.checkCurrentItemActions();
                    this.filesList.itemTemplate = this.templateSelector.bind(this);
                };
                FilesPage.prototype.picmedia = function (arg) {
                    var elt = arg.elt;
                    var media = elt.getAttribute("mediatype");
                    this.openmedia(media);
                };
                FilesPage.prototype.openmedia = function (media) {
                    if (media == "videos") {
                        this.currentMedia = media;
                        this.pagetitle.innerText = media;
                        this.currentRoot = null;
                        this.stack.push({ items: new WinJS.Binding.List(this.data.videoSources.sources), label: media, isMediaSources: true });
                        this.filesList.itemDataSource = new WinJS.Binding.List(this.data.videoSources.sources).dataSource;
                        this.hideMediaPicker();
                    }
                    else if (media == "music") {
                        this.currentMedia = media;
                        this.pagetitle.innerText = media;
                        this.currentRoot = null;
                        this.stack.push({ items: new WinJS.Binding.List(this.data.musicSources.sources), label: media, isMediaSources: true });
                        this.filesList.itemDataSource = new WinJS.Binding.List(this.data.musicSources.sources).dataSource;
                        this.hideMediaPicker();
                    }
                    else if (media == "pictures") {
                        this.currentMedia = media;
                        this.pagetitle.innerText = media;
                        this.currentRoot = null;
                        this.stack.push({ items: new WinJS.Binding.List(this.data.picturesSources.sources), label: media, isMediaSources: true });
                        this.filesList.itemDataSource = new WinJS.Binding.List(this.data.picturesSources.sources).dataSource;
                        this.hideMediaPicker();
                    }
                };
                FilesPage.prototype.hideMediaPicker = function () {
                    var _this = this;
                    WinJS.UI.Animation.exitContent(this.mediacontainer).then(function () {
                        _this.mediacontainer.style.display = "none";
                        setImmediate(function () {
                            _this.btnup.disabled = false;
                        });
                    });
                };
                FilesPage.prototype.listItemInvoked = function (arg) {
                    var page = this;
                    arg.detail.itemPromise.done(function (item) {
                        if (!item.data.filetype || item.data.filetype == 'directory') {
                            page.openItemsFor(item.data);
                        }
                        else {
                        }
                    });
                };
                FilesPage.prototype.openItemsFor = function (item) {
                    var _this = this;
                    if (!item.filetype || item.filetype == 'directory') {
                        this.filesList.itemDataSource = null;
                        var target = item.file;
                        //if (item.file[item.file.length - 1] != '\\') {
                        //    var idx = item.file.lastIndexOf('\\');
                        //    target = item.file.substr(0, idx);
                        //}
                        console.log('opening ' + target);
                        this.pagetitle.innerText = item.label;
                        Kodi.API.Files.getDirectory('files', target).done(function (items) {
                            var fileitem = { id: item.id, label: item.label, file: target, items: items ? new WinJS.Binding.List(items.files) : new WinJS.Binding.List() };
                            _this.stack.push(fileitem);
                            _this.currentRoot = fileitem;
                            _this.checkCurrentItemActions();
                            _this.filesList.itemDataSource = _this.currentRoot.items.dataSource;
                        });
                    }
                    this.checkCurrentItemActions();
                };
                FilesPage.prototype.navback = function () {
                    var _this = this;
                    if (this.stack.length > 1) {
                        this.stack.splice(this.stack.length - 1, 1);
                        this.currentRoot = this.stack[this.stack.length - 1];
                        this.filesList.itemDataSource = this.currentRoot.items.dataSource;
                        this.pagetitle.innerText = this.currentRoot.label;
                    }
                    else {
                        this.currentRoot = null;
                        this.mediacontainer.style.display = "";
                        this.pagetitle.innerText = "files";
                        this.filesList.itemDataSource = null;
                        setImmediate(function () {
                            _this.btnup.disabled = true;
                        });
                        WinJS.UI.Animation.enterContent(this.mediacontainer);
                    }
                    this.checkCurrentItemActions();
                };
                FilesPage.prototype.checkCurrentItemActions = function () {
                    if (this.currentRoot && !this.currentRoot.isMediaSources) {
                        this.currentItemActions.style.visibility = "visible";
                    }
                    else {
                        this.currentItemActions.style.visibility = "hidden";
                    }
                };
                FilesPage.prototype.templateSelector = function (arg) {
                    var page = this;
                    return arg.then(function (item) {
                        if (!item.data.filetype || item.data.filetype == 'directory')
                            return page.folderitemtemplate.render(item.data).then(function (rendered) {
                                $(rendered.children[0]).click(function () {
                                    page.openItemsFor(item.data);
                                });
                                return rendered;
                            });
                        else {
                            return page.fileitemtemplate.render(item.data).then(function (rendered) {
                                var element = rendered.children[0];
                                var btnplay = element.querySelector(".btpo-play");
                                var btnadd = element.querySelector(".btpo-add");
                                $(element).click(function () {
                                    $(".file-item.file.showActions", page.element).removeClass("showActions");
                                    element.classList.add("showActions");
                                    clearTimeout(element.actionsTimeout);
                                    element.actionsTimeout = setTimeout(function () {
                                        element.classList.remove("showActions");
                                    }, 5000);
                                });
                                WinJSContrib.UI.tap(btnplay, function () {
                                    return Kodi.API.Player.open(item.data.file, false);
                                });
                                WinJSContrib.UI.tap(btnadd, function () {
                                    return Kodi.API.Player.add(item.data.file, false);
                                });
                                return rendered;
                            });
                        }
                    });
                };
                FilesPage.prototype.playCurrent = function () {
                    if (this.currentRoot && !this.currentRoot.isMediaSources) {
                        return Kodi.API.Player.open(this.currentRoot.file, true);
                    }
                };
                FilesPage.prototype.addCurrent = function () {
                    if (this.currentRoot && !this.currentRoot.isMediaSources) {
                        return Kodi.API.Player.add(this.currentRoot.file, true);
                    }
                };
                FilesPage.url = "/pages/files/files.html";
                return FilesPage;
            })();
            Pages.FilesPage = FilesPage;
            WinJS.UI.Pages.define(FilesPage.url, FilesPage);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = BtPo.UI || (BtPo.UI = {}));
})(BtPo || (BtPo = {}));

//# sourceMappingURL=files.js.map
