var Kodi;
(function (Kodi) {
    var Utils;
    (function (Utils) {
        function bgImage(source, sourceProperty, dest, destProperty, defaultImage) {
            function setImage(url, img) {
                dest.style.visibility = '';
                WinJS.Utilities.addClass(dest, 'imageLoaded');
                if (dest.nodeName === "IMG") {
                    dest.src = url;
                    dest.style.width = "";
                    if (img && img.element) {
                        var ratio = img.element.naturalWidth / img.element.naturalHeight;
                        var w = dest.clientHeight * ratio;
                        dest.style.width = w + "px";
                    }
                }
                else {
                    dest.style.backgroundImage = 'url("' + url + '")';
                }
            }
            function setBg() {
                dest.style.visibility = 'hidden';
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                WinJS.Utilities.removeClass(dest, 'imageLoaded');
                if (!data || !data.length) {
                    if (defaultImage) {
                        setImage(defaultImage);
                        dest.style.backgroundSize = 'contain';
                    }
                    return;
                }
                if (data === 'DefaultAlbumCover.png') {
                    //setImage("/images/cd.png");
                    return;
                }
                var imgUrl = Kodi.API.kodiThumbnail(data);
                setTimeout(function () {
                    WinJSContrib.UI.loadImage(imgUrl).done(function (img) {
                        setImage(imgUrl, img);
                    }, function () {
                        if (defaultImage) {
                            setImage(defaultImage);
                        }
                    });
                }, 250);
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
            var hours = 0;
            var minutes = ((totalseconds / 60) >> 0);
            if (minutes > 60) {
                var hours = (minutes / 60) >> 0;
                minutes = minutes - (60 * hours);
            }
            var seconds = totalseconds - (minutes * 60);
            var d = (hours ? hours + "h" : "") + WinJSContrib.Utils.pad2(minutes) + 'min' + (!hours && seconds ? WinJSContrib.Utils.pad2(seconds) : "");
            WinJS.Binding.oneTime({ duration: d }, ['duration'], dest, [destProperty]);
        });
        Utils.rating = WinJS.Binding.initializer(function ratingBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data)
                return;
            dest.innerHTML = data.toFixed(1);
        });
        Utils.stringlist = WinJS.Binding.initializer(function stringlistBinding(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!data && !data.length)
                return;
            dest.innerText = data.join(', ');
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