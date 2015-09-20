module BtPo.UI.Pages {

    export class FilesPage {
        public static url = "/pages/files/files.html";
        element: HTMLElement;
        itemsPromise: WinJS.Promise<Kodi.Data.IMediaLibrary>;
        data: Kodi.Data.IMediaLibrary;
        filesList: WinJS.UI.ListView<any>;
        fileitemtemplate: WinJS.Binding.Template;
        folderitemtemplate: WinJS.Binding.Template;
        mediacontainer: HTMLElement;
        pagetitle: HTMLElement;
        currentItemActions: HTMLElement;
        btnup: HTMLButtonElement;
        currentMedia: string;
        currentRoot: any;
        stack: any[];

        init(element, options) {
            this.stack = [];
            
            this.itemsPromise = Kodi.Data.loadRootData().then((data) => {
                this.data = data;
                return data;
            });

            if (options.media) {
                this.itemsPromise = this.itemsPromise.then((data) => {
                    this.openmedia(options.media);
                    return data;
                });
            }
        }

        processed(element, options) {
            this.checkCurrentItemActions();
            this.filesList.itemTemplate = this.templateSelector.bind(this);
        }

        picmedia(arg) {
            var elt = arg.elt as HTMLElement;
            var media = elt.getAttribute("mediatype");
            this.openmedia(media);
        }

        openmedia(media: string) {
            if (media == "videos") {
                this.currentMedia = media;
                this.pagetitle.innerText = media;
                this.currentRoot = null;
                this.stack.push({ items: new WinJS.Binding.List(this.data.videoSources.sources), label: media, isMediaSources : true });
                this.filesList.itemDataSource = new WinJS.Binding.List(this.data.videoSources.sources).dataSource;
                this.hideMediaPicker();
            } else if (media == "music") {
                this.currentMedia = media;
                this.pagetitle.innerText = media;
                this.currentRoot = null;
                this.stack.push({ items: new WinJS.Binding.List(this.data.musicSources.sources), label: media, isMediaSources: true });
                this.filesList.itemDataSource = new WinJS.Binding.List(this.data.musicSources.sources).dataSource;
                this.hideMediaPicker();
            } else if (media == "pictures") {
                this.currentMedia = media;
                this.pagetitle.innerText = media;
                this.currentRoot = null;
                this.stack.push({ items: new WinJS.Binding.List(this.data.picturesSources.sources), label: media, isMediaSources: true });
                this.filesList.itemDataSource = new WinJS.Binding.List(this.data.picturesSources.sources).dataSource;
                this.hideMediaPicker();
            }
        }

        hideMediaPicker() {
            
            WinJS.UI.Animation.exitContent(this.mediacontainer).then(() => {
                this.mediacontainer.style.display = "none";
                setImmediate(() => {
                    this.btnup.disabled = false;
                });
            });
        }

        listItemInvoked(arg) {
            var page = this;
            arg.detail.itemPromise.done(function (item) {
                if (!item.data.filetype || item.data.filetype == 'directory') {
                    page.openItemsFor(item.data);
                } else {
                    //return Kodi.API.Player.open(item.data.file, false);
                }
            });
        }

        openItemsFor(item) {
            if (!item.filetype || item.filetype == 'directory') {
                this.filesList.itemDataSource = null;
                var target = item.file;
                //if (item.file[item.file.length - 1] != '\\') {
                //    var idx = item.file.lastIndexOf('\\');
                //    target = item.file.substr(0, idx);
                //}
                console.log('opening ' + target);
                this.pagetitle.innerText = item.label;
                Kodi.API.Files.getDirectory('files', target).done((items) => {
                    var fileitem = { id: item.id, label: item.label, file: target, items: items ? new WinJS.Binding.List(items.files) : new WinJS.Binding.List() };
                    this.stack.push(fileitem);
                    this.currentRoot = fileitem;
                    this.checkCurrentItemActions();
                    this.filesList.itemDataSource = this.currentRoot.items.dataSource;
                });
            }
            this.checkCurrentItemActions();
        }

        navback() {
            if (this.stack.length > 1) {
                this.stack.splice(this.stack.length - 1, 1);
                this.currentRoot = this.stack[this.stack.length - 1];
                this.filesList.itemDataSource = this.currentRoot.items.dataSource;
                this.pagetitle.innerText = this.currentRoot.label;
            } else {
                this.currentRoot = null;
                this.mediacontainer.style.display = "";
                this.pagetitle.innerText = "files";
                this.filesList.itemDataSource = null;
                setImmediate(() => {
                    this.btnup.disabled = true;
                });
                WinJS.UI.Animation.enterContent(this.mediacontainer);
            }
            
            this.checkCurrentItemActions();
        }

        checkCurrentItemActions() {
            if (this.currentRoot && !this.currentRoot.isMediaSources) {
                this.currentItemActions.style.visibility = "visible";
            } else {
                this.currentItemActions.style.visibility = "hidden";
            }
        }

        templateSelector(arg) {
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
                        var element = <any>rendered.children[0];
                        var btnplay = element.querySelector(".btpo-play");
                        var btnadd = element.querySelector(".btpo-add");
                        $(element).click(function () {
                            $(".file-item.file.showActions", page.element).removeClass("showActions");
                            element.classList.add("showActions");
                            clearTimeout(element.actionsTimeout);
                            element.actionsTimeout = setTimeout(() => {
                                element.classList.remove("showActions");
                            }, 5000);
                        });

                        WinJSContrib.UI.tap(btnplay, () => {
                            return Kodi.API.Player.open(item.data.file, false);
                        });

                        WinJSContrib.UI.tap(btnadd, () => {
                            return Kodi.API.Player.add(item.data.file, false);
                        });

                        return rendered;
                    });
                }
            });
        }

        playCurrent() {
            if (this.currentRoot && !this.currentRoot.isMediaSources) {
                return Kodi.API.Player.open(this.currentRoot.file, true);
            }
        }

        addCurrent() {
            if (this.currentRoot && !this.currentRoot.isMediaSources) {
                return Kodi.API.Player.add(this.currentRoot.file, true);
            }
        }
    }

    WinJS.UI.Pages.define(FilesPage.url, FilesPage);
}
