var Kodi;
(function (Kodi) {
    var Utils;
    (function (Utils) {
        function bgImage(source, sourceProperty, dest, destProperty, defaultImage) {
            function setBg() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data || !data.length) {
                    WinJS.Utilities.addClass(dest, 'imageLoaded');
                    dest.innerHTML = '';
                    if (defaultImage) {
                        dest.style.backgroundImage = 'url("' + defaultImage + '")';
                        dest.style.backgroundSize = 'contain';
                    }
                    return;
                }
                if (data === 'DefaultAlbumCover.png') {
                    WinJS.Utilities.addClass(dest, 'imageLoaded');
                    dest.innerHTML = '';
                    dest.style.backgroundImage = 'url("/images/cd.png")';
                    return;
                }
                var imgUrl = Kodi.API.kodiThumbnail(data);
                setTimeout(function () {
                    WinJSContrib.UI.loadImage(imgUrl).done(function () {
                        WinJS.Utilities.addClass(dest, 'imageLoaded');
                        dest.innerHTML = '';
                        dest.style.backgroundImage = 'url("' + imgUrl + '")';
                    }, function () {
                        WinJS.Utilities.addClass(dest, 'imageLoaded');
                        dest.innerHTML = '';
                        if (defaultImage) {
                            dest.style.backgroundImage = 'url("' + defaultImage + '")';
                        }
                    });
                }, 150);
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setBg;
            return WinJS.Binding.bind(source, bindingDesc);
        }
        function imageUrl(source, sourceProperty, dest, destProperty, defaultImage) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var imgUrl = defaultImage;
            if (!data || !data.length) {
                if (!imgUrl)
                    return;
            }
            else {
                imgUrl = Kodi.API.kodiThumbnail(data);
            }
            return WinJS.Binding.oneTime({ url: imgUrl }, ['url'], dest, [destProperty]);
        }
        function formatPlayerTime(props, data) {
            var res = [];
            if (data.hours || props.type === 'video')
                res.push(WinJSContrib.Utils.pad2(data.hours | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.minutes | 0) + ':');
            res.push(WinJSContrib.Utils.pad2(data.seconds | 0));
            return res.join('');
        }
        Utils.formatPlayerTime = formatPlayerTime;
        Utils.toThumbnailBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorBg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return bgImage(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toThumbnailImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, undefined);
        });
        Utils.toThumbnailAlbumImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/cd.png');
        });
        Utils.toThumbnailActorImg = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            return imageUrl(source, sourceProperty, dest, destProperty, '/images/artist.png');
        });
        Utils.toFormatedPlayerTime = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            WinJS.Binding.oneTime({ time: Kodi.Utils.formatPlayerTime(source, data) }, ['time'], dest, [destProperty]);
        });
        Utils.toDuration = WinJS.Binding.initializer(function toDurationBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            var totalseconds = parseInt(data);
            var minutes = ((totalseconds / 60) >> 0);
            var seconds = totalseconds - (minutes * 60);
            WinJS.Binding.oneTime({ duration: minutes + 'min' + WinJSContrib.Utils.pad2(seconds) }, ['duration'], dest, [destProperty]);
        });
        Utils.showIfNetworkPath = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data || data.indexOf('\\\\') != 0) {
                dest.style.display = 'none';
            }
            else {
                dest.style.display = '';
            }
        });
        Utils.isCurrent = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            function setClass() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (data) {
                    WinJS.Utilities.addClass(dest, 'iscurrent');
                }
                else {
                    WinJS.Utilities.removeClass(dest, 'iscurrent');
                }
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        function getNetworkPath(mediapath) {
            if (!mediapath)
                return null;
            if (mediapath.indexOf('\\\\') == 0) {
                return mediapath;
            }
            else if (mediapath.indexOf('smb://') == 0) {
                var path = mediapath.substr(4, mediapath.length - 4);
                var pattern = "/", re = new RegExp(pattern, "g");
                path = path.replace(re, '\\');
                return path;
            }
            return null;
        }
        Utils.getNetworkPath = getNetworkPath;
    })(Utils = Kodi.Utils || (Kodi.Utils = {}));
})(Kodi || (Kodi = {}));
//# sourceMappingURL=Kodi.Utils.js.map