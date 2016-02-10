/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib;
(function (WinJSContrib) {
    var Logs;
    (function (Logs) {
        var Appenders;
        (function (Appenders) {
            /**
             * @namespace WinJSContrib.Logs.Appenders
             */
            WinJSContrib.Logs.Appenders = WinJSContrib.Logs.Appenders;
            var ConsoleAppender = (function () {
                /**
                 * Appender writing to console
                 * @class WinJSContrib.Logs.Appenders.ConsoleAppender
                 */
                function ConsoleAppender(config) {
                    this.config = config || { level: Logs.Levels.inherit };
                }
                /**
                 * clone appender
                 * @function WinJSContrib.Logs.Appenders.ConsoleAppender.prototype.clone
                 */
                ConsoleAppender.prototype.clone = function () {
                    return new WinJSContrib.Logs.Appenders.ConsoleAppender(this.config);
                };
                /**
                 * log item
                 * @function WinJSContrib.Logs.Appenders.ConsoleAppender.prototype.log
                 * @param {string} message log message
                 * @param {WinJSContrib.Logs.Levels} log level
                 */
                ConsoleAppender.prototype.log = function (logger, message, level) {
                    var args = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        args[_i - 3] = arguments[_i];
                    }
                    if (this.config.level == Logs.Levels.inherit || level >= this.config.level) {
                        var msg = [this.format(logger, message, level)];
                        if (args.length) {
                            args.forEach(function (a) {
                                msg.push(a);
                            });
                        }
                        switch (level) {
                            case Logs.Levels.verbose:
                                return console.log.apply(console, msg);
                            case Logs.Levels.debug:
                                return console.log.apply(console, msg);
                            case Logs.Levels.info:
                                return console.info.apply(console, msg);
                            case Logs.Levels.warn:
                                return console.warn.apply(console, msg);
                            case Logs.Levels.error:
                                return console.error.apply(console, msg);
                        }
                    }
                };
                /**
                 * create log group
                 * @function WinJSContrib.Logs.Appenders.ConsoleAppender.prototype.group
                 */
                ConsoleAppender.prototype.group = function (title) {
                    console.group(title);
                };
                /**
                 * create collapsed log group
                 * @function WinJSContrib.Logs.Appenders.ConsoleAppender.prototype.groupCollapsed
                 */
                ConsoleAppender.prototype.groupCollapsed = function (title) {
                    console.groupCollapsed(title);
                };
                /**
                 * close log group
                 * @function WinJSContrib.Logs.Appenders.ConsoleAppender.prototype.groupEnd
                 */
                ConsoleAppender.prototype.groupEnd = function () {
                    console.groupEnd();
                };
                ConsoleAppender.prototype.format = function (logger, message, level) {
                    var finalMessage = "";
                    if (logger.Config && logger.Config.prefix)
                        finalMessage += logger.Config.prefix + " # ";
                    if (this.config.showLoggerNameInMessage)
                        finalMessage += logger.name + " # ";
                    if (this.config.showLevelInMessage)
                        finalMessage += Logs.logginLevelToString(level) + " # ";
                    finalMessage += message;
                    return finalMessage;
                };
                return ConsoleAppender;
            })();
            Appenders.ConsoleAppender = ConsoleAppender;
            var BufferAppender = (function () {
                /**
                 * Appender writing to console
                 * @class WinJSContrib.Logs.Appenders.BufferAppender
                 */
                function BufferAppender(config) {
                    this.config = config || { level: Logs.Levels.inherit };
                    this.buffer = [];
                }
                /**
                 * clone appender
                 * @function WinJSContrib.Logs.Appenders.BufferAppender.prototype.clone
                 */
                BufferAppender.prototype.clone = function () {
                    return new WinJSContrib.Logs.Appenders.BufferAppender(this.config);
                };
                /**
                 * log item
                 * @function WinJSContrib.Logs.Appenders.BufferAppender.prototype.log
                 * @param {string} message log message
                 * @param {WinJSContrib.Logs.Levels} log level
                 */
                BufferAppender.prototype.log = function (logger, message, level) {
                    var args = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        args[_i - 3] = arguments[_i];
                    }
                    if (this.config.level == Logs.Levels.inherit || level >= this.config.level) {
                        var msg = [new Date().getTime() + "", Logs.Levels[level].toUpperCase(), this.format(logger, message, level)];
                        if (args.length) {
                            args.forEach(function (a) {
                                if (typeof a == "object")
                                    a = JSON.stringify(a);
                                msg.push(a);
                            });
                        }
                        this.buffer.push(msg.join(" "));
                    }
                };
                /**
                 * create log group
                 * @function WinJSContrib.Logs.Appenders.BufferAppender.prototype.group
                 */
                BufferAppender.prototype.group = function (title) {
                };
                /**
                 * create collapsed log group
                 * @function WinJSContrib.Logs.Appenders.BufferAppender.prototype.groupCollapsed
                 */
                BufferAppender.prototype.groupCollapsed = function (title) {
                };
                /**
                 * close log group
                 * @function WinJSContrib.Logs.Appenders.BufferAppender.prototype.groupEnd
                 */
                BufferAppender.prototype.groupEnd = function () {
                };
                BufferAppender.prototype.format = function (logger, message, level) {
                    var finalMessage = "";
                    if (logger.Config && logger.Config.prefix)
                        finalMessage += logger.Config.prefix + " # ";
                    if (this.config.showLoggerNameInMessage)
                        finalMessage += logger.name + " # ";
                    if (this.config.showLevelInMessage)
                        finalMessage += Logs.logginLevelToString(level) + " # ";
                    finalMessage += message;
                    return finalMessage;
                };
                return BufferAppender;
            })();
            Appenders.BufferAppender = BufferAppender;
        })(Appenders = Logs.Appenders || (Logs.Appenders = {}));
    })(Logs = WinJSContrib.Logs || (WinJSContrib.Logs = {}));
})(WinJSContrib || (WinJSContrib = {}));
var WinJSContrib;
(function (WinJSContrib) {
    var Logs;
    (function (Logs) {
        /**
         * @namespace WinJSContrib.Logs
         */
        WinJSContrib.Logs = WinJSContrib.Logs;
        /**
        * enumeration for log levels
        * @enum {number} Levels
        * @memberof WinJSContrib.Logs
        */
        (function (Levels) {
            /**
             * disabled
             */
            Levels[Levels["inherit"] = 512] = "inherit";
            /**
             * disabled
             */
            Levels[Levels["off"] = 256] = "off";
            /**
             * log error
             */
            Levels[Levels["error"] = 32] = "error";
            /**
             * log warn and error
             */
            Levels[Levels["warn"] = 16] = "warn";
            /**
             * log info, warn, error
             */
            Levels[Levels["info"] = 8] = "info";
            /**
             * log debug, info, warn, error
             */
            Levels[Levels["debug"] = 4] = "debug";
            /**
            * verbose mode
            */
            Levels[Levels["verbose"] = 2] = "verbose";
        })(Logs.Levels || (Logs.Levels = {}));
        var Levels = Logs.Levels;
        ;
        // Default config
        Logs.defaultConfig = {
            "level": Levels.off,
            "showLevelInMessage": false,
            "showLoggerNameInMessage": false,
            "appenders": ["DefaultConsole"]
        };
        var Loggers = {};
        Logs.RuntimeAppenders = {
            "DefaultConsole": new Logs.Appenders.ConsoleAppender()
        };
        Logs.DefaultAppenders = [];
        /**
         * get a logger, logger is created if it does not exists
         * @function WinJSContrib.Logs.getLogger
         * @param {string} name name for the logger
         * @param {Object} config logger configuration
         * @param {...Object} appenders appenders to add to the logger
         * @returns {WinJSContrib.Logs.Logger}
         */
        function getLogger(name, config) {
            var existing = Loggers[name];
            if (!existing) {
                existing = new Logger(config || Logs.defaultConfig);
                existing.name = name;
                Loggers[name] = existing;
            }
            if (config || arguments.length > 2)
                configure.apply(null, arguments);
            return existing;
        }
        Logs.getLogger = getLogger;
        function configure(name, config) {
            var existing = Loggers[name];
            if (existing) {
                if (config)
                    existing.Config = config;
                if (arguments.length > 2) {
                    for (var i = 2; i < arguments.length; i++) {
                        existing.addAppender(arguments[i]);
                    }
                }
            }
        }
        Logs.configure = configure;
        function loggingLevelStringToEnum(level) {
            switch (level.toLowerCase()) {
                default:
                case "log":
                case "debug":
                    return Levels.debug;
                case "info":
                    return Levels.info;
                case "warn":
                    return Levels.warn;
                case "error":
                    return Levels.error;
            }
        }
        Logs.loggingLevelStringToEnum = loggingLevelStringToEnum;
        function logginLevelToString(level) {
            switch (level) {
                default:
                case Levels.verbose:
                    return "VERBOSE";
                case Levels.debug:
                    return "DEBUG";
                case Levels.info:
                    return "INFO";
                case Levels.warn:
                    return "WARN";
                case Levels.error:
                    return "ERROR";
            }
        }
        Logs.logginLevelToString = logginLevelToString;
        var Logger = (function () {
            /**
             * @class WinJSContrib.Logs.Logger
             * @param {Object} config logger configuration
             */
            function Logger(config) {
                this.appenders = [];
                /**
                 * Logger configuration
                 * @field Config
                 * @type {Object}
                 */
                this.Config = config || Logs.defaultConfig;
            }
            Object.defineProperty(Logger.prototype, "Config", {
                get: function () {
                    return this._config;
                },
                set: function (newValue) {
                    var _this = this;
                    this._config = newValue || { level: Logs.Levels.off, showLevelInMessage: false, showLoggerNameInMessage: false };
                    if (typeof newValue.level === "number")
                        this.Level = newValue.level;
                    if (typeof newValue.showLevelInMessage === "boolean")
                        this.Config.showLevelInMessage = newValue.showLevelInMessage;
                    if (typeof newValue.showLoggerNameInMessage === "boolean")
                        this.Config.showLoggerNameInMessage = newValue.showLoggerNameInMessage;
                    if (this._config.appenders) {
                        this._config.appenders.forEach(function (a) {
                            _this.addAppender(a);
                        });
                    }
                    else {
                        this._config.appenders = [];
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Logger.prototype, "Level", {
                get: function () {
                    return this._level;
                },
                set: function (val) {
                    this._level = val;
                    if (this._level <= Logs.Levels.verbose) {
                        this.verbose = Logger.verbose;
                    }
                    else {
                        this.verbose = Logger.noop;
                    }
                    if (this._level <= Logs.Levels.debug) {
                        this.debug = Logger.debug;
                    }
                    else {
                        this.debug = Logger.noop;
                    }
                    if (this._level <= Logs.Levels.info) {
                        this.info = Logger.info;
                    }
                    else {
                        this.info = Logger.noop;
                    }
                    if (this._level <= Logs.Levels.warn) {
                        this.warn = Logger.warn;
                    }
                    else {
                        this.warn = Logger.noop;
                    }
                    if (this._level <= Logs.Levels.error) {
                        this.error = Logger.error;
                    }
                    else {
                        this.error = Logger.noop;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * add appender to logger
             * @function WinJSContrib.Logs.Logger.prototype.addAppender
             * @param {Object} appender
             */
            Logger.prototype.addAppender = function (appender) {
                if (typeof appender == "string") {
                    appender = WinJSContrib.Logs.RuntimeAppenders[appender];
                }
                var currentappender = appender;
                if (!currentappender)
                    return;
                var exists = this.appenders.indexOf(currentappender) >= 0;
                if (exists)
                    return;
                //if (!currentappender.format)
                //    currentappender.format = this.format.bind(this);
                this.appenders.push(currentappender);
            };
            /**
             * Add log entry
             * @function WinJSContrib.Logs.Logger.prototype.log
             * @param {string} message log message
             * @param {WinJSContrib.Logs.Levels} log level
             */
            Logger.prototype.log = function (message, level) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                // If general logging level is set to 'none', returns
                if (this._config.level === WinJSContrib.Logs.Levels.off || level < this._config.level)
                    return;
                if (!this.appenders || !this.appenders.length)
                    return;
                var fnargs = [this, message, level];
                if (args.length) {
                    for (var i = 0; i < args.length; i++) {
                        fnargs.push(args[i]);
                    }
                }
                Logs.DefaultAppenders.forEach(function (a) {
                    a.log.apply(a, fnargs);
                });
                this.appenders.forEach(function (a) {
                    a.log.apply(a, fnargs);
                });
            };
            ///**
            // * format log entry
            // * @function WinJSContrib.Logs.Logger.prototype.format
            // * @param {string} message log message
            // * @param {string} group group/category for the entry
            // * @param {WinJSContrib.Logs.Levels} log level
            // */
            //public format(message: string, level: Logs.Levels) {
            //    var finalMessage = "";
            //    if (!this.Config.hideLevelInMessage) finalMessage += logginLevelToString(level) + " - ";
            //    finalMessage += message;
            //    return finalMessage;
            //}
            /**
             * add debug log entry
             * @function WinJSContrib.Logs.Logger.prototype.debug
             * @param {string} message log message
             */
            Logger.prototype.verbose = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            /**
             * add debug log entry
             * @function WinJSContrib.Logs.Logger.prototype.debug
             * @param {string} message log message
             */
            Logger.prototype.debug = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            /**
             * add info log entry
             * @function WinJSContrib.Logs.Logger.prototype.info
             * @param {string} message log message
             * @param {string} [group] log group name
             */
            Logger.prototype.info = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            /**
             * add warn log entry
             * @function WinJSContrib.Logs.Logger.prototype.warn
             * @param {string} message log message
             */
            Logger.prototype.warn = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            /**
             * add error log entry
             * @function WinJSContrib.Logs.Logger.prototype.error
             * @param {string} message log message
             */
            Logger.prototype.error = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            /**
             * create a log group
             * @function WinJSContrib.Logs.Logger.prototype.group
             * @param {string} title group title
             */
            Logger.prototype.group = function (title) {
                this.appenders.forEach(function (a) {
                    if (a.group)
                        a.group(title);
                });
            };
            /**
             * create a collapsed log group
             * @function WinJSContrib.Logs.Logger.prototype.groupCollapsed
             * @param {string} title group title
             */
            Logger.prototype.groupCollapsed = function (title) {
                this.appenders.forEach(function (a) {
                    if (a.groupCollapsed)
                        a.groupCollapsed(title);
                });
            };
            /**
             * end current group
             * @function WinJSContrib.Logs.Logger.prototype.groupEnd
             */
            Logger.prototype.groupEnd = function () {
                this.appenders.forEach(function (a) {
                    if (a.groupEnd)
                        a.groupEnd();
                });
            };
            /**
             * Get a child logger
             * @function WinJSContrib.Logs.Logger.prototype.getChildLogger
             * @param {string} name child logger name
             * @param {WinJSContrib.Logs.Levels} level
             */
            Logger.prototype.getChildLogger = function (name, level) {
                var res = WinJSContrib.Logs.getLogger(this.name + '.' + name, JSON.parse(JSON.stringify(this.Config)));
                res.Config.appenders = [];
                this.appenders.forEach(function (a) {
                    if (a.clone)
                        res.addAppender(a.clone());
                });
                if (level)
                    res.Config.level = level;
                return res;
            };
            Logger.noop = function (message) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            Logger.getLogFn = function (level) {
                return function (message) {
                    var args = null;
                    if (arguments.length > 1) {
                        args = [];
                        for (var i = 1; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        this.log(message, level, args);
                    }
                    else
                        this.log(message, level);
                };
            };
            Logger.verbose = Logger.getLogFn(Logs.Levels.verbose);
            Logger.debug = Logger.getLogFn(Logs.Levels.debug);
            Logger.info = Logger.getLogFn(Logs.Levels.info);
            Logger.warn = Logger.getLogFn(Logs.Levels.warn);
            Logger.error = Logger.getLogFn(Logs.Levels.error);
            return Logger;
        })();
        Logs.Logger = Logger;
    })(Logs = WinJSContrib.Logs || (WinJSContrib.Logs = {}));
})(WinJSContrib || (WinJSContrib = {}));

(function (_global) {
    //polyfill setimmediate
    if (!this.setImmediate) {
        this.setImmediate = function (callback) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            setTimeout(callback, 0);
            return 0;
        };
    }
    //Windows 10 doesn't have it anymore, polyfill for backward compat
    if (!this.toStaticHTML) {
        this.toStaticHTML = function (text) {
            return text;
        };
    }
    var msapp = _global.MSApp;
    if (msapp && !msapp.execUnsafeLocalFunction) {
        msapp.execUnsafeLocalFunction = function (c) { c(); };
    }
})(this);
if (!Object.map) {
    Object.map = function (obj, mapping) {
        var mapped = {};
        if (typeof obj !== 'object') {
            return mapped;
        }
        if (typeof mapping !== 'function') {
            // We could just return obj but that wouldn't be
            // consistent with the rest of the interface which always returns
            // a new object.
            mapping = function (key, val) {
                return [key, val];
            };
        }
        Object.keys(obj).forEach(function (key) {
            var transmuted = mapping.apply(obj, [key, obj[key]]);
            if (transmuted && transmuted.length) {
                mapped[transmuted[0] || key] = transmuted[1];
            }
        });
        return mapped;
    };
}
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}
if (!String.prototype.padLeft) {
    String.prototype.padLeft = function padLeft(length, leadingChar) {
        if (leadingChar === undefined) {
            leadingChar = "0";
        }
        return this.length < length ? (leadingChar + this).padLeft(length, leadingChar) : this;
    };
}
var WinJSContrib;
(function (WinJSContrib) {
    var Promise;
    (function (Promise) {
        /**
         * apply callback for each item in the array in waterfall
         * @function WinJSContrib.Promise.waterfall
         * @param {Array} dataArray items to process with async tasks
         * @param {function} promiseCallback function applyed to each item (could return a promise for item callback completion)
         * @returns {WinJS.Promise}
         */
        function waterfall(dataArray, promiseCallback) {
            var resultPromise = WinJS.Promise.wrap();
            var results = [];
            if (!dataArray) {
                return WinJS.Promise.wrap([]);
            }
            var dataPromise = WinJS.Promise.as(dataArray);
            return dataPromise.then(function (items) {
                var queueP = function (p, item) {
                    var prComplete, prError;
                    var result = new WinJS.Promise(function (c, e) {
                        prComplete = c;
                        prError = e;
                    });
                    p.then(function (previous) {
                        WinJS.Promise.as(promiseCallback(item, previous)).then(function (r) {
                            results.push(r);
                            return r;
                        }).then(prComplete, prError);
                    });
                    return result;
                };
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    if (!item && items.getItem) {
                        item = items.getItem(i);
                    }
                    resultPromise = queueP(resultPromise, item);
                }
                return resultPromise.then(function (r) {
                    return results;
                });
            });
        }
        Promise.waterfall = waterfall;
        function promises(dataArray, promiseCallback) {
            if (!dataArray) {
                return WinJS.Promise.wrap([]);
            }
            var dataPromise = WinJS.Promise.as(dataArray);
            return dataPromise.then(function (items) {
                var promises = [];
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    if (!item && items.getItem) {
                        item = items.getItem(i);
                    }
                    promises.push(WinJS.Promise.as(promiseCallback(item)));
                }
                return promises;
            });
        }
        /**
         * apply callback for each item in the array in parallel (equivalent to WinJS.Promise.join)
         * @function WinJSContrib.Promise.parallel
         * @param {Array} dataArray items to process with async tasks
         * @param {function} promiseCallback function applyed to each item (could return a promise for item callback completion)
         * @returns {WinJS.Promise}
         */
        function parallel(dataArray, promiseCallback) {
            if (!dataArray) {
                return WinJS.Promise.wrap([]);
            }
            var dataPromise = WinJS.Promise.as(dataArray);
            return dataPromise.then(function (items) {
                var promises = [];
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    if (!item && items.getItem) {
                        item = items.getItem(i);
                    }
                    promises.push(WinJS.Promise.as(promiseCallback(item)));
                }
                return WinJS.Promise.join(promises);
            });
        }
        Promise.parallel = parallel;
        /**
         * apply callback for each item in the array in batch of X parallel items
         * @function WinJSContrib.Promise.batch
         * @param {Array} dataArray items to process with async tasks
         * @param {number} batchSize number of items to batch
         * @param {function} promiseCallback function applyed to each item (could return a promise for item callback completion)
         * @returns {WinJS.Promise}
         */
        function batch(dataArray, batchSize, promiseCallback, batchWrapCallback) {
            if (!dataArray) {
                return WinJS.Promise.wrap([]);
            }
            var dataPromise = WinJS.Promise.as(dataArray);
            return dataPromise.then(function (items) {
                var resultPromise = WinJS.Promise.wrap();
                var batcheditems = [];
                var results = [];
                var hasErrors = false;
                var queueBatch = function (p, items) {
                    var prComplete, prError;
                    var result = new WinJS.Promise(function (c, e) {
                        prComplete = c;
                        prError = e;
                    });
                    p.then(function (r) {
                        WinJS.Promise.join(items.map(function (item, index) {
                            return WinJS.Promise.as(promiseCallback(item, index));
                        })).then(function (results) {
                            if (batchWrapCallback)
                                return batchWrapCallback(results);
                            return results;
                        }).then(function (results) {
                            results = results.concat(results);
                            return results;
                        }, function (errors) {
                            results = results.concat(errors);
                            hasErrors = true;
                            return results;
                        }).then(prComplete, prError);
                    });
                    return result;
                };
                for (var i = 0, l = items.length; i < l; i++) {
                    var item = items[i];
                    if (!item && items.getItem) {
                        item = items.getItem(i);
                    }
                    batcheditems.push(item);
                    if (i > 0 && i % batchSize === 0) {
                        resultPromise = queueBatch(resultPromise, batcheditems);
                        batcheditems = [];
                    }
                }
                if (batcheditems.length) {
                    resultPromise = queueBatch(resultPromise, batcheditems);
                }
                return resultPromise.then(function () {
                    if (hasErrors)
                        return WinJS.Promise.wrapError(results);
                    return results;
                });
            });
        }
        Promise.batch = batch;
    })(Promise = WinJSContrib.Promise || (WinJSContrib.Promise = {}));
})(WinJSContrib || (WinJSContrib = {}));
var WinJSContrib;
(function (WinJSContrib) {
    var Utils;
    (function (Utils) {
        var EventDispatcher = (function () {
            function EventDispatcher() {
            }
            EventDispatcher.prototype.dispatchEvent = function (type, data) { };
            EventDispatcher.prototype.addEventListener = function (type, callback) { };
            EventDispatcher.prototype.removeEventListener = function (type, callback) { };
            return EventDispatcher;
        })();
        Utils.EventDispatcher = EventDispatcher;
        Utils.EventDispatcher = WinJS.Class.mix(EventDispatcher, WinJS.Utilities.eventMixin);
        /**
         * extend an object with properties from subsequent objects
         * @function WinJSContrib.Utils.extend
         * @returns {Object} composite object
         */
        function extend() {
            for (var i = 1; i < arguments.length; i++)
                for (var key in arguments[i])
                    if (arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
            return arguments[0];
        }
        Utils.extend = extend;
        /** indicate if string starts with featured characters
         * @function WinJSContrib.Utils.startsWith
         * @param {string} str string to search within
         * @param {string} strToMatch match string
         * @returns {boolean} true if string starts with strToMatch
         */
        function startsWith(str, strToMatch) {
            if (!strToMatch) {
                return false;
            }
            var match = (str.match("^" + strToMatch) == strToMatch);
            return match;
        }
        Utils.startsWith = startsWith;
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (str) {
                return WinJSContrib.Utils.startsWith(this, str);
            };
        }
        function asyncForEach(array, callback, batchsize) {
            if (batchsize === void 0) { batchsize = 1; }
            var i = 0;
            while (i < array.length) {
                setImmediate(function () {
                    for (var j = 0; j < batchsize && i < array.length; j++) {
                        i++;
                        callback(array[i]);
                    }
                });
            }
        }
        Utils.asyncForEach = asyncForEach;
        /** indicate if string ends with featured characters
         * @function WinJSContrib.Utils.endsWith
         * @param {string} str string to search within
         * @param {string} strToMatch match string
         * @returns {boolean} true if string starts with strToMatch
         */
        function endsWith(str, strToMatch) {
            if (!strToMatch) {
                return false;
            }
            return (str.match(strToMatch + "$") == strToMatch);
        }
        Utils.endsWith = endsWith;
        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function (str) {
                return WinJSContrib.Utils.endsWith(this, str);
            };
        }
        /**
         * generate a string formatted as a query string from object properties
         * @function WinJSContrib.Utils.queryStringFrom
         * @param {Object} obj object to format
         * @returns {string}
         */
        function queryStringFrom(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    var key = encodeURIComponent(p);
                    var rawValue = obj[p];
                    var value = WinJSContrib.Utils.hasValue(rawValue) ? encodeURIComponent(rawValue) : "";
                    str.push(key + "=" + value);
                }
            return str.join("&");
        }
        Utils.queryStringFrom = queryStringFrom;
        /**
         * trigger an event on a DOM node
         * @function WinJSContrib.Utils.triggerEvent
         * @param {HTMLElement} element receiving the event
         * @param {string} eventName name of the event
         * @param {boolean} bubbles indicate if event should bubble
         * @param {boolean} cancellable indicate if event can be cancelled
         */
        function triggerEvent(element, eventName, bubbles, cancellable) {
            var eventToTrigger = document.createEvent("Event");
            eventToTrigger.initEvent(eventName, bubbles, cancellable);
            element.dispatchEvent(eventToTrigger);
        }
        Utils.triggerEvent = triggerEvent;
        /**
         * @function WinJSContrib.Utils.triggerCustomEvent
         * @param {HTMLElement} element receiving the event
         * @param {string} eventName name of the event
         * @param {boolean} bubbles indicate if event should bubble
         * @param {boolean} cancellable indicate if event can be cancelled
         */
        function triggerCustomEvent(element, eventName, bubbles, cancellable, data) {
            var eventToTrigger = document.createEvent("CustomEvent");
            eventToTrigger.initCustomEvent(eventName, bubbles, cancellable, data);
            element.dispatchEvent(eventToTrigger);
        }
        Utils.triggerCustomEvent = triggerCustomEvent;
        /*
        Core object properties features
        */
        //return object value based on property name. Property name is a string containing the name of the property, 
        //or the name of the property with an indexer, ex: myproperty[2] (to get item in a array)
        function getobject(obj, prop) {
            if (!obj)
                return;
            if (prop === 'this')
                return obj;
            var baseValue = obj[prop];
            if (typeof baseValue !== "undefined")
                return baseValue;
            var idx = prop.indexOf('[');
            if (idx < 0)
                return;
            var end = prop.indexOf(']', idx);
            if (end < 0)
                return;
            var val = prop.substr(idx + 1, end - idx);
            val = parseInt(val);
            return obj[val];
        }
        //set object property value based on property name. Property name is a string containing the name of the property, 
        //or the name of the property with an indexer, ex: myproperty[2] (to get item in a array)
        function setobject(obj, prop, data) {
            if (!obj)
                return;
            if (WinJSContrib.Utils.hasValue(prop)) {
                if (obj.setProperty) {
                    obj.setProperty(prop, data);
                    return;
                }
                obj[prop] = data;
                return;
            }
            if (typeof prop === "string") {
                var idx = prop.indexOf('[');
                if (idx < 0)
                    return;
                var end = prop.indexOf(']', idx);
                if (end < 0)
                    return;
                var val = prop.substr(idx + 1, end - idx);
                var intval = parseInt(val);
                obj[intval] = data;
            }
        }
        /** Read property value on an object based on expression
        * @function WinJSContrib.Utils.readProperty
        * @param {Object} source the object containing data
        * @param {Object} properties property descriptor. could be a string in js notation ex: 'myProp.myChildProp,
        * or an array of strings ['myProp', 'myChildProp']. String notation can contain indexers
        * @returns {Object} property value
        */
        function readProperty(source, properties) {
            if (!source)
                return null;
            if (typeof properties == 'string' && source[properties])
                return source[properties];
            if (!properties || !properties.length)
                return source;
            var prop = WinJSContrib.Utils.getProperty(source, properties);
            if (prop) {
                return prop.propValue;
            }
        }
        Utils.readProperty = readProperty;
        var PropertyDescriptor = (function () {
            function PropertyDescriptor(parent, parentDescriptor, keyProp) {
                this.parent = parent;
                this.parentDescriptor = parentDescriptor;
                this.keyProp = keyProp;
            }
            PropertyDescriptor.prototype.ensureParent = function () {
                if (parent) {
                    return parent;
                }
                else {
                    if (this.parentDescriptor) {
                        this.parentDescriptor.ensureParent();
                        if (!this.parentDescriptor.parent[this.parentDescriptor.keyProp]) {
                            this.parentDescriptor.parent[this.parentDescriptor.keyProp] = {};
                            this.parent = this.parentDescriptor.parent[this.parentDescriptor.keyProp];
                        }
                    }
                }
            };
            Object.defineProperty(PropertyDescriptor.prototype, "propValue", {
                get: function () {
                    return getobject(this.parent, this.keyProp);
                },
                set: function (val) {
                    this.ensureParent();
                    setobject(this.parent, this.keyProp, val);
                },
                enumerable: true,
                configurable: true
            });
            return PropertyDescriptor;
        })();
        Utils.PropertyDescriptor = PropertyDescriptor;
        /**
         * return a propery descriptor for an object based on expression
         * @function WinJSContrib.Utils.getProperty
         * @param {Object} source the object containing data
         * @param {string[]} properties property descriptor. could be a string in js notation ex: 'myProp.myChildProp,
         * or an array of strings ['myProp', 'myChildProp']. String notation can contain indexers
         * @returns {Object} property descriptor
         */
        function getProperty(source, properties) {
            if (typeof properties == 'string') {
                properties = properties.split('.');
            }
            if (!properties || !properties.length) {
                properties = ['this'];
            }
            var parent = source;
            var previousDescriptor = null;
            for (var i = 0; i < properties.length; i++) {
                var descriptor = new PropertyDescriptor(parent, previousDescriptor, properties[i]);
                previousDescriptor = descriptor;
                if (i == properties.length - 1) {
                    return descriptor;
                }
                parent = getobject(parent, properties[i]);
            }
            return;
        }
        Utils.getProperty = getProperty;
        /**
         * Write property value on an object based on expression
         * @function WinJSContrib.Utils.writeProperty
         * @param {Object} source the object containing data
         * @param {string[]} properties property descriptor. could be a string in js notation ex: 'myProp.myChildProp,
         * or an array of strings ['myProp', 'myChildProp']. String notation can contain indexers
         * @param {Object} data data to feed to the property
         */
        function writeProperty(source, properties, data) {
            var prop = WinJSContrib.Utils.getProperty(source, properties);
            if (prop) {
                prop.propValue = data;
            }
        }
        Utils.writeProperty = writeProperty;
        /** generate a random value between two numbers
         * @function WinJSContrib.Utils.randomFromInterval
         * @param {number} from lower limit
         * @param {number} to upper limit
         * @returns {number}
         */
        function randomFromInterval(from, to) {
            return (Math.random() * (to - from + 1) + from) << 0;
        }
        Utils.randomFromInterval = randomFromInterval;
        /**
         * function to use as a callback for Array.sort when you want the array to be sorted alphabetically
         * @function WinJSContrib.Utils.alphabeticSort
         * @param {string} a
         * @param {string} b
         * @returns {number}
         */
        function alphabeticSort(a, b) {
            if (a > b)
                return 1;
            if (a < b)
                return -1;
            return 0;
        }
        Utils.alphabeticSort = alphabeticSort;
        /**
         * generate an array with only distinct elements
         * @function WinJSContrib.Utils.distinctArray
         * @param {Array} array
         * @param {string} path to array's item property used for checking items
         * @param {boolean} ignorecase indicate if comparison should ignore case when using string
         * @returns {Array}
         */
        function distinctArray(array, property, ignorecase) {
            if (array === null || array.length === 0)
                return array;
            if (typeof ignorecase == "undefined")
                ignorecase = false;
            var sMatchedItems = "";
            var foundCounter = 0;
            var newArray = [];
            var sFind;
            var i;
            if (ignorecase) {
                for (i = 0; i < array.length; i++) {
                    if (property) {
                        var data = WinJSContrib.Utils.readProperty(array[i], property.split('.'));
                        sFind = data;
                        if (!data)
                            sFind = data;
                        if (data && data.toLowerCase)
                            sFind = data.toLowerCase();
                    }
                    else {
                        sFind = array[i];
                    }
                    if (sMatchedItems.indexOf("|" + sFind + "|") < 0) {
                        sMatchedItems += "|" + sFind + "|";
                        newArray[foundCounter++] = array[i];
                    }
                }
            }
            else {
                for (i = 0; i < array.length; i++) {
                    if (property) {
                        sFind = WinJSContrib.Utils.readProperty(array[i], property.split('.'));
                    }
                    else {
                        sFind = array[i];
                    }
                    if (sMatchedItems.indexOf("|" + sFind + "|") < 0) {
                        sMatchedItems += "|" + sFind + "|";
                        newArray[foundCounter++] = array[i];
                    }
                }
            }
            return newArray;
        }
        Utils.distinctArray = distinctArray;
        /**
         * get distinct values from an array of items
         * @function WinJSContrib.Utils.getDistinctPropertyValues
         * @param {Array} array items array
         * @param {string} property property path for values
         * @param {boolean} ignorecase ignore case for comparisons
         */
        function getDistinctPropertyValues(array, property, ignorecase) {
            return Utils.distinctArray(array, property, ignorecase).map(function (item) {
                return WinJSContrib.Utils.readProperty(item, property.split('.'));
            });
        }
        Utils.getDistinctPropertyValues = getDistinctPropertyValues;
        /**
         * Remove all accented characters from a string and replace them with their non-accented counterpart for ex: replace "é" with "e"
         * @function WinJSContrib.Utils.removeAccents
         * @param {string} s
         * @returns {string}
         */
        function removeAccents(s) {
            var r = s.toLowerCase();
            r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
            r = r.replace(new RegExp("æ", 'g'), "ae");
            r = r.replace(new RegExp("ç", 'g'), "c");
            r = r.replace(new RegExp("[èéêë]", 'g'), "e");
            r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
            r = r.replace(new RegExp("ñ", 'g'), "n");
            r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
            r = r.replace(new RegExp("œ", 'g'), "oe");
            r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
            r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
            return r;
        }
        Utils.removeAccents = removeAccents;
        /**
         * remove a page from navigation history
         * @function WinJSContrib.Utils.removePageFromHistory
         * @param {string} pageLocation page url
         */
        function removePageFromHistory(pageLoc) {
            var history = [];
            if (WinJS.Navigation.history && WinJS.Navigation.history.backStack && WinJS.Navigation.history.backStack.length) {
                WinJS.Navigation.history.backStack.forEach(function (page) {
                    if (page.location !== pageLoc) {
                        history.push(page);
                    }
                });
            }
            WinJS.Navigation.history.backStack = history;
        }
        Utils.removePageFromHistory = removePageFromHistory;
        /**
         * format a number on 2 digits
         * @function WinJSContrib.Utils.pad2
         * @param {number} number
         */
        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
        }
        Utils.pad2 = pad2;
        /**
         * truncate a string and add ellipse if text if greater than certain size
         * @function WinJSContrib.Utils.ellipsisizeString
         * @param {string} text text to truncate
         * @param {number} maxSize maximum size for text
         * @param {boolean} useWordBoundary indicate if truncate should happen on the closest word boundary (like space)
         */
        function ellipsisizeString(text, maxSize, useWordBoundary) {
            if (!text) {
                return '';
            }
            var toLong = text.length > maxSize, text_ = toLong ? text.substr(0, maxSize - 1) : text;
            text_ = useWordBoundary && toLong ? text_.substr(0, text_.lastIndexOf(' ')) : text_;
            return toLong ? text_ + '...' : text_;
        }
        Utils.ellipsisizeString = ellipsisizeString;
        /**
         * generate a new Guid
         * @function WinJSContrib.Utils.guid
         * @returns {string}
         */
        function guid() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }
        Utils.guid = guid;
        /**
         * inherit property from parent WinJS controls
         * @function WinJSContrib.Utils.inherit
         * @param {HTMLElement} element
         * @param {string} property property name
         */
        function inherit(element, property) {
            if (element && element.parentElement) {
                var current = element.parentElement;
                while (current) {
                    if (current.winControl) {
                        if (current.winControl[property] !== undefined) {
                            return current.winControl[property];
                        }
                    }
                    current = current.parentElement;
                }
            }
        }
        Utils.inherit = inherit;
        /**
         * move DOM childrens form one node to the other
         * @function WinJSContrib.Utils.moveChilds
         * @param {HTMLElement} source source node containing elements to move
         * @param {HTMLElement} target target node for moved elements
         */
        function moveChilds(source, target) {
            if (!source || !target)
                return;
            var childs = [];
            for (var i = 0; i < source.childNodes.length; i++) {
                childs.push(source.childNodes[i]);
            }
            childs.forEach(function (elt) {
                target.appendChild(elt);
            });
        }
        Utils.moveChilds = moveChilds;
        /**
         * get parent control identifyed by a property attached on DOM element
         * @function WinJSContrib.Utils.getParent
         * @param {string} property property attached to control's DOM element, for ex: msParentSelectorScope
         * @param {HTMLElement} element DOM element to scan
         * @returns {Object} WinJS control
         */
        function getParent(property, element) {
            if (!element)
                return;
            var current = element.parentNode;
            while (current) {
                if (current[property] && current.winControl) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        }
        Utils.getParent = getParent;
        /**
         * get parent control identifyed by a css class
         * @function WinJSContrib.Utils.getParentControlByClass
         * @param {string} className css class name
         * @param {HTMLElement} element DOM element to scan
         * @returns {Object} WinJS control
         */
        function getParentControlByClass(className, element) {
            if (!element)
                return;
            var current = element.parentNode;
            while (current) {
                if (current.classList && current.classList.contains(className) && current.winControl) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        }
        Utils.getParentControlByClass = getParentControlByClass;
        /**
         * get parent page control (work only with WinJSContrib.UI.PageControlNavigator
         * @function WinJSContrib.Utils.getParentPage
         * @param {HTMLElement} element DOM element to scan
         * @returns {Object} WinJS control
         */
        function getParentPage(element) {
            return WinJSContrib.Utils.getParent('mcnPage', element);
        }
        Utils.getParentPage = getParentPage;
        /**
         * get parent scope control (based on msParentSelectorScope)
         * @function WinJSContrib.Utils.getScopeControl
         * @param {HTMLElement} element DOM element to scan
         * @returns {Object} WinJS control
         */
        function getScopeControl(element) {
            var current = element.parentNode;
            while (current) {
                if (current.msParentSelectorScope) {
                    var scope = current.parentNode;
                    if (scope) {
                        var scopeControl = scope.winControl;
                        if (scopeControl) {
                            return scopeControl;
                        }
                    }
                }
                current = current.parentNode;
            }
        }
        Utils.getScopeControl = getScopeControl;
        /**
         * get WinJS.Binding.Template like control from a path, a control, a function or a DOM element
         * @function WinJSContrib.Utils.getTemplate
         * @param {Object} template template input
         * @returns {Object} WinJS.Binding.Template or template-like object (object with a render function)
         */
        function getTemplate(template) {
            if (template) {
                var templatetype = typeof template;
                if (templatetype == 'string') {
                    return new WinJS.Binding.Template(null, { href: template });
                }
                if (templatetype == 'function') {
                    return {
                        render: function (data, elt) {
                            var res = template(data, elt);
                            return WinJS.Promise.as(res);
                        }
                    };
                }
                else if (template.winControl) {
                    return template.winControl;
                }
                else if (template.render) {
                    return template;
                }
            }
        }
        Utils.getTemplate = getTemplate;
        /**
         * get a function from an expression, for example 'page:myAction' will return the myAction function from the parent page.
         * The returned function will be bound to it's owner. This function relies on {link WinJSContrib.Utils.resolveValue}, see this for details about how data are crawled
         * @function WinJSContrib.Utils.resolveMethod
         * @param {HTMLElement} element DOM element to look
         * @param {string} text expression like 'page:something' or 'ctrl:something' or 'something'
         * @returns {function}
         */
        function resolveMethod(element, text) {
            var res = WinJSContrib.Utils.resolveValue(element, text);
            if (res && typeof res == 'function')
                return res;
            return undefined;
        }
        Utils.resolveMethod = resolveMethod;
        function readValue(element, text) {
            var res = WinJSContrib.Utils.resolveValue(element, text);
            if (res) {
                if (typeof res == 'function')
                    return res(element);
                else
                    return res;
            }
            return undefined;
        }
        Utils.readValue = readValue;
        /**
         * Utility functions used by WinJSContrib.Utils.resolveValue and WinJSContrib.Utils.applyValue
         * @namespace WinJSContrib.Utils.ValueParsers
         */
        Utils.ValueParsers = {
            /**
             * Get value from current page in parent navigator
             * @function WinJSContrib.Utils.ValueParsers.navpage
             */
            "navpage": function (element, text, context) {
                var control = (context && context.data) ? context.data.navpage : null;
                if (!control) {
                    if (WinJSContrib.Utils.getParentPage) {
                        control = WinJSContrib.Utils.getParentPage(element);
                        if (context && context.data)
                            context.data.navpage = control;
                    }
                    if (!control && WinJSContrib.UI.Application.navigator) {
                        control = WinJSContrib.UI.Application.navigator.pageControl;
                        if (context && context.data)
                            context.data.navpage = control;
                    }
                }
                if (!control)
                    return;
                if (context)
                    context.parentControl = control;
                var method = WinJSContrib.Utils.readProperty(control, text);
                if (method && typeof method === 'function')
                    return method.bind(control);
                else
                    return method;
            },
            /**
             * Get value from parent element with 'pagecontrol' class
             * @function WinJSContrib.Utils.ValueParsers.page
             */
            "page": function (element, text, context) {
                var control = (context && context.data) ? context.data.page : null;
                if (!control) {
                    control = WinJSContrib.Utils.getParentControlByClass('pagecontrol', element);
                    if (context && context.data)
                        context.data.page = control;
                }
                if (!control)
                    return;
                if (context)
                    context.parentControl = control;
                var method = WinJSContrib.Utils.readProperty(control, text);
                if (method && typeof method === 'function')
                    return method.bind(control);
                else
                    return method;
            },
            /**
             * Get value from parent scope
             * @function WinJSContrib.Utils.ValueParsers.ctrl
             */
            "ctrl": function (element, text, context) {
                var control = (context && context.data) ? context.data.scope : null;
                if (!control) {
                    control = WinJSContrib.Utils.getScopeControl(element);
                    if (context && context.data)
                        context.data.scope = control;
                }
                if (!control)
                    return;
                if (context)
                    context.parentControl = control;
                var method = WinJSContrib.Utils.readProperty(control, text);
                if (method && typeof method === 'function')
                    return method.bind(control);
                else
                    return method;
            },
            /**
             * select a node from DOM
             * @function WinJSContrib.Utils.ValueParsers.select
             */
            "select": function (element, text, context) {
                var control = (context && context.data) ? context.data.scope : null;
                if (!control) {
                    control = WinJSContrib.Utils.getScopeControl(element);
                    if (context && context.data)
                        context.data.scope = control;
                }
                var element = null;
                var items = text.split('|');
                var selector = items[0];
                if (control) {
                    element = control.element.querySelector(selector);
                }
                if (!element)
                    element = document.querySelector(selector);
                if (items.length == 1) {
                    return element;
                }
                else if (items.length > 1) {
                    var val = readProperty(element, text.substr(items[0].length + 1));
                    return val;
                }
            },
            /**
             * get an object formatted as JSON
             * @function WinJSContrib.Utils.ValueParsers.obj
             */
            "obj": function (element, text, context) {
                return WinJS.UI.optionsParser(text, window, {
                    select: WinJS.Utilities.markSupportedForProcessing(function (text) {
                        var parent = WinJSContrib.Utils.getScopeControl(element);
                        if (parent) {
                            return parent.element.querySelector(text);
                        }
                        else {
                            return document.querySelector(text);
                        }
                    })
                });
            },
            /**
             * mark a promise for resolution (if used in applyValue, the promise will get resolved and the promise's result will be affected)
             * @function WinJSContrib.Utils.ValueParsers.prom
             */
            "prom": function (element, text, context) {
                var res = resolveValue(element, text, context);
                if (res.then) {
                    res = res.then(null, null);
                    res.mcnMustResolve = true;
                }
                return res;
            },
            /**
             * wrap result in WinJS.Binding.List().dataSource
             * usefull for ListViews
             * @function WinJSContrib.Utils.ValueParsers.list
             */
            "list": function (element, text, context) {
                var res = resolveValue(element, text, context);
                if (res) {
                    if (res.then) {
                        var p = res.then(function (data) {
                            return new WinJS.Binding.List(data).dataSource;
                        });
                        p.mcnMustResolve = true;
                        return p;
                    }
                    return new WinJS.Binding.List(res).dataSource;
                }
            },
            /**
             * get value from global scope
             * @function WinJSContrib.Utils.ValueParsers.global
             */
            "global": function (element, text, context) {
                return WinJSContrib.Utils.readProperty(window, text);
            },
            /**
             * get a template from uri
             * @function WinJSContrib.Utils.ValueParsers.templ
             */
            "templ": function (element, text, context) {
                return WinJSContrib.Templates.get(text);
            },
            /**
             * return element property
             * @function WinJSContrib.Utils.ValueParsers.element
             */
            "element": function (element, text, context) {
                var res = resolveValue(element, text, context);
                if (res)
                    return res.element;
            },
            "event": function (element, text, context) {
                var res = resolveValue(element, text, context);
                var parentControl = null;
                if (!res || !context || !context.name) {
                    return;
                }
                if (context)
                    parentControl = context.parentControl;
                if (res && typeof res === 'function') {
                    if (parentControl && parentControl.eventTracker) {
                        parentControl.eventTracker.addEvent(context.control, context.name, res);
                    }
                    else {
                        context.control.addEventListener(context.name, res);
                    }
                }
            }
        };
        /**
         * resolve value from an expression. This helper will crawl the DOM up, and provide the property or function from parent page or control.
         * @function WinJSContrib.Utils.resolveValue
         * @param {HTMLElement} element DOM element to look
         * @param {string} text expression like 'page:something' or 'ctrl:something' or 'something'
         * @returns {Object}
         */
        function resolveValue(element, text, context) {
            var methodName, control, method;
            var items = text.split(':');
            if (items.length > 1) {
                var name = items[0];
                var val = text.substr(name.length + 1);
                var parser = Utils.ValueParsers[name];
                if (parser) {
                    return parser(element, val, context);
                }
            }
            return text; //WinJSContrib.Utils.readProperty(window, text);
        }
        Utils.resolveValue = resolveValue;
        /**
         * call resolve value and apply result to a target object
         * @function WinJSContrib.Utils.applyValue
         * @param {HTMLElement} element DOM element to look
         * @param {string} text expression like 'page:something' or 'ctrl:something' or 'something'
         * @param {string} target target object
         * @param {string} targetPath path to dest property
         */
        function applyValue(element, text, target, targetPath, context) {
            var tmp = WinJSContrib.Utils.resolveValue(element, text, context);
            if (tmp && tmp.then && tmp.mcnMustResolve) {
                tmp.then(function (data) {
                    WinJSContrib.Utils.writeProperty(target, targetPath, data);
                });
            }
            else {
                WinJSContrib.Utils.writeProperty(target, targetPath, tmp);
            }
        }
        Utils.applyValue = applyValue;
        /**
         * Checks in a safe way if an object has a value, which could be 'false', '0' or '""'
         * @function WinJSContrib.Utils.hasValue
         * @param {Object} item The object to check.
         * @returns {Boolean} Whether the object has a value or not.
         */
        function hasValue(item) {
            return typeof item !== "undefined" && item !== null;
        }
        Utils.hasValue = hasValue;
        /**
         * format error from an xhr call
         * @function WinJSContrib.Utils.formatXHRError
         */
        function formatXHRError(xhr) {
            return "{0} - {1}: {2}".format(xhr.status, xhr.statusText, xhr.responseText);
        }
        Utils.formatXHRError = formatXHRError;
        /**
         * Unwraps the real error from a WinJS.Promise.join operation, which by design returns an array with 'undefined' for all cells,
         * excepts the one corresponding to the promise that really faulted.
         * @function WinJSContrib.Utils.unwrapJoinError
         * @param {function} errorCallback The callback to use to handle the error.
         * @returns {Function} The result of the callback being fired with the real error.
         */
        function unwrapJoinError(errorCallback) {
            return function (errorArray) {
                var unwrappedError = null;
                for (var i = 0; i < errorArray.length; i++) {
                    var tentativeError = errorArray[i];
                    if (typeof tentativeError !== "undefined") {
                        unwrappedError = tentativeError;
                        break;
                    }
                }
                return errorCallback(unwrappedError);
            };
        }
        Utils.unwrapJoinError = unwrapJoinError;
        /**
         * inject properties from source object to target object
         * @function WinJSContrib.Utils.inject
         */
        function inject(target, source) {
            if (source) {
                for (var k in source) {
                    target[k] = source[k];
                }
            }
        }
        Utils.inject = inject;
    })(Utils = WinJSContrib.Utils || (WinJSContrib.Utils = {}));
})(WinJSContrib || (WinJSContrib = {}));
/**
 * @namespace WinJSContrib.Templates
 */
var WinJSContrib;
(function (WinJSContrib) {
    var Templates;
    (function (Templates) {
        var cache = {};
        /**
         * get a template from it's path
         * @function get
         * @memberof WinJSContrib.Templates
         * @param {string} uri path to template file
         * @returns {WinJS.Binding.Template} template object
         */
        function get(uri) {
            var template = cache[uri];
            if (cache[uri])
                return template;
            return new WinJS.Binding.Template(null, { href: uri });
        }
        Templates.get = get;
        /**
         * get a template and turn it to a rendering function that takes an item promise, and return a DOM element
         * @function WinJSContrib.Templates.interactive
         * @param {string} uri path to template file
         * @param {Object} args definition of interactive elements
         * @returns {function} rendering function that takes an item promise, and return a DOM element
         */
        function interactive(uri, args) {
            var template = WinJSContrib.Templates.get(uri);
            if (template) {
                return WinJSContrib.Templates.makeInteractive(template, args);
            }
            else {
                throw { message: 'template not found for ' + uri };
            }
        }
        Templates.interactive = interactive;
        /**
         * generate a rendering function that takes an item promise, and return a DOM element
         * @function WinJSContrib.Templates.get
         * @param {WinJS.Binding.Template} template template object
         * @param {Object} args definition of interactive elements
         * @returns {function} rendering function that takes an item promise, and return a DOM element
         */
        function makeInteractive(template, args) {
            return function (itemPromise) {
                return itemPromise.then(function (item) {
                    return template.render(item).then(function (rendered) {
                        if (args.tap) {
                            for (var n in args.tap) {
                                var elt = rendered.querySelector(n);
                                WinJSContrib.UI.tap(elt, function (arg) {
                                    args.tap[n](arg, item);
                                });
                            }
                        }
                        if (args.click) {
                            for (var n in args.click) {
                                var elt = rendered.querySelector(n);
                                elt.onclick = function (arg) {
                                    args.click[n](arg, item);
                                };
                            }
                        }
                        return rendered;
                    });
                });
            };
        }
        Templates.makeInteractive = makeInteractive;
    })(Templates = WinJSContrib.Templates || (WinJSContrib.Templates = {}));
})(WinJSContrib || (WinJSContrib = {}));

var WinJSContrib;
(function (WinJSContrib) {
    var UI;
    (function (UI) {
        UI.Application = {};
        /**
         * indicate if fragment should not look for resources when building control
         * @field WinJSContrib.UI.disableAutoResources
         * @type {boolean}
         */
        UI.disableAutoResources = false;
        /**
         * Calculate offset of element relative to parent element. If parent parameter is null, offset is relative to document
         * @function WinJSContrib.UI.offsetFrom
         * @param {HTMLElement} element element to evaluate
         * @param {HTMLElement} parent reference of offset
         */
        function offsetFrom(element, parent) {
            var xPosition = 0;
            var yPosition = 0;
            var w = element.clientWidth;
            var h = element.clientHeight;
            while (element && element != parent) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition, width: w, height: h };
        }
        UI.offsetFrom = offsetFrom;
        var EventTracker = (function () {
            /**
             * @class WinJSContrib.UI.EventTracker
             * @classdesc object to register and release events from addEventListener or bind
             */
            function EventTracker() {
                this.events = [];
            }
            /**
             * register an event from an object
             * @function WinJSContrib.UI.EventTracker.prototype.addEvent
             * @param {Object} e object containing addEventListener
             * @param {string} eventName name of the event
             * @param {function} handler
             * @param {boolean} capture
             * @returns {function} function to call for unregistering the event
             */
            EventTracker.prototype.addEvent = function (e, eventName, handler, capture) {
                var tracker = this;
                e.addEventListener(eventName, handler, capture);
                var unregister = function () {
                    try {
                        e.removeEventListener(eventName, handler);
                        var idx = tracker.events.indexOf(unregister);
                        if (idx >= 0) {
                            tracker.events.splice(idx, 1);
                        }
                    }
                    catch (exception) {
                        console.error('unexpected error while releasing callback ' + exception.message);
                    }
                };
                this.events.push(unregister);
                return unregister;
            };
            /**
             * register binding event
             * @function WinJSContrib.UI.EventTracker.prototype.addBinding
             * @param {Object} e object containing bind method
             * @param {string} eventName name of the binding event
             * @param {function} handler
             */
            EventTracker.prototype.addBinding = function (e, eventName, handler) {
                e.bind(eventName, handler);
                var unregister = function () {
                    e.unbind(eventName, handler);
                };
                this.events.push(unregister);
                return unregister;
            };
            /**
             * release all registered events
             * @function WinJSContrib.UI.EventTracker.prototype.dispose
             */
            EventTracker.prototype.dispose = function () {
                for (var i = 0; i < this.events.length; i++) {
                    this.events[i]();
                }
                this.events = [];
            };
            return EventTracker;
        })();
        UI.EventTracker = EventTracker;
        /**
         * open all appbars
         * @function WinJSContrib.UI.appbarsOpen
         */
        function appbarsOpen() {
            var res = document.querySelectorAll('div[data-win-control="WinJS.UI.AppBar"],div[data-win-control="WinJS.UI.NavBar"]');
            if (res && res.length) {
                for (var i = 0; i < res.length; i++) {
                    var e = res[i];
                    if (e.winControl) {
                        e.winControl.show();
                    }
                }
            }
        }
        UI.appbarsOpen = appbarsOpen;
        /**
         * close all appbars
         * @function WinJSContrib.UI.appbarsClose
         */
        function appbarsClose() {
            var res = document.querySelectorAll('div[data-win-control="WinJS.UI.AppBar"],div[data-win-control="WinJS.UI.NavBar"]');
            if (res && res.length) {
                for (var i = 0; i < res.length; i++) {
                    var e = res[i];
                    if (e.winControl) {
                        e.winControl.hide();
                    }
                }
            }
        }
        UI.appbarsClose = appbarsClose;
        /**
         * disable all appbars
         * @function WinJSContrib.UI.appbarsDisable
         */
        function appbarsDisable() {
            var res = document.querySelectorAll('div[data-win-control="WinJS.UI.AppBar"],div[data-win-control="WinJS.UI.NavBar"]');
            if (res && res.length) {
                for (var i = 0; i < res.length; i++) {
                    var e = res[i];
                    if (e.winControl) {
                        e.winControl.disabled = true;
                    }
                }
            }
        }
        UI.appbarsDisable = appbarsDisable;
        /**
         * enable all appbars
         * @function WinJSContrib.UI.appbarsEnable
         */
        function appbarsEnable() {
            var elements = document.querySelectorAll('div[data-win-control="WinJS.UI.AppBar"],div[data-win-control="WinJS.UI.NavBar"]');
            if (elements && elements.length) {
                for (var i = 0, l = elements.length; i < l; i++) {
                    var el = elements[i];
                    if (el.winControl) {
                        el.winControl.disabled = false;
                    }
                }
            }
        }
        UI.appbarsEnable = appbarsEnable;
        /**
         * build a promise around element "load" event (work for all element with src property like images, iframes, ...)
         * @function WinJSContrib.UI.elementLoaded
         * @param {HTMLElement} element
         * @param {string} url url used to feed "src" on element
         * @returns {WinJS.Promise}
         */
        function elementLoaded(elt, url) {
            return new WinJS.Promise(function (complete, error) {
                function onerror(e) {
                    elt.onload = undefined;
                    elt.onerror = undefined;
                    elt.onreadystatechange = undefined;
                    error('element not loaded');
                }
                function onload(e) {
                    elt.onload = undefined;
                    elt.onerror = undefined;
                    elt.onreadystatechange = undefined;
                    complete({
                        element: elt,
                        url: url
                    });
                }
                elt.onerror = onerror;
                elt.onload = onload;
                elt.onreadystatechange = onload;
                if (elt.naturalWidth > 0) {
                    onload(undefined);
                }
                elt.src = url;
            });
        }
        UI.elementLoaded = elementLoaded;
        /**
         * Create a promise for getting an image object from url
         * @function WinJSContrib.UI.loadImage
         * @param {string} imgUrl url for the picture
         * @returns {WinJS.Promise}
         */
        function loadImage(imgUrl) {
            return new WinJS.Promise(function (complete, error) {
                var image = new Image();
                function onerror(e) {
                    image.onload = undefined;
                    image.onerror = undefined;
                    error({ message: 'image not loaded : ' + imgUrl, path: imgUrl });
                }
                function onload(e) {
                    image.onload = undefined;
                    image.onerror = undefined;
                    complete({
                        element: image,
                        url: imgUrl
                    });
                }
                image.onerror = onerror;
                image.onload = onload;
                if (image.naturalWidth > 0) {
                    onload(undefined);
                }
                image.src = imgUrl;
            });
        }
        UI.loadImage = loadImage;
        /**
         * List all elements found after provided element
         * @function WinJSContrib.UI.listElementsAfterMe
         * @param {HTMLElement} elt target element
         * @returns {Array} list of sibling elements
         */
        function listElementsAfterMe(elt) {
            var res = [];
            var passed = false;
            if (elt.parentElement) {
                var parent = elt.parentElement;
                for (var i = 0; i < parent.children.length; i++) {
                    if (parent.children[i] === elt) {
                        passed = true;
                    }
                    else if (passed) {
                        res.push(parent.children[i]);
                    }
                }
            }
            return res;
        }
        UI.listElementsAfterMe = listElementsAfterMe;
        /**
         * create an animation for removing an element from a list
         * @function WinJSContrib.UI.removeElementAnimation
         * @param {HTMLElement} element that will be removed
         * @returns {WinJS.Promise}
         */
        function removeElementAnimation(elt) {
            return new WinJS.Promise(function (complete, error) {
                var remainings = WinJSContrib.UI.listElementsAfterMe(elt);
                var anim = WinJS.UI.Animation.createDeleteFromListAnimation([
                    elt
                ], remainings);
                elt.style.position = "fixed";
                elt.style.opacity = '0';
                anim.execute().done(function () {
                    complete(elt);
                });
            });
        }
        UI.removeElementAnimation = removeElementAnimation;
        function bindAction(el, element, control, item) {
            if (!el)
                return;
            el.classList.add('page-action');
            var actionName = el.dataset.pageAction || el.getAttribute('tap');
            var action = control[actionName];
            if (action && typeof action === 'function') {
                WinJSContrib.UI.tap(el, function (eltarg) {
                    var p = WinJS.Promise.wrap(actionArgs);
                    var actionArgs = eltarg.dataset.pageActionArgs || el.getAttribute('tap-args');
                    if (actionArgs && typeof actionArgs == 'string') {
                        var tmp = WinJSContrib.Utils.readValue(eltarg, actionArgs);
                        p = WinJS.Promise.as(tmp).then(function (val) {
                            if (typeof val === 'string') {
                                try {
                                    val = WinJS.UI.optionsParser(val, window);
                                }
                                catch (exception) {
                                    return;
                                }
                            }
                            return val;
                        });
                        if (tmp) {
                            actionArgs = tmp;
                        }
                    }
                    return p.then(function (arg) {
                        return control[actionName].bind(control)({ elt: eltarg, args: arg, item: item });
                    });
                });
            }
        }
        /**
         * setup declarative binding to parent control function. It looks for "data-page-action" attributes,
         * and try to find a matching method on the supplyed control.
         * You could add arguments with a "page-action-args" attribute. The argument can be an object or a function
         * @function WinJSContrib.UI.bindPageActions
         * @param {HTMLElement} element root node crawled for page actions
         * @param {Object} control control owning functions to call
         * @param {item} optionnal argument for adding an item to call
         */
        function bindPageActions(element, control, item) {
            var elements = element.querySelectorAll('*[data-page-action], *[tap]');
            if (elements && elements.length) {
                for (var i = 0, l = elements.length; i < l; i++) {
                    var el = elements[i];
                    bindAction(el, element, control, item);
                }
            }
        }
        UI.bindPageActions = bindPageActions;
        function bindLink(el, element, item) {
            if (!el)
                return;
            el.classList.add('page-link');
            var applink = el.getAttribute('applink');
            var target = el.dataset.pageLink || el.getAttribute('linkto');
            if (target && target.indexOf('/') < 0) {
                var tmp = WinJSContrib.Utils.readProperty(window, target);
                if (tmp) {
                    target = tmp;
                }
            }
            if (target) {
                var options = el.dataset.pageActionOptions || el.getAttribute('tap-options');
                if (options) {
                    try {
                        options = WinJS.UI.optionsParser(options, window);
                    }
                    catch (exception) {
                        return;
                    }
                }
                WinJSContrib.UI.tap(el, function (eltarg) {
                    var p = WinJS.Promise.wrap();
                    var actionArgs = eltarg.dataset.pageActionArgs || el.getAttribute('linkto-args');
                    if (actionArgs && typeof actionArgs == 'string') {
                        var tmp = WinJSContrib.Utils.readValue(eltarg, actionArgs);
                        p = WinJS.Promise.as(tmp).then(function (val) {
                            if (typeof val === 'string') {
                                try {
                                    val = WinJS.UI.optionsParser(val, window);
                                }
                                catch (exception) {
                                }
                            }
                            return val;
                        });
                    }
                    if (!actionArgs && item)
                        actionArgs = { item: item };
                    return p.then(function (actionArgs) {
                        if (!applink && WinJSContrib.UI.parentNavigator && WinJSContrib.UI.parentNavigator(eltarg)) {
                            var nav = WinJSContrib.UI.parentNavigator(eltarg);
                            return nav.navigate(target, actionArgs);
                        }
                        else {
                            return WinJS.Navigation.navigate(target, actionArgs);
                        }
                    });
                }, options);
            }
        }
        /**
         * setup declarative binding to page link. It looks for "data-page-link" attributes.
         * If any the content of the attribute point toward a page. clicking that element will navigate to that page.
         * You could add arguments with a "page-action-args" attribute. The argument can be an object or a function
         * @function WinJSContrib.UI.bindPageLinks
         * @param {HTMLElement} element root node crawled for page actions
         */
        function bindPageLinks(element, item) {
            var elements = element.querySelectorAll('*[data-page-link], *[linkto]');
            if (elements && elements.length) {
                for (var i = 0, l = elements.length; i < l; i++) {
                    var el = elements[i];
                    bindLink(el, element, item);
                }
            }
        }
        UI.bindPageLinks = bindPageLinks;
        function parentNavigator(element) {
            var current = element.parentNode;
            while (current) {
                if (current.mcnNavigator) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        }
        UI.parentNavigator = parentNavigator;
        function bindMember(el, element, control) {
            if (!el)
                return;
            el.classList.add('page-member');
            var memberName = el.dataset.pageMember || el.getAttribute('member');
            if (!memberName)
                memberName = el.id;
            if (memberName && !control[memberName]) {
                control[memberName] = el;
                if (el.winControl) {
                    control[memberName] = el.winControl;
                }
            }
        }
        /**
         * Add this element or control as member to the control. It looks for "data-page-member" attributes. If attribute is empty, it tooks the element id as member name.
         * @function WinJSContrib.UI.bindMembers
         * @param {HTMLElement} element root node crawled for page actions
         * @param {Object} control control owning functions to call
         */
        function bindMembers(element, control) {
            var elements = element.querySelectorAll('*[data-page-member], *[member]');
            if (elements && elements.length) {
                for (var i = 0, l = elements.length; i < l; i++) {
                    var el = elements[i];
                    bindMember(el, element, control);
                }
            }
        }
        UI.bindMembers = bindMembers;
        /**
         * setup declarative binding to parent control function and to navigation links. It internally invoke both {@link WinJSContrib.UI.bindPageActions} and {@link WinJSContrib.UI.bindPageLinks}
         * @function WinJSContrib.UI.bindActions
         * @param {HTMLElement} element root node crawled for page actions
         * @param {Object} control control owning functions to call
         */
        function bindActions(element, control, item) {
            WinJSContrib.UI.bindPageActions(element, control, item);
            WinJSContrib.UI.bindPageLinks(element, item);
        }
        UI.bindActions = bindActions;
        /**
         * Trigger events on media queries. This class is usefull as a component for other controls to change some properties based on media queries
         * @class WinJSContrib.UI.MediaTrigger
         * @param {Object} items object containing one property for each query
         * @param {Object} linkedControl control linked to media trigger
         */
        var MediaTrigger = (function () {
            function MediaTrigger(items, linkedControl) {
                var ctrl = this;
                ctrl.queries = [];
                ctrl.linkedControl = linkedControl;
                for (var name in items) {
                    var e = items[name];
                    if (e.query) {
                        ctrl.registerMediaEvent(name, e.query, e);
                    }
                }
            }
            /**
             * @function WinJSContrib.UI.MediaTrigger.prototype.dispose
             * release media trigger
             */
            MediaTrigger.prototype.dispose = function () {
                var ctrl = this;
                ctrl.linkedControl = null;
                this.queries.forEach(function (q) {
                    q.dispose();
                });
            };
            /**
             * register an event from a media query
             * @function WinJSContrib.UI.MediaTrigger.prototype.registerMediaEvent
             * @param {string} name event name
             * @param {string} query media query
             * @param {Object} data data associated with this query
             */
            MediaTrigger.prototype.registerMediaEvent = function (name, query, data) {
                var ctrl = this;
                var mq = window.matchMedia(query);
                var internalQuery = {
                    name: name,
                    query: query,
                    data: data,
                    mq: mq,
                    dispose: null
                };
                var f = function (arg) {
                    if (arg.matches) {
                        ctrl._mediaEvent(arg, internalQuery);
                    }
                };
                mq.addListener(f);
                internalQuery.dispose = function () {
                    mq.removeListener(f);
                };
                ctrl.queries.push(internalQuery);
            };
            MediaTrigger.prototype._mediaEvent = function (arg, query) {
                var ctrl = this;
                if (ctrl.linkedControl) {
                    WinJS.UI.setOptions(ctrl.linkedControl, query.data);
                }
                ctrl.dispatchEvent('media', query);
            };
            /**
             * @function WinJSContrib.UI.MediaTrigger.prototype.check
             * Check all registered queries
             */
            MediaTrigger.prototype.check = function () {
                var ctrl = this;
                ctrl.queries.forEach(function (q) {
                    var mq = window.matchMedia(q.query);
                    if (mq.matches) {
                        ctrl._mediaEvent({ matches: true }, q);
                    }
                });
            };
            /**
             * Adds an event listener to the control.
             * @function WinJSContrib.UI.MediaTrigger.prototype.addEventListener
             * @param type The type (name) of the event.
             * @param listener The listener to invoke when the event gets raised.
             * @param useCapture If true, initiates capture, otherwise false.
            **/
            MediaTrigger.prototype.addEventListener = function (type, listener, useCapture) {
            };
            /**
             * Raises an event of the specified type and with the specified additional properties.
             * @function WinJSContrib.UI.MediaTrigger.prototype.dispatchEvent
             * @param type The type (name) of the event.
             * @param eventProperties The set of additional properties to be attached to the event object when the event is raised.
             * @returns true if preventDefault was called on the event.
            **/
            MediaTrigger.prototype.dispatchEvent = function (type, eventProperties) {
                return false;
            };
            /**
             * Removes an event listener from the control.
             * @function WinJSContrib.UI.MediaTrigger.prototype.removeEventListener
             * @param type The type (name) of the event.
             * @param listener The listener to remove.
             * @param useCapture true if capture is to be initiated, otherwise false.
            **/
            MediaTrigger.prototype.removeEventListener = function (type, listener, useCapture) { };
            return MediaTrigger;
        })();
        UI.MediaTrigger = MediaTrigger;
        WinJS.Class.mix(WinJSContrib.UI.MediaTrigger, WinJS.Utilities.eventMixin);
        /**
         * register navigation related events like hardware backbuttons. This method keeps track of previously registered navigation handlers
         *  and disable them until the latests is closed, enablinh multi-level navigation.
         * @function WinJSContrib.UI.registerNavigationEvents
         * @param {Object} control control taking ownership of navigation handlers
         * @param {function} callback callback to invoke when "back" is requested
         * @returns {function} function to call for releasing navigation handlers
         */
        var registeredNavigationStack = [];
        function registerNavigationEvents(control, callback) {
            var locked = [];
            var registration = { control: control, callback: callback };
            registeredNavigationStack.push(registration);
            //control.navLocks = control.navLocks || [];
            //control.navLocks.isActive = true;
            var backhandler = function (arg) {
                var idx = registeredNavigationStack.indexOf(registration);
                if (idx === registeredNavigationStack.length - 1) {
                    registration.callback.bind(registration.control)(arg);
                    idx--;
                    while (idx >= 0 && !arg.handled) {
                        var tmp = registeredNavigationStack[idx];
                        tmp.callback.bind(tmp.control)(arg);
                        idx--;
                    }
                }
                //if (!control.navLocks || control.navLocks.length === 0) {
                //    callback.bind(control)(arg);
                //}
            };
            //var navcontrols = document.querySelectorAll('.mcn-navigation-ctrl');
            //for (var i = 0; i < navcontrols.length; i++) {
            //    var navigationCtrl = (<any>navcontrols[i]).winControl;
            //    if (navigationCtrl && navigationCtrl != control) {
            //        navigationCtrl.navLocks = navigationCtrl.navLocks || [];
            //        if (navigationCtrl.navLocks.isActive && (!navigationCtrl.navLocks.length || navigationCtrl.navLocks.indexOf(control) < 0)) {
            //            navigationCtrl.navLocks.push(control);
            //            locked.push(navigationCtrl);
            //        }
            //    }
            //}
            function cancelNavigation(args) {
                //this.eventTracker.addEvent(nav, 'beforenavigate', this._beforeNavigate.bind(this));
                var p = new WinJS.Promise(function (c) { });
                args.detail.setPromise(p);
                //setImmediate(function () {
                p.cancel();
                //});
            }
            WinJS.Navigation.addEventListener('beforenavigate', cancelNavigation);
            if (window.Windows && window.Windows.Phone)
                window.Windows.Phone.UI.Input.HardwareButtons.addEventListener("backpressed", backhandler);
            else {
                document.addEventListener("backbutton", backhandler);
                var systemNavigationManager = null;
                if (WinJSContrib.UI && WinJSContrib.UI.enableSystemBackButtonVisibility && window.Windows && window.Windows.UI && window.Windows.UI.Core && window.Windows.UI.Core.SystemNavigationManager) {
                    systemNavigationManager = window.Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                    systemNavigationManager.addEventListener('backrequested', backhandler);
                }
            }
            var keypress = function (args) {
                if (args.key === "Esc" || args.key === "Backspace") {
                    backhandler(args);
                }
            };
            document.body.addEventListener('keypress', keypress);
            if (WinJSContrib.UI.Application && WinJSContrib.UI.Application.navigator)
                WinJSContrib.UI.Application.navigator.addLock();
            return function () {
                if (WinJSContrib.UI.Application && WinJSContrib.UI.Application.navigator)
                    WinJSContrib.UI.Application.navigator.removeLock();
                //control.navLocks.isActive = false;
                //locked.forEach(function (navigationCtrl) {
                //    var idx = navigationCtrl.navLocks.indexOf(control);
                //    if (idx >= 0)
                //        navigationCtrl.navLocks.splice(idx, 1);
                //});
                var idx = registeredNavigationStack.indexOf(registration);
                registeredNavigationStack.splice(idx, 1);
                document.body.removeEventListener('keypress', keypress);
                WinJS.Navigation.removeEventListener('beforenavigate', cancelNavigation);
                if (window.Windows && window.Windows.Phone)
                    window.Windows.Phone.UI.Input.HardwareButtons.removeEventListener("backpressed", backhandler);
                else {
                    document.removeEventListener("backbutton", backhandler);
                    var systemNavigationManager = null;
                    if (WinJSContrib.UI && WinJSContrib.UI.enableSystemBackButtonVisibility && window.Windows && window.Windows.UI && window.Windows.UI.Core && window.Windows.UI.Core.SystemNavigationManager) {
                        systemNavigationManager = window.Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                        systemNavigationManager.removeEventListener('backrequested', backhandler);
                    }
                }
            };
        }
        UI.registerNavigationEvents = registerNavigationEvents;
        /**
         * remove tap behavior
         * @function WinJSContrib.UI.untap
         * @param {HtmlElement} element element to clean
         */
        function untap(element) {
            if (!element)
                return;
            if (element.mcnTapTracking) {
                element.mcnTapTracking.dispose();
                element.mcnTapTracking = null;
            }
        }
        UI.untap = untap;
        /**
         * remove tap behavior from all childs
         * @function WinJSContrib.UI.untapAll
         * @param {HtmlElement} element element to clean
         */
        function untapAll(element) {
            if (!element)
                return;
            var taps = element.querySelectorAll('.tap');
            for (var i = 0, l = taps.length; i < l; i++) {
                untap(taps[i]);
            }
        }
        UI.untapAll = untapAll;
        UI.defaultTapBehavior = {
            animDown: null,
            animUp: null,
            disableAnimation: false,
            disableAria: false,
            awaitAnim: false,
            errorDelay: 3000,
            mapClickEvents: 0
        };
        if (WinJS && WinJS.UI && WinJS.UI.Animation) {
            UI.defaultTapBehavior.animDown = WinJS.UI.Animation.pointerDown;
            UI.defaultTapBehavior.animUp = WinJS.UI.Animation.pointerUp;
        }
        /**
         * add tap behavior to an element, tap manages quirks like click delay, visual feedback, etc
         * @function WinJSContrib.UI.tap
         * @param {HtmlElement} element element to make "tappable"
         * @param {function} callback callback function invoked on tap
         * @param {Object} options tap options
         */
        function tap(element, callback, options) {
            if (!element)
                return;
            var ptDown = function (event) {
                var elt = event.currentTarget || event.target;
                var tracking = elt.mcnTapTracking;
                if (!elt.disabled && tracking && (event.button === undefined || event.button === 0 || (tracking.allowRickClickTap && event.button === 2))) {
                    if (tracking.lock) {
                        if (event.pointerId && event.currentTarget.setPointerCapture)
                            event.currentTarget.setPointerCapture(event.pointerId);
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    WinJS.Utilities.addClass(elt, 'tapped');
                    WinJS.Utilities.removeClass(elt, 'tap-error');
                    clearTimeout(tracking.pendingErrorTimeout);
                    if (event.changedTouches) {
                        tracking.pointerdown = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
                    }
                    else {
                        tracking.pointerdown = { x: event.clientX, y: event.clientY };
                    }
                    tracking.animDown(event.currentTarget);
                    if (tracking.tapOnDown) {
                        tracking.invoke(elt, event);
                    }
                }
            };
            var ptOut = function (event) {
                var elt = event.currentTarget || event.target;
                var tracking = elt.mcnTapTracking;
                if (tracking && tracking.pointerdown) {
                    WinJS.Utilities.removeClass(elt, 'tapped');
                    if (event.pointerId && elt.releasePointerCapture) {
                        try {
                            elt.releasePointerCapture(event.pointerId);
                        }
                        catch (exception) {
                            console.error(exception);
                        }
                    }
                    if (!tracking.disableAnimation)
                        tracking.animUp(event.currentTarget);
                }
            };
            var ptUp = function (event) {
                var elt = event.currentTarget || event.target;
                var tracking = elt.mcnTapTracking;
                if (tracking && (event.button === undefined || event.button === 0 || (tracking.allowRickClickTap && event.button === 2))) {
                    if (elt.releasePointerCapture) {
                        try {
                            elt.releasePointerCapture(event.pointerId);
                        }
                        catch (exception) {
                            console.error(exception);
                        }
                    }
                    if (tracking && !tracking.tapOnDown) {
                        event.stopPropagation();
                        var resolveTap = function () {
                            if (tracking && tracking.pointerdown) {
                                if (event.changedTouches) {
                                    var dX = Math.abs(tracking.pointerdown.x - event.changedTouches[0].clientX);
                                    var dY = Math.abs(tracking.pointerdown.y - event.changedTouches[0].clientY);
                                }
                                else {
                                    var dX = Math.abs(tracking.pointerdown.x - event.clientX);
                                    var dY = Math.abs(tracking.pointerdown.y - event.clientY);
                                }
                                if (tracking.callback && dX < 15 && dY < 15) {
                                    event.stopImmediatePropagation();
                                    event.stopPropagation();
                                    event.preventDefault();
                                    tracking.invoke();
                                }
                                if (tracking && tracking.pointerdown)
                                    tracking.pointerdown = undefined;
                            }
                        };
                        if (tracking.awaitAnim) {
                            tracking.animUp(elt).done(resolveTap);
                        }
                        else {
                            tracking.animUp(elt);
                            resolveTap();
                        }
                    }
                    WinJS.Utilities.removeClass(elt, 'tapped');
                }
            };
            if (!options) {
                var attroptions = element.getAttribute('tap-options');
                if (attroptions) {
                    try {
                        options = WinJS.UI.optionsParser(attroptions, window);
                    }
                    catch (exception) {
                        return;
                    }
                }
            }
            var opt = options || {};
            if (element.mcnTapTracking) {
                element.mcnTapTracking.dispose();
            }
            WinJS.Utilities.addClass(element, 'tap');
            element.mcnTapTracking = element.mcnTapTracking || {};
            element.mcnTapTracking.disableAria = opt.disableAria || UI.defaultTapBehavior.disableAria;
            if (!element.mcnTapTracking.disableAria) {
                if (!element.hasAttribute("tabindex"))
                    element.setAttribute("tabindex", "0");
                if (!element.hasAttribute("role"))
                    element.setAttribute("role", "button");
            }
            element.mcnTapTracking.eventTracker = new WinJSContrib.UI.EventTracker();
            element.mcnTapTracking.disableAnimation = opt.disableAnimation || UI.defaultTapBehavior.disableAnimation;
            if (element.mcnTapTracking.disableAnimation) {
                if (opt.disableAnimation)
                    WinJS.Utilities.addClass(element, 'tap-disableanimation');
                element.mcnTapTracking.animDown = function () { return WinJS.Promise.wrap(); };
                element.mcnTapTracking.animUp = function () { return WinJS.Promise.wrap(); };
            }
            else {
                element.mcnTapTracking.animDown = opt.animDown || UI.defaultTapBehavior.animDown;
                element.mcnTapTracking.animUp = opt.animUp || UI.defaultTapBehavior.animUp;
            }
            element.mcnTapTracking.element = element;
            element.mcnTapTracking.callback = callback;
            element.mcnTapTracking.lock = opt.lock;
            element.mcnTapTracking.awaitAnim = opt.awaitAnim || UI.defaultTapBehavior.awaitAnim;
            element.mcnTapTracking.errorDelay = opt.errorDelay || UI.defaultTapBehavior.errorDelay;
            element.mcnTapTracking.mapClickEvents = opt.mapClickEvents || UI.defaultTapBehavior.mapClickEvents;
            element.mcnTapTracking.tapOnDown = opt.tapOnDown;
            element.mcnTapTracking.pointerModel = 'none';
            element.mcnTapTracking.invoke = function (arg) {
                var elt = element;
                if (elt && elt.mcnTapTracking) {
                    var tracking = elt.mcnTapTracking;
                    if (tracking) {
                        var now = (new Date());
                        var dif = 9000;
                        if (tracking.lastinvoke) {
                            dif = now - tracking.lastinvoke;
                        }
                        if (dif < tracking.mapClickEvents) {
                            arg.preventDefault();
                            arg.stopPropagation();
                            return;
                        }
                        var res = tracking.callback(elt, arg);
                        tracking.lastinvoke = new Date();
                        if (res && WinJS.Promise.is(res)) {
                            elt.disabled = true;
                            WinJS.Utilities.addClass(elt, 'tap-working');
                            res.then(function () {
                                elt.disabled = false;
                                WinJS.Utilities.removeClass(elt, 'tap-working');
                            }, function (err) {
                                elt.disabled = false;
                                WinJS.Utilities.removeClass(elt, 'tap-working');
                                console.error(err);
                                WinJS.Application.queueEvent({ type: "mcn-taperror", error: err });
                                WinJS.Utilities.addClass(elt, 'tap-error');
                                if (tracking.errorDelay) {
                                    tracking.pendingErrorTimeout = setTimeout(function () {
                                        tracking.pendingErrorTimeout = null;
                                        WinJS.Utilities.removeClass(elt, 'tap-error');
                                    }, tracking.errorDelay);
                                }
                            });
                        }
                    }
                }
            };
            if (element.mcnTapTracking.mapClickEvents > 0) {
                element.onclick = function (arg) {
                    if (element && arg.target == element && element.mcnTapTracking) {
                        element.mcnTapTracking.invoke(arg);
                    }
                };
            }
            element.mcnTapTracking.dispose = function () {
                WinJS.Utilities.removeClass(element, 'tap');
                this.eventTracker.dispose();
                element.mcnTapTracking = null;
                element = null;
            };
            if (element.onpointerdown !== undefined) {
                element.mcnTapTracking.pointerModel = 'pointers';
                element.mcnTapTracking.eventTracker.addEvent(element, 'pointerdown', ptDown);
                element.mcnTapTracking.eventTracker.addEvent(element, 'pointerout', ptOut);
                element.mcnTapTracking.eventTracker.addEvent(element, 'pointerup', ptUp);
            }
            else if (window.Touch && !opt.noWebkitTouch) {
                element.mcnTapTracking.pointerModel = 'touch';
                element.mcnTapTracking.eventTracker.addEvent(element, 'touchstart', function (arg) {
                    element.mcnTapTracking.cancelMouse = true;
                    ptDown(arg);
                });
                element.mcnTapTracking.eventTracker.addEvent(element, 'touchcancel', function (arg) {
                    setTimeout(function () {
                        if (element && element.mcnTapTracking)
                            element.mcnTapTracking.cancelMouse = false;
                    }, 1000);
                    ptOut(arg);
                });
                element.mcnTapTracking.eventTracker.addEvent(element, 'touchend', function (arg) {
                    setTimeout(function () {
                        if (element && element.mcnTapTracking)
                            element.mcnTapTracking.cancelMouse = false;
                    }, 1000);
                    ptUp(arg);
                });
                element.mcnTapTracking.eventTracker.addEvent(element, 'mousedown', function (arg) {
                    if (!element.mcnTapTracking.cancelMouse)
                        ptDown(arg);
                });
                element.mcnTapTracking.eventTracker.addEvent(element, 'mouseleave', function (arg) {
                    ptOut(arg);
                });
                element.mcnTapTracking.eventTracker.addEvent(element, 'mouseup', function (arg) {
                    if (!element.mcnTapTracking.cancelMouse)
                        ptUp(arg);
                    else
                        ptOut(arg);
                });
            }
            else {
                element.mcnTapTracking.pointerModel = 'mouse';
                element.mcnTapTracking.eventTracker.addEvent(element, 'mousedown', ptDown);
                element.mcnTapTracking.eventTracker.addEvent(element, 'mouseleave', ptOut);
                element.mcnTapTracking.eventTracker.addEvent(element, 'mouseup', ptUp);
            }
        }
        UI.tap = tap;
        /**
         * return a promise completed after css transition on the element is ended
         * @function WinJSContrib.UI.afterTransition
         * @param {HtmlElement} element element to watch
         * @param {number} timeout timeout
         */
        function afterTransition(element, timeout) {
            var timeOutRef = null;
            return new WinJS.Promise(function (complete, error) {
                var onaftertransition = function (event) {
                    if (event.srcElement === element) {
                        close();
                    }
                };
                var close = function () {
                    clearTimeout(timeOutRef);
                    element.removeEventListener("transitionend", onaftertransition, false);
                    complete();
                };
                element.addEventListener("transitionend", onaftertransition, false);
                timeOutRef = setTimeout(close, timeout || 1000);
            });
        }
        UI.afterTransition = afterTransition;
        /**
         * Utility class for building DOM elements through code with a fluent API
         * @class WinJSContrib.UI.FluentDOM
         * @param {string} nodeType type of DOM node (ex: 'DIV')
         * @param className css classes
         * @param parentElt parent DOM element
         * @param {WinJSContrib.UI.FluentDOM} parent parent FluentDOM
         * @example
         * var elt = new WinJSContrib.UI.FluentDOM('DIV', 'item-content')
         *    .text(item.title)
         *    .display('none')
         *    .element;
         */
        var FluentDOM = (function () {
            function FluentDOM(nodeType, className, parentElt, parent) {
                this.element = document.createElement(nodeType);
                if (className)
                    this.element.className = className;
                if (parentElt)
                    parentElt.appendChild(this.element);
                this.parent = parent;
                this.childs = [];
                if (parent) {
                    parent.childs.push(this);
                }
            }
            FluentDOM.for = function (element) {
                var res = new FluentDOM(null);
                res.element = element;
                return res;
            };
            FluentDOM.fragment = function () {
                var res = new FluentDOM(null);
                res.element = document.createDocumentFragment();
                return res;
            };
            Object.defineProperty(FluentDOM.prototype, "control", {
                get: function () {
                    return this.element.winControl;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Add a css class
             * @function WinJSContrib.UI.FluentDOM.prototype.addClass
             * @param classname css class
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.addClass = function (classname) {
                if (this.element)
                    this.element.classList.add(classname);
                return this;
            };
            /**
             * set className
             * @function WinJSContrib.UI.FluentDOM.prototype.className
             * @param classname css classes
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.className = function (classname) {
                if (this.element)
                    this.element.className = classname;
                return this;
            };
            /**
             * set opacity
             * @function WinJSContrib.UI.FluentDOM.prototype.opacity
             * @param opacity opacity
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.opacity = function (opacity) {
                if (this.element)
                    this.element.style.opacity = opacity;
                return this;
            };
            /**
             * set display
             * @function WinJSContrib.UI.FluentDOM.prototype.display
             * @param display display
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.display = function (display) {
                if (this.element)
                    this.element.style.display = display;
                return this;
            };
            /**
             * set display 'none'
             * @function WinJSContrib.UI.FluentDOM.prototype.hide
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.hide = function () {
                if (this.element)
                    this.element.style.display = 'none';
                return this;
            };
            /**
             * set visibility
             * @function WinJSContrib.UI.FluentDOM.prototype.visibility
             * @param visibility visibility
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.visibility = function (visibility) {
                if (this.element)
                    this.element.style.visibility = visibility;
                return this;
            };
            /**
             * set textContent
             * @function WinJSContrib.UI.FluentDOM.prototype.text
             * @param text text
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.text = function (text) {
                if (this.element)
                    this.element.textContent = text;
                return this;
            };
            /**
             * set innerHTML
             * @function WinJSContrib.UI.FluentDOM.prototype.html
             * @param text text
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.html = function (text) {
                if (this.element)
                    this.element.innerHTML = text;
                return this;
            };
            /**
             * set attribute
             * @function WinJSContrib.UI.FluentDOM.prototype.attr
             * @param name attribute name
             * @param val attribute value
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.attr = function (name, val) {
                if (this.element)
                    this.element.setAttribute(name, val);
                return this;
            };
            /**
             * set style property
             * @function WinJSContrib.UI.FluentDOM.prototype.style
             * @param name attribute name
             * @param val attribute value
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.style = function (name, val) {
                if (this.element)
                    this.element.style[name] = val;
                return this;
            };
            /**
             * set style property
             * @function WinJSContrib.UI.FluentDOM.prototype.style
             * @param name attribute name
             * @param val attribute value
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.styles = function (obj) {
                var st = this.element.style;
                var keys = Object.keys(obj);
                keys.forEach(function (k) {
                    st[k] = obj[k];
                });
                return this;
            };
            /**
             * append element to another DOM element
             * @function WinJSContrib.UI.FluentDOM.prototype.appendTo
             * @param elt parent element
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.appendTo = function (elt) {
                if (this.element && elt)
                    elt.appendChild(this.element);
                return this;
            };
            /**
             * add tap behavior
             * @function WinJSContrib.UI.FluentDOM.prototype.tap
             * @param callback tap callback
             * @param options tap options
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.tap = function (callback, options) {
                if (this.element)
                    WinJSContrib.UI.tap(this.element, callback, options);
                return this;
            };
            /**
             * create a child FluentDOM and append it to current
             * @function WinJSContrib.UI.FluentDOM.prototype.append
             * @param nodeType child node type
             * @param className css classes
             * @param callback callback receiving the new FluentDOM as an argument
             * @returns {WinJSContrib.UI.FluentDOM} current instance (for method chaining)
             */
            FluentDOM.prototype.append = function (nodeType, className, callback) {
                var child = new FluentDOM(nodeType, className, this.element, this);
                if (callback) {
                    callback(child);
                }
                return this;
            };
            /**
             * create a child FluentDOM and append it to current
             * @function WinJSContrib.UI.FluentDOM.prototype.createChild
             * @param nodeType child node type
             * @param className css classes
             * @returns {WinJSContrib.UI.FluentDOM} child FluentDOM
             */
            FluentDOM.prototype.createChild = function (nodeType, className) {
                var child = new FluentDOM(nodeType, className, this.element, this);
                return child;
            };
            /**
             * create a WinJS control
             * @function WinJSContrib.UI.FluentDOM.prototype.ctrl
             * @param ctrl constructor or full name of the control
             * @param options control options
             * @returns {WinJSContrib.UI.FluentDOM}
             */
            FluentDOM.prototype.ctrl = function (ctrl, options) {
                var ctor = ctrl;
                if (typeof ctrl === 'string')
                    ctor = WinJSContrib.Utils.readProperty(window, ctrl);
                if (ctor) {
                    new ctor(this.element, options);
                }
                return this;
            };
            return FluentDOM;
        })();
        UI.FluentDOM = FluentDOM;
        function dismissableShow(targetElement, classPrefix, animationTarget) {
            animationTarget = animationTarget || targetElement;
            targetElement.classList.add(classPrefix + "-enter");
            targetElement.getBoundingClientRect();
            targetElement.classList.remove(classPrefix + "-leave");
            targetElement.classList.remove(classPrefix + "-leave-active");
            //setImmediate(() => {
            WinJSContrib.UI.afterTransition(animationTarget).then(function () {
                //if (targetElement.classList.contains(classPrefix + "-lea")) {
                //    targetElement.classList.remove(classPrefix + "-enter");
                //    targetElement.classList.remove(classPrefix + "-enter-active");
                //}
            });
            targetElement.classList.add(classPrefix + "-enter-active");
            //});
        }
        UI.dismissableShow = dismissableShow;
        function dismissableHide(targetElement, classPrefix, animationTarget) {
            animationTarget = animationTarget || targetElement;
            targetElement.classList.add(classPrefix + "-leave");
            targetElement.classList.remove(classPrefix + "-enter");
            targetElement.classList.remove(classPrefix + "-enter-active");
            setImmediate(function () {
                WinJSContrib.UI.afterTransition(animationTarget).then(function () {
                    targetElement.classList.remove(classPrefix + "-leave");
                    targetElement.classList.remove(classPrefix + "-leave-active");
                });
                targetElement.classList.add(classPrefix + "-leave-active");
            });
        }
        UI.dismissableHide = dismissableHide;
        function forwardFocus(container, focusTarget, allowed) {
            var isInContainer = function (elt) {
                while (elt.parentElement && elt.parentElement != container) {
                    elt = elt.parentElement;
                }
                if (elt.parentElement == container)
                    return true;
                return false;
            };
            var focusManager = function (arg) {
                if (!isInContainer(arg.target) && (!allowed || !(allowed.indexOf(arg.target) >= 0))) {
                    focusTarget.focus();
                }
            };
            document.addEventListener("focus", focusManager, true);
            return function () {
                document.removeEventListener("focus", focusManager);
            };
        }
        UI.forwardFocus = forwardFocus;
    })(UI = WinJSContrib.UI || (WinJSContrib.UI = {}));
})(WinJSContrib || (WinJSContrib = {}));

var __global = this;
var profiler = __global.msWriteProfilerMark || function () { };
var WinJSContrib;
(function (WinJSContrib) {
    var UI;
    (function (UI) {
        var Pages;
        (function (Pages) {
            function abs(uri) {
                var a = window.document.createElement("a");
                a.href = uri;
                return a.href;
            }
            var logger = WinJSContrib.Logs.getLogger("WinJSContrib.UI.Pages");
            Pages.verboseTraces = false;
            Pages.preloadDelay = 500;
            var loadedPages = {};
            function preload() {
                var pathes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    pathes[_i - 0] = arguments[_i];
                }
                return WinJSContrib.Promise.waterfall(pathes, function (path) {
                    return preloadPath(path);
                });
            }
            Pages.preload = preload;
            function preloadPath(path) {
                var absuri = abs(path);
                if (!loadedPages[absuri]) {
                    logger.verbose("preload " + absuri);
                    loadedPages[absuri] = true;
                    return WinJS.Promise.timeout(Pages.preloadDelay).then(function () {
                        return WinJS.Utilities.Scheduler.schedule(function () {
                            var wrapper = document.createDocumentFragment();
                            var elt = document.createElement("DIV");
                            wrapper.appendChild(elt);
                            WinJS.UI.Fragments.render(absuri, elt);
                        }, WinJS.Utilities.Scheduler.Priority.idle, {}, "preload|" + absuri);
                    });
                }
                return WinJS.Promise.wrap();
            }
            Pages.preloadPath = preloadPath;
            /**
             * List of mixins to apply to each fragment managed by WinJS Contrib (through navigator or by calling explicitely {@link WinJSContrib.UI.Pages.fragmentMixin}).
             * @field WinJSContrib.UI.Pages.defaultFragmentMixins
             * @type {Array}
             */
            Pages.defaultFragmentMixins = [{
                    $: function (selector) {
                        return $(selector, this.element || this._element);
                    },
                    q: function (selector) {
                        if (!this.element)
                            return;
                        return this.element.querySelector(selector);
                    },
                    qAll: function (selector) {
                        if (!this.element)
                            return;
                        var res = this.element.querySelectorAll(selector);
                        if (res && !res.forEach) {
                            res = [].slice.call(res);
                        }
                        return res;
                    },
                },
                {
                    initPageMixin: function () {
                        this.promises = [];
                    },
                    disposePageMixin: function () {
                        if (this.promises) {
                            this.cancelPromises();
                            this.promises = null;
                        }
                    },
                    addPromise: function (prom) {
                        this.promises.push(prom);
                        return prom;
                    },
                    cancelPromises: function () {
                        var page = this;
                        if (page.promises) {
                            for (var i = 0; i < page.promises.length; i++) {
                                if (page.promises[i]) {
                                    page.promises[i].cancel();
                                }
                            }
                            page.promises = [];
                        }
                    }
                },
                {
                    initPageMixin: function () {
                        this.eventTracker = new WinJSContrib.UI.EventTracker();
                    },
                    disposePageMixin: function () {
                        if (this.eventTracker) {
                            this.eventTracker.dispose();
                            this.eventTracker = null;
                        }
                    },
                }];
            function broadcast(ctrl, element, eventName, args, before, after) {
                var promises = [];
                if (before)
                    promises.push(WinJS.Promise.as(before.apply(ctrl, args)));
                var query = element.querySelectorAll(".mcn-layout-ctrl");
                if (query && query.length) {
                    var index = 0;
                    var length = query.length;
                    while (index < length) {
                        var childctrl = query[index];
                        if (childctrl) {
                            var event = childctrl.winControl[eventName];
                            if (event) {
                                if (childctrl.winControl.pageLifeCycle) {
                                    promises.push(childctrl.winControl.pageLifeCycle.steps.layout.promise);
                                }
                                else {
                                    promises.push(WinJS.Promise.as(event.apply(childctrl.winControl, args)));
                                }
                            }
                        }
                        // Skip descendants
                        if (childctrl && childctrl.winControl && childctrl.winControl.pageLifeCycle) {
                            index += childctrl.querySelectorAll(".mcn-fragment, .mcn-layout-ctrl").length + 1;
                            childctrl.winControl.__checkLayout();
                        }
                        else {
                            index += 1;
                        }
                    }
                    //if (after)
                    //    promises.push(WinJS.Promise.as(after.apply(ctrl, args)));
                    return WinJS.Promise.join(promises).then(function () {
                        if (after)
                            return WinJS.Promise.as(after.apply(ctrl, args));
                    });
                }
                else {
                    if (after)
                        return WinJS.Promise.as(after.apply(ctrl, args));
                    return WinJS.Promise.wrap();
                }
            }
            /**
             * render a html fragment with winjs contrib pipeline and properties, and add WinJS Contrib page events.
             * @function WinJSContrib.UI.Pages.renderFragment
             * @param {HTMLElement} container element that will contain the fragment
             * @param {string} location url for the fragment
             * @param {Object} args arguments to the fragment
             * @param {Object} options rendering options
             */
            function renderFragment(container, location, args, options) {
                var fragmentCompleted;
                var fragmentError;
                options = options || {};
                var element = document.createElement("div");
                element.setAttribute("dir", __global.getComputedStyle(element, null).direction);
                element.style.opacity = '0';
                container.appendChild(element);
                var fragmentPromise = new WinJS.Promise(function (c, e) { fragmentCompleted = c; fragmentError = e; });
                var parented = options.parented ? WinJS.Promise.as(options.parented) : null;
                var layoutCtrls = [];
                var pageConstructor = WinJS.UI.Pages.get(location);
                function preparePageControl(elementCtrl) {
                    if (options.getFragmentElement) {
                        options.getFragmentElement(elementCtrl);
                    }
                    if (args && args.injectToPage) {
                        WinJSContrib.Utils.inject(elementCtrl, args.injectToPage);
                    }
                    elementCtrl.navigationState = { location: location, state: args };
                    if (options.oncreate) {
                        options.oncreate(elementCtrl.element, args);
                    }
                    if (options.oninit) {
                        elementCtrl.pageLifeCycle.steps.init.attach(function () {
                            return options.oninit(elementCtrl.element, args);
                        });
                    }
                    if (elementCtrl.enterPageAnimation || options.enterPage) {
                        if (elementCtrl.enterPageAnimation)
                            elementCtrl._enterAnimation = elementCtrl.enterPageAnimation;
                        else
                            elementCtrl._enterAnimation = options.enterPage;
                        elementCtrl.enterPageAnimation = function () {
                            var page = this;
                            var elts = null;
                            element.style.opacity = '';
                            if (page && page.getAnimationElements) {
                                elts = page.getAnimationElements(false);
                            }
                            else {
                                elts = page.element;
                            }
                            if (elts)
                                return page._enterAnimation(elts);
                        };
                    }
                    if (options.onrender) {
                        elementCtrl.pageLifeCycle.steps.process.attach(function () {
                            options.onrender(elementCtrl.element, args);
                        });
                    }
                    if (!WinJSContrib.UI.disableAutoResources) {
                        elementCtrl.pageLifeCycle.steps.process.attach(function () {
                            return WinJS.Resources.processAll(element);
                        });
                    }
                    if (options.closeOldPagePromise) {
                        elementCtrl.pageLifeCycle.steps.ready.attach(function () {
                            return options.closeOldPagePromise;
                        });
                    }
                    if (options.onready) {
                        elementCtrl.pageLifeCycle.steps.ready.attach(function () {
                            if (options.onready)
                                options.onready(elementCtrl.element, args);
                        });
                    }
                    elementCtrl.pageLifeCycle.steps.enter.attach(function () {
                        if (elementCtrl.enterPageAnimation) {
                            return WinJS.Promise.as(elementCtrl.enterPageAnimation(element, options));
                        }
                        else {
                            elementCtrl.element.style.opacity = '';
                        }
                    });
                    elementCtrl.pageLifeCycle.steps.ready.promise.then(fragmentCompleted, fragmentError);
                }
                var elementCtrl = new pageConstructor(element, args, preparePageControl, parented);
                return fragmentPromise;
            }
            Pages.renderFragment = renderFragment;
            var DefferedLoadings = (function () {
                function DefferedLoadings(page) {
                    var _this = this;
                    this.items = [];
                    this.page = page;
                    this.resolved = false;
                    page.promises.push(page.pageLifeCycle.steps.ready.promise.then(function () {
                        return _this.resolve();
                    }));
                }
                DefferedLoadings.prototype.push = function (delegate) {
                    var _this = this;
                    if (!this.resolved) {
                        this.items.push(delegate);
                    }
                    else {
                        setImmediate(function () {
                            _this.page.promises.push(WinJS.Promise.as(delegate()));
                        });
                    }
                };
                DefferedLoadings.prototype.resolve = function () {
                    this.resolved = true;
                    if (!this.items.length) {
                        return WinJS.Promise.wrap();
                    }
                    logger.verbose("resolve deffered loads");
                    return WinJSContrib.Promise.waterfall(this.items, function (job) {
                        return WinJS.Promise.as(job()).then(function () {
                            return WinJS.Promise.timeout();
                        });
                    });
                };
                return DefferedLoadings;
            })();
            Pages.DefferedLoadings = DefferedLoadings;
            var PageBase = (function () {
                function PageBase() {
                }
                return PageBase;
            })();
            Pages.PageBase = PageBase;
            var PageLifeCycleStep = (function () {
                function PageLifeCycleStep(page, stepName, parent) {
                    var _this = this;
                    this.page = page;
                    this.queue = [];
                    this.isDone = false;
                    this.stepName = stepName;
                    if (Pages.verboseTraces) {
                        this.created = new Date();
                    }
                    this.promise = new WinJS.Promise(function (c, e) {
                        _this._resolvePromise = c;
                        _this._rejectPromise = e;
                    });
                    page.promises.push(this.promise);
                    //if their is a parent page fragment, we attach step to synchronize page construction
                    if (parent && parent.pageLifeCycle) {
                        parent.pageLifeCycle.steps[stepName].attach(function () {
                            return _this.promise;
                        });
                    }
                }
                PageLifeCycleStep.prototype.attach = function (callback) {
                    if (this.queue && !this.isDone) {
                        this.queue.push(callback);
                        return this.promise;
                    }
                    else {
                        return WinJS.Promise.as(callback());
                    }
                };
                PageLifeCycleStep.prototype.resolve = function (arg) {
                    var step = this;
                    this.isDone = true;
                    function closeStep() {
                        step.resolved = new Date();
                        step._resolvePromise(arg);
                        if (Pages.verboseTraces) {
                            step.resolved = new Date();
                            logger.verbose((step.resolved - step.created) + 'ms ' + step.stepName.toUpperCase() + ' ' + step.page.pageLifeCycle.profilerMarkIdentifier);
                            profiler("WinJS.UI.Pages:" + step.stepName.toUpperCase() + step.page.pageLifeCycle.profilerMarkIdentifier + ",StartTM");
                        }
                        return step.promise;
                    }
                    if (this.queue && this.queue.length) {
                        var promises = [];
                        this.queue.forEach(function (q) {
                            promises.push(new WinJS.Promise(function (c, e) {
                                try {
                                    WinJS.Promise.as(q()).then(function (res) {
                                        c(res);
                                    }, e);
                                }
                                catch (exception) {
                                    e(exception);
                                }
                            }));
                        });
                        this.queue = null;
                        return WinJS.Promise.join(promises).then(function () {
                            return closeStep();
                        }, this.reject.bind(this));
                    }
                    else {
                        this.queue = null;
                        return closeStep();
                    }
                };
                PageLifeCycleStep.prototype.reject = function (arg) {
                    this.isDone = true;
                    this.queue = null;
                    this._rejectPromise(arg);
                    return WinJS.Promise.wrapError(this.promise);
                };
                return PageLifeCycleStep;
            })();
            Pages.PageLifeCycleStep = PageLifeCycleStep;
            (function (_Pages, _Global, _Base, _CorePages, _BaseUtils, _ElementUtilities, _WriteProfilerMark, Promise, Fragments, ControlProcessor) {
                'use strict';
                if (!_Global.document || !_CorePages)
                    return;
                var viewMap = _CorePages._viewMap || _CorePages.viewMap || {};
                //this property allows defining mixins applyed to all pages
                function abs(uri) {
                    var a = _Global.document.createElement("a");
                    a.href = uri;
                    return a.href;
                }
                function selfhost(uri) {
                    return _Global.document.location.href.toLowerCase() === uri.toLowerCase();
                }
                var _mixinBase = {
                    dispose: function () {
                        /// <signature helpKeyword="WinJS.UI.Pages.dispose">
                        /// <summary locid="WinJS.UI.Pages.dispose">
                        /// Disposes this Page.
                        /// </summary>
                        /// </signature>
                        if (this._disposed) {
                            return;
                        }
                        if (this.disposePageMixin) {
                            this.disposePageMixin();
                        }
                        this.pageLifeCycle.stop();
                        this.pageLifeCycle = null;
                        this._disposed = true;
                        this.readyComplete.cancel();
                        _ElementUtilities.disposeSubTree(this.element);
                        this.element = null;
                    },
                    init: function () {
                    },
                    load: function (uri) {
                        /// <signature helpKeyword="WinJS.UI.Pages._mixin.load">
                        /// <summary locid="WinJS.UI.Pages._mixin.load">
                        /// Creates a copy of the DOM elements from the specified URI.  In order for this override
                        /// to be used, the page that contains the load override needs to be defined by calling
                        /// WinJS.UI.Pages.define() before WinJS.UI.Pages.render() is called.
                        /// </summary>
                        /// <param name="uri" locid="WinJS.UI.Pages._mixin.load_p:uri">
                        /// The URI from which to copy the DOM elements.
                        /// </param>
                        /// <returns type="WinJS.Promise" locid="WinJS.UI.Pages._mixin.load_returnValue">
                        /// A promise whose fulfilled value is the set of unparented DOM elements, if asynchronous processing is necessary. If not, returns nothing.
                        /// </returns>
                        /// </signature>
                        if (!this.selfhost) {
                            return Fragments.renderCopy(abs(uri));
                        }
                    },
                    process: function (element, options) {
                        /// <signature helpKeyword="WinJS.UI.Pages._mixin.process">
                        /// <summary locid="WinJS.UI.Pages._mixin.process">
                        /// Processes the unparented DOM elements returned by load.
                        /// </summary>
                        /// <param name="element" locid="WinJS.UI.Pages._mixin.process_p:element">
                        /// The DOM element that will contain all the content for the page.
                        /// </param>
                        /// <param name="options" locid="WinJS.UI.Pages._mixin.process_p:options">
                        /// The options that are to be passed to the constructor of the page.
                        /// </param>
                        /// <returns type="WinJS.Promise" locid="WinJS.UI.Pages._mixin.process_returnValue">
                        /// A promise that is fulfilled when processing is complete.
                        /// </returns>
                        /// </signature>
                        return ControlProcessor.processAll(element);
                    },
                    processed: function (element, options) { },
                    render: function (element, options, loadResult) {
                        /// <signature helpKeyword="WinJS.UI.Pages._mixin.render">
                        /// <summary locid="WinJS.UI.Pages._mixin.render">
                        /// Renders the control, typically by adding the elements specified in the loadResult parameter to the specified element.
                        /// </summary>
                        /// <param name="element" locid="WinJS.UI.Pages._mixin.render_p:element">
                        /// The DOM element that will contain all the content for the page.
                        /// </param>
                        /// <param name="options" locid="WinJS.UI.Pages._mixin.render_p:options">
                        /// The options passed into the constructor of the page.
                        /// </param>
                        /// <param name="loadResult" locid="WinJS.UI.Pages._mixin.render_p:loadResult">
                        /// The elements returned from the load method.
                        /// </param>
                        /// <returns type="WinJS.Promise" locid="WinJS.UI.Pages._mixin.render_returnValue">
                        /// A promise that is fulfilled when rendering is complete, if asynchronous processing is necessary. If not, returns nothing.
                        /// </returns>
                        /// </signature>
                        if (!this.selfhost) {
                            element.appendChild(loadResult);
                        }
                        return element;
                    },
                    rendered: function (element, options) { },
                    ready: function () { }
                };
                function injectMixin(base, mixin) {
                    var d = base.prototype.dispose;
                    var dM = base.prototype.disposePageMixin;
                    var iM = base.prototype.initPageMixin;
                    base = _Base.Class.mix(base, mixin);
                    //we want to allow this mixins to provide their own addition to "dispose" and initialize custom properties
                    if (d && mixin.hasOwnProperty('dispose')) {
                        base.prototype.dispose = function () {
                            mixin.dispose.apply(this);
                            if (d)
                                d.apply(this);
                        };
                    }
                    if (d && mixin.hasOwnProperty('disposePageMixin')) {
                        base.prototype.disposePageMixin = function () {
                            mixin.disposePageMixin.apply(this);
                            if (dM)
                                dM.apply(this);
                        };
                    }
                    if (d && mixin.hasOwnProperty('initPageMixin')) {
                        base.prototype.initPageMixin = function () {
                            mixin.initPageMixin.apply(this);
                            if (iM)
                                iM.apply(this);
                        };
                    }
                    return base;
                }
                function mergeJavaScriptClass(baseCtor, classDef) {
                    var keys = Object.keys(baseCtor.prototype);
                    keys.forEach(function (k) {
                        if (classDef.prototype[k] === undefined) {
                            classDef.prototype[k] = baseCtor.prototype[k];
                        }
                    });
                    return baseCtor;
                }
                function addMembers(ctor, members) {
                    if (!members)
                        return ctor;
                    if (typeof members == 'function') {
                        ctor.prototype._attachedConstructor = members;
                        return mergeJavaScriptClass(ctor, members);
                    }
                    else if (typeof members == 'object') {
                        return injectMixin(ctor, members);
                    }
                    return ctor;
                }
                function pageLifeCycle(that, uri, element, options, complete, parentedPromise) {
                    if (element.style.display)
                        that.pageLifeCycle.initialDisplay = element.style.display;
                    element.style.display = 'none';
                    var profilerMarkIdentifier = " uri='" + uri + "'" + _BaseUtils._getProfilerMarkIdentifier(that.element);
                    that.pageLifeCycle.profilerMarkIdentifier = profilerMarkIdentifier;
                    _WriteProfilerMark("WinJS.UI.Pages:createPage" + profilerMarkIdentifier + ",StartTM");
                    if (WinJSContrib.UI.WebComponents) {
                        that.pageLifeCycle.observer = WinJSContrib.UI.WebComponents.watch(that.element);
                    }
                    var load = Promise.timeout().then(function Pages_load() {
                        that.pageLifeCycle.log(function () { return "URI loading " + that.pageLifeCycle.profilerMarkIdentifier; });
                        return that.load(uri);
                    }).then(function (loadResult) {
                        that.pageLifeCycle.log(function () { return "URI loaded " + that.pageLifeCycle.profilerMarkIdentifier; });
                        //if page is defined by Js classes, call class constructors 
                        if (that._attachedConstructor) {
                            var realControl = new that._attachedConstructor(element, options);
                            element.winControl = realControl;
                            var keys = Object.keys(that);
                            keys.forEach(function (k) {
                                realControl[k] = that[k];
                            });
                            realControl.pageLifeCycle.page = realControl;
                            that.pageControl = realControl;
                            that.dismissed = true;
                            that = realControl;
                        }
                        return loadResult;
                    });
                    var renderCalled = load.then(function Pages_init(loadResult) {
                        return Promise.join({
                            loadResult: loadResult,
                            initResult: that.init(element, options)
                        });
                    }).then(function Pages_render(result) {
                        return that.pageLifeCycle.steps.init.resolve().then(function () {
                            return result;
                        });
                    }).then(function Pages_render(result) {
                        return that.render(element, options, result.loadResult);
                    }).then(function Pages_render(result) {
                        return that.rendered(element, options);
                    }).then(function (result) {
                        return that.pageLifeCycle.steps.render.resolve();
                    }).then(function Pages_processed() {
                        if (WinJSContrib.UI.WebComponents) {
                            //add delay to enable webcomponent processing
                            return WinJS.Promise.timeout();
                        }
                    });
                    that.elementReady = renderCalled.then(function () {
                        return element;
                    });
                    that.renderComplete = renderCalled.then(function Pages_process() {
                        return that.process(element, options);
                    }).then(function (result) {
                        return that.pageLifeCycle.steps.process.resolve();
                    }).then(function Pages_processed() {
                        WinJSContrib.UI.bindMembers(element, that);
                        return that.processed(element, options);
                    }).then(function () {
                        return that;
                    });
                    var callComplete = function () {
                        complete && complete(that);
                        _WriteProfilerMark("WinJS.UI.Pages:createPage" + profilerMarkIdentifier + ",StopTM");
                    };
                    // promises guarantee order, so this will be called prior to ready path below
                    //
                    that.renderComplete.then(callComplete, callComplete);
                    that.layoutComplete = that.renderComplete.then(function () {
                        return parentedPromise;
                    }).then(function () {
                        element.style.display = that.pageLifeCycle.initialDisplay || '';
                        var r = element.getBoundingClientRect(); //force element layout
                        return broadcast(that, element, 'pageLayout', [element, options], null, that.pageLayout);
                    }).then(function () {
                        WinJSContrib.UI.bindActions(element, that);
                    }).then(function (result) {
                        return that.pageLifeCycle.steps.layout.resolve();
                    }).then(function () {
                        return that;
                    });
                    that.readyComplete = that.layoutComplete.then(function Pages_ready() {
                        that.ready(element, options);
                        that.pageLifeCycle.ended = new Date();
                        that.pageLifeCycle.delta = that.pageLifeCycle.ended - that.pageLifeCycle.created;
                        //broadcast(that, element, 'pageReady', [element, options]);
                    }).then(function (result) {
                        return that.pageLifeCycle.steps.ready.resolve();
                    }).then(function (result) {
                        return that.pageLifeCycle.steps.enter.resolve();
                    }).then(function () {
                        return that;
                    }).then(null, function Pages_error(err) {
                        if (that.error)
                            return that.error(err);
                        if (err && err._value && err._value.name === "Canceled")
                            return;
                        return WinJS.Promise.wrapError(err);
                    });
                    that.__checkLayout = function () {
                        var page = this;
                        var updateLayoutArgs = arguments;
                        var p = null;
                        if (page.updateLayout) {
                            p = WinJS.Promise.as(page.updateLayout.apply(page, updateLayoutArgs));
                        }
                        else {
                            p = WinJS.Promise.wrap();
                        }
                        return p.then(function () {
                            return broadcast(page, page.element, 'updateLayout', updateLayoutArgs);
                        });
                    };
                }
                function getPageConstructor(uri, members) {
                    /// <signature helpKeyword="WinJS.UI.Pages.define">
                    /// <summary locid="WinJS.UI.Pages.define">
                    /// Creates a new page control from the specified URI that contains the specified members.
                    /// Multiple calls to this method for the same URI are allowed, and all members will be
                    /// merged.
                    /// </summary>
                    /// <param name="uri" locid="WinJS.UI.Pages.define_p:uri">
                    /// The URI for the content that defines the page.
                    /// </param>
                    /// <param name="members" locid="WinJS.UI.Pages.define_p:members">
                    /// Additional members that the control will have.
                    /// </param>
                    /// <returns type="Function" locid="WinJS.UI.Pages.define_returnValue">
                    /// A constructor function that creates the page.
                    /// </returns>
                    /// </signature>
                    var refUri = abs(uri).toLowerCase();
                    var base = viewMap[refUri];
                    uri = abs(uri);
                    if (!base) {
                        base = _Base.Class.define(
                        // This needs to follow the WinJS.UI.processAll "async constructor"
                        // pattern to interop nicely in the "Views.Control" use case.
                        //
                        // This needs to follow the WinJS.UI.processAll "async constructor"
                        // pattern to interop nicely in the "Views.Control" use case.
                        //
                        function PageControl_ctor(element, options, complete, parentedPromise) {
                            var that = this;
                            if (that._attachedConstructor) {
                                var realControl = new this._attachedConstructor(element, options);
                                element.winControl = realControl;
                                var keys = Object.keys(that);
                                keys.forEach(function (k) {
                                    if (k !== "_attachedConstructor") {
                                        realControl[k] = that[k];
                                    }
                                });
                                that = realControl;
                            }
                            var parent = WinJSContrib.Utils.getScopeControl(element);
                            _ElementUtilities.addClass(element, "win-disposable");
                            _ElementUtilities.addClass(element, "pagecontrol");
                            _ElementUtilities.addClass(element, "mcn-layout-ctrl");
                            if (that.initPageMixin)
                                that.initPageMixin();
                            //that._eventTracker = new WinJSContrib.UI.EventTracker();
                            //that._promises = [];
                            that.pageLifeCycle = {
                                created: new Date(),
                                location: uri,
                                log: function (callback) {
                                    if (Pages.verboseTraces) {
                                        var delta = new Date() - this.created;
                                        logger.verbose(delta + "ms " + callback());
                                    }
                                },
                                stop: function () {
                                    that.readyComplete.cancel();
                                    that.cancelPromises();
                                    if (this.observer) {
                                        this.observer.disconnect();
                                        this.observer = null;
                                    }
                                },
                                steps: {
                                    init: new PageLifeCycleStep(that, 'init', null),
                                    render: new PageLifeCycleStep(that, 'render', null),
                                    process: new PageLifeCycleStep(that, 'process', parent),
                                    layout: new PageLifeCycleStep(that, 'layout', parent),
                                    ready: new PageLifeCycleStep(that, 'ready', parent),
                                    enter: new PageLifeCycleStep(that, 'enter', parent),
                                },
                                initialDisplay: null
                            };
                            that.defferedLoading = new DefferedLoadings(that);
                            that._disposed = false;
                            that.element = element = element || _Global.document.createElement("div");
                            element.msSourceLocation = uri;
                            that.uri = uri;
                            that.selfhost = selfhost(uri);
                            element.winControl = that;
                            that.parentedComplete = parentedPromise;
                            pageLifeCycle(that, uri, element, options, complete, parentedPromise);
                            return that;
                        }, _mixinBase);
                        base = _Base.Class.mix(base, WinJS.UI.DOMEventMixin);
                        //inject default behaviors to page constructor
                        WinJSContrib.UI.Pages.defaultFragmentMixins.forEach(function (mixin) {
                            injectMixin(base, mixin);
                        });
                        //WinJSContrib.UI.Pages.fragmentMixin(base);
                        viewMap[refUri] = base;
                    }
                    base = addMembers(base, members);
                    base.selfhost = selfhost(uri);
                    return base;
                }
                function Pages_define(uri, members) {
                    /// <signature helpKeyword="WinJS.UI.Pages.define">
                    /// <summary locid="WinJS.UI.Pages.define">
                    /// Creates a new page control from the specified URI that contains the specified members.
                    /// Multiple calls to this method for the same URI are allowed, and all members will be
                    /// merged.
                    /// </summary>
                    /// <param name="uri" locid="WinJS.UI.Pages.define_p:uri">
                    /// The URI for the content that defines the page.
                    /// </param>
                    /// <param name="members" locid="WinJS.UI.Pages.define_p:members">
                    /// Additional members that the control will have.
                    /// </param>
                    /// <returns type="Function" locid="WinJS.UI.Pages.define_returnValue">
                    /// A constructor function that creates the page.
                    /// </returns>
                    /// </signature>
                    var ctor = viewMap[uri];
                    if (!ctor) {
                        ctor = getPageConstructor(uri);
                    }
                    if (members) {
                        ctor = addMembers(ctor, members);
                    }
                    if (ctor.selfhost) {
                        WinJS.Utilities.ready(function () {
                            render(abs(uri), _Global.document.body);
                        }, true);
                    }
                    //in case we are on WinJS<4 we reference members on WinJS Core Pages
                    if (!_CorePages.viewMap && !_CorePages._viewMap && typeof members !== 'function')
                        _Pages._corePages.define(uri, members);
                    return ctor;
                }
                function render(uri, element, options, parentedPromise) {
                    var Ctor = _CorePages.get(uri);
                    loadedPages[abs(uri)] = true;
                    var control = new Ctor(element, options, null, parentedPromise);
                    return control.renderComplete.then(null, function (err) {
                        return Promise.wrapError({
                            error: err,
                            page: control
                        });
                    });
                }
                function get(uri) {
                    var ctor = viewMap[uri];
                    if (!ctor) {
                        ctor = Pages_define(uri);
                    }
                    return ctor;
                }
                function remove(uri) {
                    Fragments.clearCache(abs(uri));
                    delete viewMap[uri.toLowerCase()];
                }
                _Pages._corePages = {
                    get: _CorePages.get,
                    render: _CorePages.render,
                    define: _CorePages.define,
                    _remove: _CorePages._remove,
                    _viewMap: viewMap,
                };
                var pageOverride = {
                    define: Pages_define,
                    get: get,
                    render: render,
                    _remove: remove,
                    _viewMap: viewMap
                };
                var source = WinJS.UI.Pages;
                WinJS.Namespace._moduleDefine(_Pages, null, pageOverride);
                source.get = pageOverride.get;
                source.define = pageOverride.define;
                source.render = pageOverride.render;
                source._remove = pageOverride._remove;
                //replaces HtmlControl, otherwise it does not use proper Page constructor
                WinJS.UI.HtmlControl = WinJS.Class.define(function HtmlControl_ctor(element, options, complete) {
                    /// <signature helpKeyword="WinJS.UI.HtmlControl.HtmlControl">
                    /// <summary locid="WinJS.UI.HtmlControl.constructor">
                    /// Initializes a new instance of HtmlControl to define a new page control.
                    /// </summary>
                    /// <param name="element" locid="WinJS.UI.HtmlControl.constructor_p:element">
                    /// The element that hosts the HtmlControl.
                    /// </param>
                    /// <param name="options" locid="WinJS.UI.HtmlControl.constructor_p:options">
                    /// The options for configuring the page. The uri option is required in order to specify the source
                    /// document for the content of the page.
                    /// </param>
                    /// </signature>
                    WinJS.UI.Pages.render(options.uri, element, options).
                        then(complete, function () { complete(); });
                });
            })(WinJSContrib.UI.Pages, __global, WinJS, WinJS.UI.Pages, WinJS.Utilities, WinJS.Utilities, profiler, WinJS.Promise, WinJS.UI.Fragments, WinJS.UI);
        })(Pages = UI.Pages || (UI.Pages = {}));
    })(UI = WinJSContrib.UI || (WinJSContrib.UI = {}));
})(WinJSContrib || (WinJSContrib = {}));

//# sourceMappingURL=winjscontrib.core.js.map
/* 
 * WinJS Contrib v2.1.0.4
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/*
WARNING: this feature is experimental
You must add winjscontrib.core.js before this file
*/

/// <reference path="winjscontrib.core.js" />
var WinJSContrib = WinJSContrib || {};
WinJSContrib.UI = WinJSContrib.UI || {};

/**
 * @namespace
 */
WinJSContrib.UI.WebComponents = WinJSContrib.UI.WebComponents || {};

(function (global) {
	'use strict';
	var registered = {};
	WinJSContrib.UI.WebComponents.registered = registered;
	WinJSContrib.UI.WebComponents.polyfill = false;

	if (!global.document.registerElement && global.MutationObserver) {
		WinJSContrib.UI.WebComponents.polyfill = true;
	}

	function inspect(node) {
		var customElement = null;
		var ctrlName = node.nodeName;
		var promises = [];

		if (node.nodeName !== '#text') {
			if (node.attributes) {
				var ctrlName = node.getAttribute("is");
				if (ctrlName) {
					//we uppercase because node names are uppercase
					customElement = registered[ctrlName.toUpperCase()];
				}
			}

			if (!customElement && node.nodeName !== 'DIV' && node.nodeName !== 'SPAN') {
				customElement = registered[node.nodeName];
			}

			if (customElement && !node.mcnComponent) {
				//createElement(node, customElement);
				promises.push(createElement(node, customElement));
			}

			if (node.msParentSelectorScope && node.winControl && node.winControl.pageLifeCycle && node.winControl.pageLifeCycle.observer) {
				//element is a fragment with its own mutation observer, no need to inspect childs
				return;
			}

			//if (node.nodeName === 'WIN-TEMPLATE') {
			//    return;
			//}

			for (var i = 0, l = node.childNodes.length; i < l; i++) {
				promises.push(inspect(node.childNodes[i]));
			}
		}

		return WinJS.Promise.join(promises);
	}

	/**
	 * inspect current DOM element and create webcomponents found on that element and on its child.
	 * @function
	 * @param {HTMLElement} element DOM element to inspect
	 */
	WinJSContrib.UI.WebComponents.processAll = function (element) { };
	if (WinJSContrib.UI.WebComponents.polyfill) {
		WinJSContrib.UI.WebComponents.processAll = inspect;
	}

	function observeMutations(element) {
		var observer = null;
		if (WinJSContrib.UI.WebComponents.polyfill) {
			observer = new MutationObserver(function (mutations) {
				//console.time('check mutation');
				mutations.forEach(function (mutation) {
					if (mutation.addedNodes.length) {
						for (var i = 0, l = mutation.addedNodes.length; i < l ; i++) {
							inspect(mutation.addedNodes[i]);
						}
					}
				});
				//console.timeEnd('check mutation');
			});

			observer.observe(element, { childList: true, subtree: true });
		}

		return observer;
	}
	WinJSContrib.UI.WebComponents.watch = observeMutations;

	function createElement(element, definition) {
		var ctrl = element.winControl;
		element.mcnComponent = true;
		var scope = WinJSContrib.Utils.getScopeControl(element);
		var p = WinJS.Promise.wrap();
		var process = function () {
			getControlInstance(definition.ctor, element);
		}

		if (scope && scope.pageLifeCycle) {
			//if the component is owned by a page/fragment, we process the control according to page lifecycle
			p = scope.pageLifeCycle.steps.render.attach(process);
		} else {
			process();
		}

		//put a proxy on setAttribute to detect changes in attributes
		var setAttribute = element.setAttribute;
		element.setAttribute = function (name, val) {
			if (element.winControl) {
				setAttribute.call(this, name, val);
				var definition = element.winControl.constructor.mcnWebComponent;
				if (definition) {
					var map = definition[name.toUpperCase()];
					if (map) {
						var ctx = { control: element.winControl, name: map.property, data: {} }
						definition.applyAttribute(name, this, ctx);
					}
				}
			}
		}

		return p;
	}

	function getControlInstance(ctor, element) {
		element.mcnComponent = true;
		var definition = ctor.mcnWebComponent;
		//console.time('building ' + definition.name);
		var options = {};
		if (element.dataset.winOptions) {
			options = getWinJSOptions(element);
		}

		if (definition && definition.optionsCallback) {
			options = definition.optionsCallback(element, options, scope);
		}

		var ctrl = new ctor(element, options);
		element.winControl = ctrl;
		if (definition) {
			definition.applyAll(element);
		}
		//console.timeEnd('building ' + definition.name);		
	}

	function applyMapping(tagname, ctor, mapping) {
		if (typeof mapping == 'function')
			return;
		mapping = mapping || {};

		ctor.mcnWebComponent = {
			name: tagname,
			map: mapping.map || {},
			optionsCallback: mapping.optionsCallback,
			applyAll: function (element) {
				var contextData = {};
				for (var item in this.map) {
					var attrcontext = { control: element.winControl, name: this.map[item].property, data: contextData };
					this.applyAttribute(item, element, null, attrcontext);
				}
			},
			applyAttribute: function (name, element, attrvalue, context) {
				var map = this.map[name.toUpperCase()];
				if (map) {
					var val = attrvalue || element.getAttribute(map.attribute);
					var ctrl = element.winControl;
					if (val && ctrl) {
						if (!map.type || map.type === 'property') {
							if (map.resolve) {
								WinJSContrib.Utils.applyValue(element, val, ctrl, map.property, context);
								return;
							}

							WinJSContrib.Utils.writeProperty(ctrl, map.property, val);
						} else if (map.type === 'event') {
							WinJSContrib.Utils.resolveValue(element, val, context);
						}
					}
				}
			}
		}

		if (mapping.properties) {
			mapping.properties.forEach(function (p) {
				if (p) {
					ctor.mcnWebComponent.map[p.toUpperCase()] = { attribute: p, property: p, resolve: true, type: 'property' };
				}
			});
		}

		if (mapping.events) {
			mapping.events.forEach(function (p) {
				if (p) {
					ctor.mcnWebComponent.map[p.toUpperCase()] = { attribute: p, property: p, resolve: true, type: 'event' };
				}
			});
		}

		if (mapping.controls) {
			for (var ctKey in mapping.controls) {
				var control = mapping.controls[ctKey];
				var controlDefinition = control.mcnWebComponent;
				for (var mapKey in controlDefinition.map) {
					var key = ctKey + '.' + mapKey;
					var controlmap = controlDefinition.map[mapKey];
					ctor.mcnWebComponent.map[key.toUpperCase()] = {
						attribute: ctKey + '.' + controlmap.attribute,
						property: ctKey + '.' + controlmap.property,
						resolve: controlmap.resolve
					};
				}
			}
		}
	}

	/**
	* Register a control to be used as a webcomponent. If a tagname has already been registered, 
	* the function will throw an error unless you specify the override flag
	* @function
	* @param {string} tagname name for DOM element for the component
	* @param {function} ctor constructor for the WinJS control
	* @param {Object} mapping definition for mapping between control and DOM element
	* @param {boolean} override indicate that you want to override an existing component definition
	* @example
	* WinJSContrib.UI.WebComponents.register('mcn-semanticlistviews', WinJSContrib.UI.SemanticListViews, {
	*	properties: ['nameOfProperty'],
	*   events : ['nameOfEvent'],
	*	controls: {
	*		"listview": WinJS.UI.ListView,
	*		"zoomedOutListview": WinJS.UI.ListView,
	*		"semanticZoom": WinJS.UI.SemanticZoom
	*	},
	*	map: {
	*		"DEFAULTGROUPLIMIT": { attribute: 'defaultGroupLimit', property: '_dataManager.defaultGroupLimit', resolve: true },
	*		"GROUPKIND": { attribute: 'groupKind', property: '_dataManager.groupKind', resolve: true },
	*		"FIELD": { attribute: 'field', property: '_dataManager.field', resolve: true },
	*		"ITEMS": { attribute: 'items', property: '_dataManager.items', resolve: true },
	*	}
	*});
	*/
	WinJSContrib.UI.WebComponents.register = function register(tagname, ctor, mapping, override) {
		var existing = registered[tagname.toUpperCase()];
		if (existing && !override) {
			throw 'component ' + tagname + ' already exists';
		}

		applyMapping(tagname, ctor, mapping);

		if (WinJSContrib.UI.WebComponents.polyfill) {
			global.document.createElement(tagname);
			//we uppercase because node names are uppercase
			registered[tagname.toUpperCase()] = { ctor: ctor };
		} else if (global.document.registerElement) {
			//register component with "real" webcomponent
			var proto = Object.create(HTMLElement.prototype);
			proto.createdCallback = function () {
			}

			proto.attachedCallback = function () {
				var element = this;
				var scope = WinJSContrib.Utils.getScopeControl(element);
				var process = function () {
					getControlInstance(ctor, element);
				}

				if (scope && scope.pageLifeCycle) {
					//if the component is owned by a page/fragment, we process the control according to page lifecycle
				    scope.pageLifeCycle.steps.render.attach(process);
				} else {
					process();
				}				
			};

			proto.attributeChangedCallback = function (attrName, oldValue, newValue) {
				var element = this;
				if (element.winControl) {
					var definition = element.winControl.constructor.mcnWebComponent;
					if (definition) {
						var map = definition.map[attrName.toUpperCase()];
						if (map) {
							definition.applyAttribute(attrName, element, newValue, { control: element.winControl, name: map.property, data: {} });
						}
					}
				}				
			};

			global.document.registerElement(tagname, { prototype: proto });
		}
	}

	function getWinJSOptions(elt) {
		return WinJS.UI.optionsParser(elt.dataset.winOptions, window, {
			select: WinJS.Utilities.markSupportedForProcessing(function (text) {
				var parent = WinJSContrib.Utils.getScopeControl(elt);
				if (parent) {
					return parent.element.querySelector(text);
				}
				else {
					return document.querySelector(text);
				}
			})
		});
	}



	if (WinJS.Binding && WinJS.Binding.Template) {
		WinJSContrib.UI.WebComponents.register('win-template', WinJS.Binding.Template, {
			properties: ['extractChild']
		});
	}

	if (WinJS.UI && WinJS.UI.AppBar) {
		WinJSContrib.UI.WebComponents.register('win-appbar', WinJS.UI.AppBar, {
			properties: ['closedDisplayMode', 'disabled', 'hidden', 'layout', 'placement', 'sticky', 'commands', 
				'onafterhide', 'onaftershow', 'onbeforehide', 'onbeforeshow'],
			events: ['afterhide', 'aftershow', 'beforehide', 'beforeshow']
		});
	}

	if (WinJS.UI && WinJS.UI.AutoSuggestBox) {
		WinJSContrib.UI.WebComponents.register('win-autosuggestbox', WinJS.UI.AutoSuggestBox, {
			properties: ['chooseSuggestionOnEnter', 'disabled', 'onquerychanged', 'onquerysubmitted', 
				'onresultsuggestionchosen', 'onsuggestionsrequested', 'placeholderText', 'queryText', 
				'searchHistoryContext', 'searchHistoryDisabled'],
			events: ['querychanged', 'querysubmitted', 'resultsuggestionchosen', 'suggestionsrequested']
		});
	}

	if (WinJS.UI && WinJS.UI.BackButton) {
		WinJSContrib.UI.WebComponents.register('win-backbutton', WinJS.UI.BackButton);
	}

	if (WinJS.UI && WinJS.UI.ContentDialog) {
		WinJSContrib.UI.WebComponents.register('win-contentdialog', WinJS.UI.ContentDialog, {
			properties: ['hidden', 'primaryCommandDisabled', 'primaryCommandText', 'secondaryCommandDisabled',
				'secondaryCommandText', 'title', 'onafterhide', 'onaftershow', 'onbeforehide', 'onbeforeshow'],
			events: ['afterhide', 'aftershow', 'beforehide', 'beforeshow']
		});
	}

	if (WinJS.UI && WinJS.UI.DatePicker) {
		WinJSContrib.UI.WebComponents.register('win-datepicker', WinJS.UI.DatePicker, {
			properties: ['calendar', 'datePattern', 'disabled', 'maxYear', 'minYear', 
				'monthPattern', 'yearPattern', 'onchange', 'current'],
			events: ['change']
		});
	}

	if (WinJS.UI && WinJS.UI.FlipView) {
		WinJSContrib.UI.WebComponents.register('win-flipview', WinJS.UI.FlipView, {
			properties: ['currentPage', 'orientation', 'itemTemplate', 'itemDataSource', 'itemSpacing', 'ondatasourcecountchanged', 'onpagevisibilitychanged', 'onpageselected', 'onpagecompleted'],
			events: ['datasourcecountchanged', 'pagevisibilitychanged', 'pageselected', 'pagecompleted']
		});
	}

	if (WinJS.UI && WinJS.UI.Flyout) {
		WinJSContrib.UI.WebComponents.register('win-flyout', WinJS.UI.Flyout, {
			properties: ['alignment', 'anchor', 'disabled', 'hidden', 'placement', 
				'onafterhide', 'onaftershow', 'onbeforehide', 'onbeforeshow'],
			events: ['afterhide', 'aftershow', 'beforehide', 'beforeshow']
		});
	}

	if (WinJS.UI && WinJS.UI.Hub) {
		WinJSContrib.UI.WebComponents.register('win-hub', WinJS.UI.Hub, {
			properties: ['headerTemplate', 'indexOfFirstVisible', 'indexOfLastVisible', 'loadingState', 
				'oncontentanimating', 'onheaderinvoked', 'onloadingstatechanged', 
				'orientation', 'scrollPosition', 'sectionOnScreen', 'sections', 'zoomableView'],
			events: ['contentanimating', 'headerinvoked', 'loadingstatechanged']
		});
	}

	if (WinJS.UI && WinJS.UI.HubSection) {
		WinJSContrib.UI.WebComponents.register('win-hubsection', WinJS.UI.HubSection, {
			properties: ['contentElement', 'header', 'isHeaderStatic']
		});
	}

	if (WinJS.UI && WinJS.UI.ItemContainer) {
		WinJSContrib.UI.WebComponents.register('win-itemcontainer', WinJS.UI.ItemContainer, {
			properties: ['draggable', 'oninvoked', 'onselectionchanged', 'onselectionchanging', 'selected', 'selectionDisabled', 
				'swipeBehavior', 'swipeOrientation', 'tapBehavior'],
			events: ['invoked', 'selectionchanged', 'selectionchanging']
		});
	}

	if (WinJS.UI && WinJS.UI.ListView) {
		WinJSContrib.UI.WebComponents.register('win-listview', WinJS.UI.ListView, {
			properties: [
				'itemTemplate', 'itemDataSource', 'itemsDraggable', 'itemsReorderable',
				'oniteminvoked', 'groupHeaderTemplate', 'groupDataSource', 'swipeBehavior',
				'selectBehavior', 'tapBehavior', 'header', 'footer'
			],
			events: ['iteminvoked']
		});
	}

	if (WinJS.UI && WinJS.UI.Menu) {
		WinJSContrib.UI.WebComponents.register('win-menu', WinJS.UI.Menu, {
			properties: ['alignment', 'anchor', 'commands', 'disabled', 'hidden', 'placement', 
				'onafterhide', 'onaftershow', 'onbeforehide', 'onbeforeshow'],
			events: ['afterhide', 'aftershow', 'beforehide', 'beforeshow']
		});
	}

	if (WinJS.UI && WinJS.UI.Pivot) {
		WinJSContrib.UI.WebComponents.register('win-pivot', WinJS.UI.Pivot, {
			properties: ['items', 'locked', 'onitemanimationend', 'onitemanimationstart', 'onselectionchanged', 
				'selectedIndex', 'selectedItem', 'title'],
			events: ['itemanimationend', 'itemanimationstart', 'selectionchanged']
		});
	}

	if (WinJS.UI && WinJS.UI.PivotItem) {
		WinJSContrib.UI.WebComponents.register('win-pivotitem', WinJS.UI.PivotItem, {
			properties: ['contentElement', 'header']
		});
	}

	if (WinJS.UI && WinJS.UI.Rating) {
		WinJSContrib.UI.WebComponents.register('win-rating', WinJS.UI.Rating, {
			properties: ['averageRating', 'disabled', 'enableClear', 'maxRating', 
				'oncancel', 'onchange', 'onpreviewchange', 'tooltipStrings', 'userRating'],
			events: ['cancel', 'change', 'previewchange']
		});
	}

	if (WinJS.UI && WinJS.UI.Repeater) {
		WinJSContrib.UI.WebComponents.register('win-repeater', WinJS.UI.Repeater, {
			properties: ['data', 'length', 'onitemchanged', 'onitemchanging', 'oniteminserted', 'oniteminserting', 
				'onitemmoved', 'onitemmoving', 'onitemremoved', 'onitemremoving', 'onitemsloaded', 
				'onitemsreloaded', 'onitemsreloading', 'template'],
			events: ['itemchanged', 'itemchanging', 'iteminserted', 'iteminserting',
				'itemmoved', 'itemmoving', 'itemremoved', 'itemremoving', 'itemsloaded',
				'itemsreloaded', 'itemsreloading']
		});
	}

	if (WinJS.UI && WinJS.UI.SearchBox) {
		WinJSContrib.UI.WebComponents.register('win-searchbox', WinJS.UI.SearchBox, {
			properties: ['chooseSuggestionOnEnter', 'disabled', 'focusOnKeyboardInput', 'onquerychanged', 'onquerysubmitted', 
				'onresultsuggestionchosen', 'onsuggestionsrequested', 'placeholderText', 'queryText', 
				'searchHistoryContext', 'searchHistoryDisabled'],
			events: ['querychanged', 'querysubmitted', 'resultsuggestionchosen', 'suggestionsrequested']
		});
	}

	if (WinJS.UI && WinJS.UI.SemanticZoom) {
		WinJSContrib.UI.WebComponents.register('win-semanticzoom', WinJS.UI.SemanticZoom, {
			properties: ['enableButton', 'locked', 'onzoomchanged', 'zoomedInItem', 'zoomedOut', 'zoomedOutItem', 'zoomFactor'],
			events: ['zoomchanged']
		});
	}

	if (WinJS.UI && WinJS.UI.SplitView) {
		WinJSContrib.UI.WebComponents.register('win-splitview', WinJS.UI.SplitView, {
			properties: ['contentElement', 'hiddenDisplayMode', 'paneElement', 'paneHidden', 'panePlacement', 'shownDisplayMode',
				'onafterhide', 'onaftershow', 'onbeforehide', 'onbeforeshow'],
			events: ['afterhide', 'aftershow', 'beforehide', 'beforeshow']
		});
	}

	if (WinJS.UI && WinJS.UI.TimePicker) {
		WinJSContrib.UI.WebComponents.register('win-timepicker', WinJS.UI.TimePicker, {
			properties: ['onchange', 'clock', 'current', 'disabled', 'hourPattern',
				'minuteIncrement', 'minutePattern', 'periodPattern'],
			events: ['onchange']
		});
	}

	if (WinJS.UI && WinJS.UI.ToggleSwitch) {
		WinJSContrib.UI.WebComponents.register('win-toggleswitch', WinJS.UI.ToggleSwitch, {
			properties: ['onchange', 'checked', 'disabled', 'labelOff', 'labelOn', 'title'],
			events: ['onchange']
		});
	}

	if (WinJS.UI && WinJS.UI.ToolBar) {
		WinJSContrib.UI.WebComponents.register('win-toolbar', WinJS.UI.ToolBar);
	}

	if (WinJS.UI && WinJS.UI.Tooltip) {
		WinJSContrib.UI.WebComponents.register('win-tooltip', WinJS.UI.Tooltip, {
			properties: ['contentElement', 'extraClass', 'infotip', 'innerHTML', 'onbeforeclose', 
				'onbeforeopen', 'onclosed', 'onopened', 'placement'],
			events: ['beforeclose', 'beforeopen', 'closed', 'opened']
		});
	}

	if (WinJS.UI && WinJS.UI.ViewBox) {
		WinJSContrib.UI.WebComponents.register('win-viewbox', WinJS.UI.ViewBox);
	}


	/*
				WinJS.UI.MenuCommand
				WinJS.UI.NavBar
				WinJS.UI.NavBarCommand
				WinJS.UI.NavBarContainer
				Toolbar
	*/
})(this);
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib;
(function (WinJSContrib) {
    var WinRT;
    (function (WinRT) {
        /**
         * read protocol arguments from application activation event arguments
         * @function WinJSContrib.WinRT.readProtocol
         * @param {Object} args WinJS application activation argument
         * @returns {Object} protocol arguments
         */
        function readProtocol(args) {
            if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.protocol && args.detail.uri) {
                var navArgs = { action: undefined };
                var protocolArgs = {};
                var queryargs = args.detail.uri.query;
                if (queryargs[0] == '?') {
                    queryargs = queryargs.substr(1);
                }
                if (queryargs) {
                    queryargs.split('&').forEach(function (item) {
                        var arg = item.split('=');
                        protocolArgs[arg[0]] = decodeURIComponent(arg[1]);
                    });
                }
                navArgs.protocol = {
                    action: args.detail.uri.host,
                    args: protocolArgs
                };
                return navArgs;
            }
        }
        WinRT.readProtocol = readProtocol;
        ;
        /**
         * Indicate if a valid internet connection is available, even with constrained access
         * @function WinJSContrib.WinRT.isConnected
         * @returns {boolean}
         */
        function isConnected() {
            var nlvl = Windows.Networking.Connectivity.NetworkConnectivityLevel;
            var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            if (profile !== null) {
                var level = profile.getNetworkConnectivityLevel();
                return level === nlvl.constrainedInternetAccess || level === nlvl.internetAccess;
            }
            return false;
        }
        WinRT.isConnected = isConnected;
        ;
        /**
         * Indicate if a valid internet connection is available
         * @function WinJSContrib.WinRT.hasInternetAccess
         * @returns {boolean}
         */
        function hasInternetAccess() {
            var nlvl = Windows.Networking.Connectivity.NetworkConnectivityLevel;
            var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            if (profile !== null) {
                var level = profile.getNetworkConnectivityLevel();
                return level === nlvl.internetAccess;
            }
            return false;
        }
        WinRT.hasInternetAccess = hasInternetAccess;
        ;
        /**
         * trigger callback when internet connection status is changing
         * @function WinJSContrib.WinRT.onInternetStatusChanged
         * @param {function} callback callback for internet status change notification
         * @returns {function} function to call for unregistering the callback
         */
        function onInternetStatusChanged(callback) {
            var handler = function (arg) {
                var e = arg;
                callback(WinJSContrib.WinRT.hasInternetAccess());
            };
            var network = Windows.Networking.Connectivity.NetworkInformation;
            network.addEventListener('networkstatuschanged', handler);
            return function () {
                network.removeEventListener('networkstatuschanged', handler);
            };
        }
        WinRT.onInternetStatusChanged = onInternetStatusChanged;
    })(WinRT = WinJSContrib.WinRT || (WinJSContrib.WinRT = {}));
})(WinJSContrib || (WinJSContrib = {}));
var WinJSContrib;
(function (WinJSContrib) {
    var Alerts;
    (function (Alerts) {
        /**
         * show system alert box
         * @function WinJSContrib.Alerts.messageBox
         * @param {Object} opt message options
         * @returns {WinJS.Promise}
         */
        function messageBox(opt) {
            var _global = window;
            if (opt) {
                if (_global.Windows) {
                    var md = new Windows.UI.Popups.MessageDialog(opt.content);
                    if (opt.title) {
                        md.title = opt.title;
                    }
                    if (opt.commands && opt.commands.forEach) {
                        opt.commands.forEach(function (command, index) {
                            var cmd = new Windows.UI.Popups.UICommand();
                            if (command.id)
                                cmd.id = command.id;
                            cmd.label = command.label;
                            if (command.callback) {
                                cmd.invoked = command.callback;
                            }
                            ((md.commands)).append(cmd);
                            if (command.isDefault) {
                                md.defaultCommandIndex = index;
                            }
                        });
                    }
                    return (md.showAsync());
                }
                else {
                    return new WinJS.Promise(function (complete, error) {
                        var title = "";
                        if (opt.title) {
                            title = opt.title;
                        }
                        var commands = [];
                        if (opt.commands && opt.commands.forEach) {
                            //if (opt.commands.length > 2) {
                            //    return WinJS.Promise.wrapError("you must specify maximum 2 commands on Cordova platforms");
                            //}
                            opt.commands.forEach(function (command, index) {
                                commands.push(command.label);
                            });
                        }
                        else
                            commands = ['Ok'];
                        if (_global.navigator && _global.navigator.notification && _global.navigator.notification.confirm) {
                            _global.navigator.notification.confirm(opt.content, function (res) {
                                if (opt.commands && opt.commands[res - 1] && opt.commands[res - 1].callback) {
                                    var c = opt.commands[res - 1].callback();
                                    if (c && c.then) {
                                        c.then(function () {
                                            complete(true);
                                        });
                                    }
                                    else {
                                        complete(true);
                                    }
                                }
                                else if (res != 0)
                                    complete(true);
                                else
                                    complete(false);
                            }, title, commands // buttonLabels
                            );
                        }
                        else {
                            if (window.confirm(title))
                                complete(true);
                            else
                                complete(false);
                        }
                    });
                }
            }
            return WinJS.Promise.wrapError("you must specify commands as an array of objects with properties text and callback such as {text: '', callback: function(c){}}");
        }
        Alerts.messageBox = messageBox;
        ;
        /**
         * show system alert box
         * @function WinJSContrib.Alerts.message
         * @param {string} title title of the alert
         * @param {string} content text for the alert
         * @returns {WinJS.Promise}
         */
        function message(title, content) {
            return WinJSContrib.Alerts.messageBox({ title: title, content: content });
        }
        Alerts.message = message;
        /**
         * show system alert box
         * @function WinJSContrib.Alerts.confirm
         * @param {string} title title of the alert
         * @param {string} content text for the alert
         * @param {string} yes text for yes
         * @param {string} no text for no
         * @returns {WinJS.Promise}
         */
        function confirm(title, content, yes, no) {
            return new WinJS.Promise(function (complete, error) {
                WinJSContrib.Alerts.messageBox({
                    title: title,
                    content: content,
                    commands: [
                        {
                            label: yes,
                            callback: function (e) {
                                complete(true);
                            },
                            isDefault: true
                        },
                        {
                            label: no,
                            callback: function (e) {
                                complete(false);
                            }
                        }
                    ]
                });
            });
        }
        Alerts.confirm = confirm;
        /**
         * show system toast notification
         * @function WinJSContrib.Alerts.toastNotification
         * @param {Object} data toast options
         */
        function toastNotification(data) {
            if (Windows) {
                var notifications = Windows.UI.Notifications;
                var template = data.template || (data.picture ? notifications.ToastTemplateType.toastImageAndText01 : notifications.ToastTemplateType.toastText01);
                //var template = notifications.ToastTemplateType[data.template]; //toastImageAndText01;
                var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                var toastTextElements = toastXml.getElementsByTagName("text");
                var toastImageElements = toastXml.getElementsByTagName("image");
                if (data.launch) {
                    var toastElements = toastXml.getElementsByTagName("toast");
                    toastElements[0].setAttribute("launch", JSON.stringify(data.launch));
                }
                toastTextElements[0].appendChild(toastXml.createTextNode(data.text));
                if (data.text2 && toastTextElements.length > 1) {
                    toastTextElements[1].appendChild(toastXml.createTextNode(data.text2));
                }
                if (data.text3 && toastTextElements.length > 1) {
                    toastTextElements[2].appendChild(toastXml.createTextNode(data.text3));
                }
                if (data.picture) {
                    toastImageElements[0].setAttribute("src", data.picture); //"ms-appx:///images/logo.png"
                }
                var toast = new notifications.ToastNotification(toastXml);
                var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                toastNotifier.show(toast);
            }
            else {
                throw "No notification plugin found";
            }
        }
        Alerts.toastNotification = toastNotification;
        /**
         * show system toast notification
         * @function WinJSContrib.Alerts.toast
         * @param {string} text text displayed in the toast
         * @param {string} picture path to a picture to display in the toast
         */
        function toast(text, picture) {
            WinJSContrib.Alerts.toastNotification({ text: text, picture: picture });
        }
        Alerts.toast = toast;
    })(Alerts = WinJSContrib.Alerts || (WinJSContrib.Alerts = {}));
})(WinJSContrib || (WinJSContrib = {}));

//# sourceMappingURL=../../Sources/WinRT/winjscontrib.winrt.core.js.map
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib = WinJSContrib || {};
WinJSContrib.UPnP = WinJSContrib.UPnP || {};

(function (global) {

    WinJSContrib.UPnP.deviceTypes = {
        ContentDirectory1: 'urn:schemas-upnp-org:service:ContentDirectory:1',
        ContentDirectory2: 'urn:schemas-upnp-org:service:ContentDirectory:2',
        ContentDirectory3: 'urn:schemas-upnp-org:service:ContentDirectory:3',
        ContentDirectory4: 'urn:schemas-upnp-org:service:ContentDirectory:4',
        MediaRenderer1: 'urn:schemas-upnp-org:device:MediaRenderer:1',
        MediaRenderer2: 'urn:schemas-upnp-org:device:MediaRenderer:2',
        MediaRenderer3: 'urn:schemas-upnp-org:device:MediaRenderer:3',
        MediaRenderer4: 'urn:schemas-upnp-org:device:MediaRenderer:4',
        MediaServer1: 'urn:schemas-upnp-org:device:MediaServer:1',
        MediaServer2: 'urn:schemas-upnp-org:device:MediaServer:2',
        MediaServer3: 'urn:schemas-upnp-org:device:MediaServer:3',
        MediaServer4: 'urn:schemas-upnp-org:device:MediaServer:4',
        AVTransport1:'urn:schemas-upnp-org:service:AVTransport:1',
        AVTransport2: 'urn:schemas-upnp-org:service:AVTransport:2',
        ConnectionManager1: 'urn:schemas-upnp-org:service:ConnectionManager:1',
        ConnectionManager2: 'urn:schemas-upnp-org:service:ConnectionManager:2',
        ConnectionManager3: 'urn:schemas-upnp-org:service:ConnectionManager:3'
    };

    WinJSContrib.UPnP.devicesDiscovery = function devicesDiscovery(filter, callback, timeout) {
        var hostName;
        try {
            hostName = new Windows.Networking.HostName("239.255.255.250");
        } catch (ex) {
            error({ message: "Invalid host name." });
            return;
        }

        var devices = new WinJS.Binding.List();

        var discovery = {
            devices: devices,
            hasError: null,
            promise: null,
        };

        function exists(url) {
            var matches = devices.filter(function (d) {
                return (url == d.deviceDescriptionUrl);
            });
            return matches.length > 0;
        }

        function discover(filter) {
            return new WinJS.Promise(function (complete, error) {
                var clientSocket = new Windows.Networking.Sockets.DatagramSocket();

                function onsuccess(err) {
                    try {
                        if (clientSocket)
                            clientSocket.close();
                    } catch (ex) {
                    }
                    complete(devices);
                }

                function onerror(err) {
                    try {
                        if (clientSocket)
                            clientSocket.close();
                    } catch (ex) {
                    }
                    error(err);
                }

                clientSocket.onmessagereceived = function (args) {
                    var e = args;
                    var reader = args.getDataReader();
                    var count = reader.unconsumedBufferLength;
                    var data = reader.readString(count);
                    var completed = false;

                    if (data) {
                        var items = data.split('\n');
                        items.forEach(function (item) {
                            if (!completed && item.toLowerCase().indexOf('location:') == 0) {
                                var url = item.substr(9, item.length - 9);
                                completed = true;
                                if (!exists(url)) {
                                    WinJS.xhr({ url: url }).then(function (r) {

                                        var rawdevice = xmlToJson(r.responseXML);
                                        var device = rawdevice.root.device;

                                        device.deviceDescriptionUrl = url;
                                        device.rootUrl = url.substr(0, url.indexOf('/', 8));
                                        if (!exists(url)) {
                                            devices.push(new WinJSContrib.UPnP.UPnPDevice(device));
                                        }

                                        if (callback)
                                            callback(device, url);
                                    }, function (err) {
                                        console.error('calling device failed');
                                        console.error(err);
                                    });
                                }
                            }
                        });
                    }

                }

                clientSocket.getOutputStreamAsync(hostName, "1900").then(function (outputStream) {
                    var message = "M-SEARCH * HTTP/1.1\r\n" +
                                        "HOST: 239.255.255.250:1900\r\n" +
                                          "ST:" + (filter || "upnp:rootdevice") + "\r\n" +
                                          "MAN:\"ssdp:discover\"\r\n" +
                                          "MX:3\r\n\r\n";


                    var writer = new Windows.Storage.Streams.DataWriter(outputStream);
                    writer.unicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.Utf8;
                    writer.writeString(message);
                    return writer.storeAsync();
                }).then(function () {
                    return WinJS.Promise.timeout(timeout || 20000);
                }).then(onsuccess, onerror);
            }).then(function (res) {
                discovery.hasError = false;
            }, function (err) {
                discovery.hasError = true;
                discovery.error = err;
            });
        }

        var promises = [];

        if (!filter || (typeof filter == 'string')) {
            promises.push(discover(filter));
        }
        else if (filter && typeof filter != 'string' && filter.length) {
            for (var i = 0 ; i < filter.length; i++) {
                promises.push(discover(filter[i]));
            }
        }

        discovery.promise = WinJS.Promise.join(promises);

        return discovery;
    }

    function endsWith(text, search) {
        return text.indexOf(search) == text.length - search.length;
    }

    WinJSContrib.UPnP.getContentType = function (url, extension) {
        var lowerUrl = url.toLowerCase();

        if (extension == "mp3" || endsWith(lowerUrl, ".mp3"))
            return "audio/mp3";

        if (extension == "mp4" || endsWith(lowerUrl, ".mp4"))
            return "video/mp4";

        if (extension == "avi" || endsWith(lowerUrl, ".avi"))
            return "video/avi";

        if (extension == "mkv" || endsWith(lowerUrl, ".mkv"))
            return "video/x-matroska";
    }

    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);

                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            var properties = 0;
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    var tmp = xmlToJson(item);
                    var colonIdx = nodeName.indexOf(':');
                    if (colonIdx > 0) {
                        var clearNode = nodeName.substr(colonIdx + 1, nodeName.length - colonIdx - 1);

                    }

                    if (clearNode && !obj[clearNode]) {
                        obj[clearNode] = tmp;
                    } else {
                        obj[nodeName] = tmp;
                    }

                    properties++;
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                    properties++;
                }
            }

            if (obj['#text'] && typeof obj['#text'] == 'string') {
                obj['#text'] = obj['#text'].trim();
            }
            if (properties == 1 && obj['#text'] && typeof obj['#text'] == 'string') {
                obj = obj['#text'];
            }
        }

        for (var e in obj["@attributes"]) {
            if (!obj[e])
                obj[e] = obj["@attributes"][e];
        }

        return obj;
    };

    /**
     * UPnP device
     * @class
     */
    WinJSContrib.UPnP.UPnPDevice = function (deviceObj) {
        for (var p in deviceObj) {
            this[p] = deviceObj[p];
        }
    }

    WinJSContrib.UPnP.UPnPDevice.prototype.getService = function (serviceType) {
        var device = this;
        var service = null;

        if (typeof serviceType == 'string')
            serviceType = [serviceType];

        if (device.serviceList && device.serviceList.service) {
            service = device.serviceList.service.filter(function (s) {
                return serviceType.indexOf(s.serviceType) >= 0;
            })[0];

            if (!service && device.deviceList) {
                device.deviceList.device.forEach(function (childdevice) {
                    var childService = childdevice.serviceList.service.filter(function (s) {
                        return serviceType.indexOf(s.serviceType) >= 0;
                    })[0];

                    if (childService)
                        service = childService;
                });
            }
        }

        if (service) {
            service.rootUrl = device.rootUrl;
            service.url = device.rootUrl + service.controlURL;
        }

        return service;
    }

    WinJSContrib.UPnP.UPnPDevice.prototype.getAVTransport = function () {
        var service = this.getService([WinJSContrib.UPnP.deviceTypes.AVTransport1, WinJSContrib.UPnP.deviceTypes.AVTransport2]);
        if (service) {
            return new WinJSContrib.UPnP.UPnPAVTransport(service);
        }
    }

    WinJSContrib.UPnP.UPnPDevice.prototype.getContentDirectory = function () {
        var service = this.getService([WinJSContrib.UPnP.deviceTypes.ContentDirectory1, WinJSContrib.UPnP.deviceTypes.ContentDirectory2, WinJSContrib.UPnP.deviceTypes.ContentDirectory3, WinJSContrib.UPnP.deviceTypes.ContentDirectory4]);
        if (service) {
            return new WinJSContrib.UPnP.UPnPContentDirectory(service);
        }
    }

    WinJSContrib.UPnP.UPnPDevice.prototype.getConnectionManager = function () {
        var service = this.getService([WinJSContrib.UPnP.deviceTypes.ConnectionManager1, WinJSContrib.UPnP.deviceTypes.ConnectionManager2, WinJSContrib.UPnP.deviceTypes.ConnectionManager3]);
        if (service) {
            return new WinJSContrib.UPnP.UPnPConnectionManager(service);
        }
    }

    /**
     * Code largely from https://github.com/richtr/plug.play.js
     */

    WinJSContrib.UPnP.UPnPService = function (serviceObj, opts) {

        this.options = opts || { debug: false };
        this.svc = serviceObj;

        // API stub
        this.action = function () { };

        //if (!this.svc || !(this.svc instanceof NetworkService)) {

        //    this.debugLog('First argument provided in constructor MUST be a valid NetworkService object');

        //    return this;
        //}

        //if (!this.svc.type || this.svc.type.indexOf('upnp:') !== 0) {

        //    this.debugLog('First argument provided in constructor MUST be a _UPnP_ NetworkService object');

        //    return this;

        //}

        //this.svcType = this.svc.type.replace('upnp:', '');
        this.svcType = this.svc.serviceType;
        this.svcUrl = this.svc.url;

        var self = this;

        // Full API
        this.action = function (upnpAction, upnpParameters, callback) {

            return new WinJS.Promise(function (promiseComplete, promiseError) {

                // Handle .action( name, callback )
                if (!callback && Object.prototype.toString.call(upnpParameters) == '[object Function]') {
                    callback = upnpParameters;
                    upnpParameters = {};
                }

                // Generate a callback stub if a Function has not been provided
                if (!callback || Object.prototype.toString.call(callback) !== '[object Function]') {
                    callback = function (e, response) { };
                }

                // Create a UPnP XML Request message
                var svcMsg = self.createRequest(self.svcType, upnpAction, upnpParameters);

                // Send the UPnP XML Request message to the current service
                self.sendRequest(self.svcType, upnpAction, self.svcUrl, svcMsg, function (e, xmlResponse) {

                    if (e !== null) {
                        callback.apply(self, [e, null]);
                        promiseError(e);
                        return;
                    }

                    // Parse UPnP XML Response message
                    self.handleResponse(upnpAction, xmlResponse.responseXML || "", upnpParameters, function (e, upnpResponse) {

                        // Fire callback
                        callback.apply(self, [e, upnpResponse]);

                        // Fire promise
                        if (e !== null) {
                            promiseError(e);
                        } else {
                            promiseComplete(upnpResponse);
                        }

                    });

                });
            });
        }
    };

    WinJSContrib.UPnP.UPnPService.prototype.constructor = WinJSContrib.UPnP.UPnPService;

    // UPnP XML MESSAGING TEMPLATES

    WinJSContrib.UPnP.UPnPService.prototype.requestTemplate = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
     "<s:Envelope s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" " +
       "xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
       "\t<s:Body>\n" +
         "\t\t<u:{ACTION_NAME} xmlns:u=\"{ACTION_TYPE}\">\n" +
           "{ACTION_VARS}" +
         "\t\t</u:{ACTION_NAME}>\n" +
       "\t</s:Body>\n" +
     "</s:Envelope>\n";

    // UPNP PRIMITIVE VARIABLE TYPE CHECKERS
    // from http://upnp.org/specs/arch/UPnP-arch-DeviceArchitecture-v1.0.pdf
    WinJSContrib.UPnP.UPnPService.prototype.types = {

        "i1": function (val, allowedValues, toNative) {
            var i8 = new Int8Array(1);
            i8[0] = val;

            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(i8[0], allowedValues);

        },

        "i2": function (val, allowedValues, toNative) {
            var i16 = new Int16Array(1);
            i16[0] = val;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(i16[0], allowedValues);
        },

        "i4": function (val, allowedValues, toNative) {
            var i32 = new Int32Array(1);
            i32[0] = val;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(i32[0], allowedValues);
        },

        "ui1": function (val, allowedValues, toNative) {
            var ui8 = new Uint8Array(1);
            ui8[0] = val;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(ui8[0], allowedValues);
        },

        "ui2": function (val, allowedValues, toNative) {
            var ui16 = new Uint16Array(1);
            ui16[0] = val;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(ui16[0], allowedValues);
        },

        "ui4": function (val, allowedValues, toNative) {
            var ui32 = new Uint32Array(1);
            ui32[0] = val;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(ui32[0], allowedValues);
        },

        "int": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || isNaN(val)) {
                val = 0;
            } else if (typeof val !== 'number') {
                if (val === true) {
                    val = 1;
                } else {
                    val = parseInt(val + "", 10);
                }
            }
            if (!toNative) {
                val = expandExponential(val + "");
            }
            if (isNaN(val)) val = 0;
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
        },

        "r4": function (val, allowedValues, toNative) {
            var f32 = new Float32Array(1);
            f32[0] = val;
            if (!toNative) {
                return f32[0] ? expandExponential(f32[0] + "") : "0";
            }
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(f32[0], allowedValues);
        },

        "r8": function (val, allowedValues, toNative) {
            var f64 = new Float64Array(1);
            f64[0] = val;
            if (!toNative) {
                return f64[0] ? expandExponential(f64[0] + "") : "0";
            }
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(f64[0], allowedValues);
        },

        "number": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['r8'](val, allowedValues, toNative);
        },

        "fixed_14_4": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['float'](val, allowedValues, toNative);
        },

        "float": function (val, allowedValues, toNative) {
            var _float = parseFloat(val);
            if (!toNative) {
                return _float ? expandExponential(_float + "") : "0";
            }
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(_float, allowedValues);
        },

        "char": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || val === "" || (val + "") == "NaN" || val instanceof RegExp) {
                val = "";
            } else if (val === false || val === true || val == "true" || val == "yes" || val == "false" || val == "no") {
                val = (val === true || val == "true" || val == "yes") ? "1" : "0";
            } else {
                val = val.toString();
            }
            if (val.length > 0) {
                val = WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
                return val.charAt(0);
            }
            return val;
        },

        "string": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || val === "" || (val + "") == "NaN" || val instanceof RegExp) {
                val = "";
            }
            val = val + "";

            val = WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
            return val;
        },

        "xmlObj": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || val === "" || (val + "") == "NaN" || val instanceof RegExp) {
                val = "";
            }
            val = val + "";

            val = WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
            try {
                var s = '';

                var currentPos = val.indexOf('&');
                while (currentPos > 0) {
                    var idx = val.indexOf(';', currentPos);
                    if (idx < 0 || (idx - currentPos) > 5) {
                        val = val.substr(0, currentPos) + "&amp;" + val.substr(currentPos + 1, val.length - (currentPos + 1));
                    }
                    currentPos = val.indexOf('&', currentPos + 1);
                }

                var xml = parseXML(val);
                return xmlToJson(xml);
            } catch (exception) {
                console.error(exception);
                return val;
            }
        },

        "date": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['dateTime'](val, allowedValues, toNative);
        },

        "dateTime": function (val, allowedValues, toNative) {
            if (toNative) { // Parse to ECMA Date object
                if (Object.prototype.toString.call(val) == '[object String]') {
                    val = new Date(parseDate(val));
                    if (isNaN(val)) val = "";
                } else if (Object.prototype.toString.call(val) == '[object Date]') {
                    val = val;
                }
            } else { // Parse to ISO-8601 string
                if (Object.prototype.toString.call(val) == '[object String]') {
                    val = val + "";
                } else if (Object.prototype.toString.call(val) == '[object Date]') {
                    if (val.toString() == "Invalid Date") { // opera specific functionality
                        val = "";
                    } else {
                        val = val.toISOString();
                    }
                }
            }
            val = WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
            return val;
        },

        "dateTime_tz": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['dateTime'](val, allowedValues, toNative);
        },

        "time": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['dateTime'](val, allowedValues, toNative);
        },

        "time_tz": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['dateTime'](val, allowedValues, toNative);
        },

        "boolean": function (val, allowedValues, toNative) {
            if (val == 'false' || val == 'f' || val == 'no' || val == 'n' || val instanceof RegExp || val <= 0 || !val) {
                if (toNative) {
                    val = false;
                } else {
                    val = "0";
                }
            } else {
                if (toNative) {
                    val = true;
                } else {
                    val = "1";
                }
            }
            return val;
        },

        "bin_base64": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || val === "" || (val + "") == "NaN" || val instanceof RegExp) {
                val = "";
            }
            if (val === true || val === false) {
                val = val === true ? "1" : "0";
            }
            if (toNative) { // convert to string
                val = atob(val + "");
            } else { // convert to base64
                val = btoa(val + "");
            }
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
        },

        "bin_hex": function (val, allowedValues, toNative) {
            if (val === undefined || val === null || val === "" || (val + "") == "NaN" || val instanceof RegExp) {
                val = "";
            }
            if (val === true || val === false) {
                val = val === true ? "1" : "0";
            }
            if (toNative) { // convert to string
                val = htoa(val + "");
            } else { // convert to hex
                val = atoh(val + "");
            }
            return WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues(val, allowedValues);
        },

        "uri": function (val, allowedValues, toNative) {
            if (toNative) {
                val = decodeURI(val + "");
            }
            return WinJSContrib.UPnP.UPnPService.prototype.types['string'](val, allowedValues); // No URI syntax checking
        },

        "uuid": function (val, allowedValues, toNative) {
            return WinJSContrib.UPnP.UPnPService.prototype.types['string'](val, allowedValues); // No UUID syntax checking
        }

    };

    // Override .types toString function
    for (var type in WinJSContrib.UPnP.UPnPService.prototype.types) {
        WinJSContrib.UPnP.UPnPService.prototype.types[type]._name = type;
        WinJSContrib.UPnP.UPnPService.prototype.types[type]["toString"] = function () { return this._name; };
    }

    WinJSContrib.UPnP.UPnPService.prototype.createRequest = function (upnpServiceType, upnpActionName, parameters) {

        parameters = this.formatParameters(parameters);

        this.debugLog('Creating UPnP XML Control Message for [' + upnpActionName + '] with parameters:');
        this.debugLog(JSON ? JSON.stringify(parameters) : null);

        // Build basic part of XML request
        var svcMsg = this.requestTemplate.replace(/\{ACTION_TYPE\}/g, encodeXML(trim(upnpServiceType)));

        svcMsg = svcMsg.replace(/\{ACTION_NAME\}/g, encodeXML(trim(upnpActionName)));

        var svcInParams = parameters['request'],
            svcInParams_xml = "";

        if (svcInParams) {

            // Generate XML parameters syntax
            for (var svcParam in svcInParams) {

                // Perform type checking sanitization
                if (svcInParams[svcParam]['type'] !== undefined && svcInParams[svcParam]['type'] !== null) {

                    // get the primitive sanitization function
                    var typeCheck = this.types[svcInParams[svcParam]['type']];

                    if (typeCheck) {
                        svcInParams[svcParam]['value'] = typeCheck(svcInParams[svcParam]['value'], svcInParams[svcParam]['allowedValueList'], false);
                    }

                }

                if (svcInParams[svcParam]['value'] === null || svcInParams[svcParam]['value'] === undefined) {

                    svcInParams[svcParam]['value'] = ""; // pass through empty value

                }

                svcInParams_xml += "\t\t\t<" + svcParam + ">" + encodeXML(trim(svcInParams[svcParam]['value'] + "")) + "</" + svcParam + ">\n";

            }

        }

        // Add ACTION_VARS, if any
        svcMsg = svcMsg.replace(/\{ACTION_VARS\}/g, svcInParams_xml);

        // DEBUG
        this.debugLog('[REQUEST] (SOAPAction: ' + upnpServiceType + '#' + upnpActionName + ') ' + svcMsg);

        return svcMsg;

    };

    WinJSContrib.UPnP.UPnPService.prototype.sendRequest = function (upnpServiceType, upnpActionName, upnpEndpointURL, upnpRequestXML, onUPnPResponse) {

        var soapaction = '\"' + upnpServiceType.replace(/[\"\#]/g, '') + '#' + upnpActionName.replace(/[\"\#]/g, '') + '\"'
        var httpClient = new Windows.Web.Http.HttpClient();
        var uri = new Windows.Foundation.Uri(upnpEndpointURL);
        var request = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.post, uri);
        request.headers.append('SOAPACTION', soapaction);
        //request.headers.append('Content-Type', 'text/xml; charset="utf-8";');        

        request.content = new Windows.Web.Http.HttpStringContent(upnpRequestXML, Windows.Storage.Streams.UnicodeEncoding.utf8, "text/xml");

        httpClient.sendRequestAsync(request).then(function (r) {
            var content = r.content.readAsStringAsync().then(function (text) {
                var xml = parseXML(text);
                var r = {
                    status: 200,
                    responseText: text,
                    responseXML: xml
                };
                onUPnPResponse.apply(this, [null, r]);
            });

        }, function (err) {
            onUPnPResponse.apply(undefined, [new UPnPError('XmlHttpRequest failed'), null]);
        });

        return this;

        try {

            var xhr = new XMLHttpRequest();

            xhr.open('POST', upnpEndpointURL);
            xhr.setRequestHeader('Content-Type', 'text/xml; charset="utf-8";');
            xhr.setRequestHeader('action', soapaction);
            xhr.setRequestHeader('zurgl', soapaction);
            xhr.setRequestHeader('SOAPAction', soapaction);

            xhr.onabort = xhr.onerror = function () {

                onUPnPResponse.apply(undefined, [new UPnPError('XmlHttpRequest failed'), null]);

                //xhrManager.release(xhr);

            };

            var self = this;

            xhr.onreadystatechange = function () {

                if (this.readyState < 4) return;

                if (this.status !== 200) {

                    onUPnPResponse.apply(undefined, [new UPnPError('XmlHttpRequest expected 200 OK. Received ' + this.status + ' response.'), null]);

                    self.debugLog("[ERROR-RESPONSE] " + this.responseText);

                    //xhrManager.release(xhr);

                    return;

                }

                self.debugLog("[SUCCESS-RESPONSE] " + this.responseText);

                onUPnPResponse.apply(this, [null, this]);

                //xhrManager.release(xhr);

            };

            xhr.send(upnpRequestXML);

        } catch (e) {

            onUPnPResponse.apply(undefined, [new UPnPError(e), null]);

        }

        return this; // allow method chaining

    };

    WinJSContrib.UPnP.UPnPService.prototype.handleResponse = function (upnpActionName, upnpResponseXML, parameters, onUPnPResolved) {

        parameters = this.formatParameters(parameters);

        var svcOutParams = parameters['response'];

        var responseJSON = {};

        // Process all XML response variables
        var responseContainer = upnpResponseXML.getElementsByTagName ?
                                  upnpResponseXML.getElementsByTagName(upnpActionName + "Response") : null;

        // If we don't have any response variables, try again with the namespace attached (required for lib to work in Firefox)
        if (responseContainer === null || responseContainer.length <= 0) {
            responseContainer = upnpResponseXML.getElementsByTagName ?
                                      upnpResponseXML.getElementsByTagName("u:" + upnpActionName + "Response") : null;
        }

        if (responseContainer !== null && responseContainer.length > 0) {

            var responseVars = responseContainer[0].childNodes;

            if (responseVars && responseVars.length > 0) {

                for (var i = 0, l = responseVars.length; i < l; i++) {

                    var varName = responseVars[i].nodeName;
                    var varVal = responseVars[i].firstChild ? trim(decodeXML(responseVars[i].firstChild.nodeValue + "")) : null;

                    // Perform type checking sanitization if requested
                    if (svcOutParams[varName] && svcOutParams[varName]['type'] !== undefined && svcOutParams[varName]['type'] !== null) {

                        // get the primitive sanitization function
                        var typeCheck = this.types[svcOutParams[varName]['type']];

                        if (typeCheck) {
                            varVal = typeCheck(varVal, svcOutParams[varName]['allowedValueList'] || null, true);
                        }

                    }

                    responseJSON[varName] = (varVal !== undefined && varVal !== null) ? varVal : "";

                }

            }

        }

        // Fire callback with the parsed action response data
        onUPnPResolved.apply(undefined, [null, { data: responseJSON }]);

        return this; // allow method chaining

    };

    WinJSContrib.UPnP.UPnPService.prototype.formatParameter = function (parameter) {

        var param = {};

        if (parameter['type'] !== undefined || parameter['value'] !== undefined || parameter['allowedValueList'] !== undefined) {

            param = parameter;

            if (parameter['allowedValueList'] !== undefined && typeof parameter['allowedValueList'] !== 'array') {
                parameter['allowedValueList'] = [];
            }

        } else {

            param = { value: parameter };

        }

        // check type is valid, otherwise discard requested type
        if (param['type'] !== undefined && param['type'] !== null) {

            if (!this.types[(param['type'] + "")]) {

                delete param['type'];

            }

        }

        return param;

    };

    // Normalize the input parameters argument
    WinJSContrib.UPnP.UPnPService.prototype.formatParameters = function (parameters) {

        if (parameters === undefined || parameters === null) {
            parameters = {};
        }

        if (!parameters['request']) {
            parameters['request'] = {};
        }

        if (!parameters['response']) {
            parameters['response'] = {};
        }

        for (var param in parameters) {

            if (param === 'request' || param === 'response') {

                for (var processParam in parameters[param]) {

                    parameters[param][processParam] = this.formatParameter(parameters[param][processParam]);

                }

            } else { // append as 'request' parameter and remove from root object

                parameters['request'][param] = this.formatParameter(parameters[param]);

                delete parameters[param];

            }

        }

        return parameters;

    };

    // ALLOWED VALUE LIST CHECKER

    WinJSContrib.UPnP.UPnPService.prototype.checkAllowedValues = function (val, allowedValueList) {

        // Check against allowedValues if provided
        if (val && allowedValueList && Object.prototype.toString.call(allowedValueList) == '[object Array]') {

            var matchFound = false;

            for (var i = 0, l = allowedValueList.length; i < l; i++) {

                if (val == allowedValueList[i]) {

                    matchFound = true;
                    break;

                }
            }

            if (!matchFound) {
                return "";
            }
        }

        return val;

    };

    // UPnP DEBUGGER

    WinJSContrib.UPnP.UPnPService.prototype.debugLog = function (msg, level) {
        if ((this.options && this.options.debug)) {
            console[level || 'log']("Plug.UPnP: " + msg);
        }
    };

    // UPnP ERROR OBJECT

    var UPnPError = function (description) {
        return {
            'description': description
        };
    };

    function parseXML(text) {
        return (new DOMParser()).parseFromString(text, "text/xml");
    }

    // *** CUSTOM TYPE FUNCTIONS ***

    // BASE64 FUNCTIONS
    // (forked from https://github.com/dankogai/js-base64/blob/master/base64.js)

    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var b64tab = (function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    })(b64chars);

    var cb_encode = function (ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };

    var cb_decode = function (cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
              | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
              | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
              | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [
                String.fromCharCode(n >>> 16),
                String.fromCharCode((n >>> 8) & 0xff),
                String.fromCharCode(n & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };

    var btoa = global.btoa || function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };

    var atob = global.atob || function (a) {
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };

    // HEX FUNCTIONS

    var hexChars = '0123456789abcdef';

    var hextab = (function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[i] = bin.charAt(i);
        return t;
    })(hexChars);

    function toHex(n) {
        var result = ''
        var start = true;
        for (var i = 32; i > 0;) {
            i -= 4;
            var digit = (n >> i) & 0xf;
            if (!start || digit != 0) {
                start = false;
                result += hextab[digit];
            }
        }
        return (result == '' ? '0' : result);
    }

    function pad(str, len, pad) {
        var result = str;
        for (var i = str.length; i < len; i++) {
            result = pad + result;
        }
        return result;
    }

    function ntos(n) {
        n = n.toString(16);
        if (n.length == 1) n = "0" + n;
        n = "%" + n;
        return unescape(n);
    }

    function htoa(str) {
        str = str.toUpperCase().replace(new RegExp("s/[^0-9A-Z]//g"));
        var result = "";
        var nextchar = "";
        for (var i = 0; i < str.length; i++) {
            nextchar += str.charAt(i);
            if (nextchar.length == 2) {
                result += ntos(parseInt(nextchar, 16));
                nextchar = "";
            }
        }
        return result;
    }

    function atoh(str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
            result += pad(toHex(str.charCodeAt(i) & 0xff), 2, '0');
        }
        return result;
    }

    // NUMBER FUNCTIONS

    function expandExponential(str) {
        return str.replace(/^([+-])?(\d+).?(\d*)[eE]([-+]?\d+)$/, function (x, s, n, f, c) {
            var l = +c < 0, i = n.length + +c, x = (l ? n : f).length,
            c = ((c = Math.abs(c)) >= x ? c - x + l : 0),
            z = (new Array(c + 1)).join("0"), r = n + f;
            return (s || "") + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? "." + r.substr(i) : "");
        });
    };

    // STRING FUNCTIONS

    var trim = function (str) {
        if (String.prototype.trim) {
            return str.trim();
        } else {
            return str.replace(/^\s+|\s+$/g, "");
        }
    };

    var encodeXML = function (str) {
        return str.replace(/\&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/'/g, '&#39;')
                   .replace(/"/g, '&quot;');
    };

    var decodeXML = function (str) {
        return str.replace(/\&quot;/g, '"')
                   .replace(/\&\#39;/g, '\'')
                   .replace(/\&gt;/g, '>')
                   .replace(/\&lt;/g, '<')
                   .replace(/\&amp;/g, '&');
    };

    /**
     * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
     * © 2011 Colin Snover <http://zetafleet.com>
     * Released under MIT license.
     *
     * 2012 - Modifications to accept times without dates - by Rich Tibbett
     */

    var parseDate = function (date) {
        var timestamp, struct, minutesOffset = 0, numericKeys = [1, 4, 5, 6, 7, 10, 11];

        if (typeof date !== 'string') date += "";

        if ((struct = /^((\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:[T\s]?(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{4}))?)?$/.exec(date))) {

            struct = struct.slice(1, struct.length);

            // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
            for (var i = 0, k; (k = numericKeys[i]) ; ++i) {
                struct[k] = +struct[k] || 0;
            }

            // allow undefined days and months
            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;

            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                minutesOffset = ((struct[10] / 100) - ((struct[10] / 100) % 1)) * 60 + (struct[10] % 100);

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
        }
        else {
            timestamp = Date.parse ? Date.parse(date) : NaN;
        }

        return timestamp;
    };

    var allowedContentDirectoryTypes = {
        'urn:schemas-upnp-org:service:ContentDirectory:1': true,
        'urn:schemas-upnp-org:service:ContentDirectory:2': true,
        'urn:schemas-upnp-org:service:ContentDirectory:3': true,
        'urn:schemas-upnp-org:service:ContentDirectory:4': true
    };

    WinJSContrib.UPnP.UPnPContentDirectory = function (serviceObj, opts) {

        WinJSContrib.UPnP.UPnPService.apply(this, [serviceObj, opts]);

        this.upnpType = serviceObj.serviceType;
        //if (serviceObj.type.indexOf('upnp:') === 0) {
        //    this.upnpType = this.upnpType.replace('upnp:', '');
        //}

        if (!allowedContentDirectoryTypes[this.upnpType]) {
            console.error("Provided service is not a UPnP Media Server Service");
            return;
        }

        // *** ContentDirectory:1 methods

        this.getSystemUpdateId = function (callback) {

            return this.action('GetSystemUpdateID', {
                request: {},
                response: {
                    Id: {
                        type: this.types.ui4
                    }
                }
            }, callback);

        };

        this.getSearchCapabilities = function (callback) {

            return this.action('GetSearchCapabilities', {
                request: {},
                response: {
                    SearchCaps: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getSortCapabilities = function (callback) {

            return this.action('GetSortCapabilities', {
                request: {},
                response: {
                    SortCaps: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.browse = function (objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria, callback) {

            return this.action('Browse', {
                request: {
                    ObjectID: {
                        value: objectId || '0',
                        type: this.types.string
                    },
                    BrowseFlag: {
                        value: browseFlag || 'BrowseDirectChildren',
                        type: this.types.string
                    },
                    Filter: {
                        value: filter || '*',
                        type: this.types.string
                    },
                    StartingIndex: {
                        value: startingIndex || '0',
                        type: this.types.ui4
                    },
                    RequestedCount: {
                        value: requestedCount || '0',
                        type: this.types.ui4
                    },
                    SortCriteria: {
                        value: sortCriteria,
                        type: this.types.string
                    }
                },
                response: {
                    Result: {
                        type: this.types.xmlObj
                    },
                    NumberReturned: {
                        type: this.types.ui4
                    },
                    TotalMatches: {
                        type: this.types.ui4
                    },
                    UpdateID: {
                        type: this.types.ui4
                    }
                }
            }, callback);

        };

        this.search = function (objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria, callback) {

            return this.action('Search', {
                request: {
                    ObjectID: {
                        value: objectId || '0',
                        type: this.types.string
                    },
                    BrowseFlag: {
                        value: browseFlag || 'BrowseDirectChildren',
                        type: this.types.string
                    },
                    Filter: {
                        value: filter || '*',
                        type: this.types.string
                    },
                    StartingIndex: {
                        value: startingIndex || '0',
                        type: this.types.ui4
                    },
                    RequestedCount: {
                        value: requestedCount || '0',
                        type: this.types.ui4
                    },
                    SortCriteria: {
                        value: sortCriteria,
                        type: this.types.string
                    }
                },
                response: {
                    Result: {
                        type: this.types.xmlObj
                    },
                    NumberReturned: {
                        type: this.types.ui4
                    },
                    TotalMatches: {
                        type: this.types.ui4
                    },
                    UpdateID: {
                        type: this.types.ui4
                    }
                }
            }, callback);

        };


        // *** ContentDirectory:2 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:ContentDirectory:2') {

            // TODO: GetFeatureList, GetSortExtensionCapabilities, MoveObject

        }


        // *** ContentDirectory:3 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:ContentDirectory:3') {

            // TODO

        }

        // *** ContentDirectory:4 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:ContentDirectory:4') {
            // TODO
        }
    };
    WinJSContrib.UPnP.UPnPContentDirectory.prototype = Object.create(WinJSContrib.UPnP.UPnPService.prototype);

    var allowedConnectionManagerTypes = {
        'urn:schemas-upnp-org:service:ConnectionManager:1': true,
        'urn:schemas-upnp-org:service:ConnectionManager:2': true,
        'urn:schemas-upnp-org:service:ConnectionManager:3': true
    };

    WinJSContrib.UPnP.UPnPConnectionManager = function (serviceObj, opts) {

        WinJSContrib.UPnP.UPnPService.apply(this, [serviceObj, opts]);

        this.upnpType = serviceObj.serviceType;
        //if (serviceObj.type.indexOf('upnp:') === 0) {
        //    this.upnpType = this.upnpType.replace('upnp:', '');
        //}

        if (!allowedConnectionManagerTypes[this.upnpType]) {
            console.error("Provided service is not a UPnP Service");
            return;
        }

        // *** ConnectionManager:1 methods

        this.getCurrentConnectionIDs = function (callback) {

            return this.action('GetCurrentConnectionIDs', {
                request: {},
                response: {
                    ConnectionIDs: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getCurrentConnectionInfo = function (connectionId, callback) {

            return this.action('GetCurrentConnectionInfo', {
                request: {
                    ConnectionID: {
                        value: connectionId,
                        type: this.types.ui4
                    }
                },
                response: {
                    RcsID: {
                        type: this.types.i4
                    },
                    AVTransportID: {
                        type: this.types.i4
                    },
                    ProtocolInfo: {
                        type: this.types.string
                    },
                    PeerConnectionManager: {
                        type: this.types.string
                    },
                    PeerConnectionID: {
                        type: this.types.i4
                    },
                    Direction: {
                        type: this.types.string
                    },
                    Status: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getProtocolInfo = function (callback) {

            return this.action('GetProtocolInfo', {
                request: {},
                response: {
                    Source: {
                        type: this.types.string
                    },
                    Sink: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        // *** ConnectionManager:2 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:ConnectionManager:2') {
            // TODO
        }

    };

    WinJSContrib.UPnP.UPnPConnectionManager.prototype = Object.create(WinJSContrib.UPnP.UPnPService.prototype);

    var allowedAVTransportTypes = {
        'urn:schemas-upnp-org:service:AVTransport:1': true,
        'urn:schemas-upnp-org:service:AVTransport:2': true
    };

    WinJSContrib.UPnP.UPnPAVTransport = function (serviceObj, opts) {

        WinJSContrib.UPnP.UPnPService.apply(this, [serviceObj, opts]);

        this.upnpType = serviceObj.serviceType;
        //if (serviceObj.type.indexOf('upnp:') === 0) {
        //    this.upnpType = this.upnpType.replace('upnp:', '');
        //}

        if (!allowedAVTransportTypes[this.upnpType]) {
            console.error("Provided service is not a UPnP Media Renderer Service");
            return;
        }

        // *** AVTransport:1 methods

        this.getDeviceCapabilities = function (instanceId, callback) {

            return this.action('GetDeviceCapabilities', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    PlayMedia: {
                        type: this.types.string
                    },
                    RecMedia: {
                        type: this.types.string
                    },
                    RecQualityModes: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getMediaInfo = function (instanceId, callback) {

            return this.action('GetMediaInfo', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    NrTracks: {
                        type: this.types.ui4
                    },
                    MediaDuration: {
                        type: this.types.string
                    },
                    CurrentURI: {
                        type: this.types.string
                    },
                    CurrentURIMetaData: {
                        type: this.types.string
                    },
                    NextURI: {
                        type: this.types.string
                    },
                    NextURIMetaData: {
                        type: this.types.string
                    },
                    PlayMedium: {
                        type: this.types.string
                    },
                    RecordMedium: {
                        type: this.types.string
                    },
                    WriteStatus: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getPositionInfo = function (instanceId, callback) {

            return this.action('GetPositionInfo', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    Track: {
                        type: this.types.ui4
                    },
                    TrackDuration: {
                        type: this.types.string
                    },
                    TrackMetaData: {
                        type: this.types.xmlObj
                    },
                    TrackURI: {
                        type: this.types.string
                    },
                    RelTime: {
                        type: this.types.string
                    },
                    AbsTime: {
                        type: this.types.string
                    },
                    RelCount: {
                        type: this.types.i4
                    },
                    AbsCount: {
                        type: this.types.i4
                    }
                }
            }, callback);

        };

        this.getTransportInfo = function (instanceId, callback) {

            return this.action('GetTransportInfo', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentTransportState: {
                        type: this.types.string
                    },
                    CurrentTransportStatus: {
                        type: this.types.string
                    },
                    CurrentSpeed: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getTransportSettings = function (instanceId, callback) {

            return this.action('GetTransportSettings', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    PlayMode: {
                        type: this.types.ui4
                    },
                    RecQualityMode: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.setAVTransportURI = function (instanceId, currentURI, currentURIMetaData, callback) {

            return this.action('SetAVTransportURI', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    CurrentURI: {
                        value: currentURI,
                        type: this.types.string
                    },
                    CurrentURIMetaData: {
                        value: currentURIMetaData,
                        type: this.types.string
                    }
                },
                response: {}
            }, callback);

        };

        this.play = function (instanceId, speed, callback) {

            return this.action('Play', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Speed: {
                        value: speed || '1',
                        type: this.types.string
                    }
                },
                response: {}
            }, callback);

        };

        this.pause = function (instanceId, callback) {

            return this.action('Pause', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {}
            }, callback);

        };

        this.stop = function (instanceId, callback) {

            return this.action('Stop', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {}
            }, callback);

        };

        this.next = function (instanceId, callback) {

            return this.action('Next', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {}
            }, callback);

        };

        this.previous = function (instanceId, callback) {

            return this.action('Previous', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {}
            }, callback);

        };

        this.seek = function (instanceId, unit, target, callback) {

            return this.action('Seek', {
                request: {
                    InstanceID: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Unit: {
                        value: unit,
                        type: this.types.string
                    },
                    Target: {
                        value: target,
                        type: this.types.string
                    }
                },
                response: {}
            }, callback);

        };

        // *** AVTransport:2 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:AVTransport:2') {

            // TODO

        }
    };
    WinJSContrib.UPnP.UPnPAVTransport.prototype = Object.create(WinJSContrib.UPnP.UPnPService.prototype);

    var allowedRenderingControlTypes = {
        'urn:schemas-upnp-org:service:RenderingControl:1': true,
        'urn:schemas-upnp-org:service:RenderingControl:2': true,
        'urn:schemas-upnp-org:service:RenderingControl:3': true
    };

    WinJSContrib.UPnP.UPnPRenderingControl = function (serviceObj, opts) {

        WinJSContrib.UPnP.UPnPService.apply(this, [serviceObj, opts]);

        this.upnpType = serviceObj.serviceType;
        //if (serviceObj.type.indexOf('upnp:') === 0) {
        //    this.upnpType = this.upnpType.replace('upnp:', '');
        //}

        if (!allowedRenderingControlTypes[this.upnpType]) {
            console.error("Provided service is not a UPnP Media Renderer Service");
            return;
        }

        // *** RenderingControl:1 methods

        this.listPresets = function (instanceId, callback) {

            return this.action('ListPresets', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentPresetNameList: {
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.selectPreset = function (instanceId, presetName, callback) {

            return this.action('SelectPreset', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    PresetName: {
                        value: presetName || "FactoryDefaults",
                        type: this.types.string
                    }
                }
            }, callback);

        };

        this.getBrightness = function (instanceId, callback) {

            return this.action('GetBrightness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentBrightness: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setBrightness = function (instanceId, desiredBrightness, callback) {

            return this.action('SetBrightness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredBrightness: {
                        value: desiredBrightness,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getContrast = function (instanceId, callback) {

            return this.action('GetContrast', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentContrast: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setContrast = function (instanceId, desiredContrast, callback) {

            return this.action('SetContrast', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredContrast: {
                        value: desiredContrast,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getSharpness = function (instanceId, callback) {

            return this.action('GetSharpness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentSharpness: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setSharpness = function (instanceId, desiredSharpness, callback) {

            return this.action('SetSharpness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredSharpness: {
                        value: desiredSharpness,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getRedVideoGain = function (instanceId, callback) {

            return this.action('GetRedVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentRedVideoGain: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setRedVideoGain = function (instanceId, desiredRedVideoGain, callback) {

            return this.action('SetRedVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredRedVideoGain: {
                        value: desiredRedVideoGain,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getGreenVideoGain = function (instanceId, callback) {

            return this.action('GetGreenVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentGreenVideoGain: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setGreenVideoGain = function (instanceId, desiredGreenVideoGain, callback) {

            return this.action('SetGreenVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredGreenVideoGain: {
                        value: desiredGreenVideoGain,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getBlueVideoGain = function (instanceId, callback) {

            return this.action('GetBlueVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentBlueVideoGain: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setBlueVideoGain = function (instanceId, desiredBlueVideoGain, callback) {

            return this.action('SetBlueVideoGain', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredBlueVideoGain: {
                        value: desiredBlueVideoGain,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getRedVideoBlackLevel = function (instanceId, callback) {

            return this.action('GetRedVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentRedVideoBlackLevel: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setRedVideoBlackLevel = function (instanceId, desiredRedVideoBlackLevel, callback) {

            return this.action('SetRedVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredRedVideoBlackLevel: {
                        value: desiredRedVideoBlackLevel,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getGreenVideoBlackLevel = function (instanceId, callback) {

            return this.action('GetGreenVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentGreenVideoBlackLevel: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setGreenVideoBlackLevel = function (instanceId, desiredGreenVideoBlackLevel, callback) {

            return this.action('SetGreenVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredGreenVideoBlackLevel: {
                        value: desiredGreenVideoBlackLevel,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getBlueVideoBlackLevel = function (instanceId, callback) {

            return this.action('GetBlueVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentBlueVideoBlackLevel: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setBlueVideoBlackLevel = function (instanceId, desiredBlueVideoBlackLevel, callback) {

            return this.action('SetBlueVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredBlueVideoBlackLevel: {
                        value: desiredBlueVideoBlackLevel,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getBlueVideoBlackLevel = function (instanceId, callback) {

            return this.action('GetBlueVideoBlackLevel', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentBlueVideoBlackLevel: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getColorTemperature = function (instanceId, callback) {

            return this.action('GetColorTemperature', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentColorTemperature: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setColorTemperature = function (instanceId, desiredColorTemperature, callback) {

            return this.action('SetColorTemperature', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredColorTemperature: {
                        value: desiredColorTemperature,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getHorizontalKeystone = function (instanceId, callback) {

            return this.action('GetHorizontalKeystone', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentHorizontalKeystone: {
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.setHorizontalKeystone = function (instanceId, desiredHorizontalKeystone, callback) {

            return this.action('SetHorizontalKeystone', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredHorizontalKeystone: {
                        value: desiredHorizontalKeystone,
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.getVerticalKeystone = function (instanceId, callback) {

            return this.action('GetVerticalKeystone', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    }
                },
                response: {
                    CurrentVerticalKeystone: {
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.setVerticalKeystone = function (instanceId, desiredVerticalKeystone, callback) {

            return this.action('SetVerticalKeystone', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    DesiredVerticalKeystone: {
                        value: desiredVerticalKeystone,
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.getMute = function (instanceId, channel, callback) {

            return this.action('GetMute', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    }
                },
                response: {
                    CurrentMute: {
                        type: this.types.boolean
                    }
                }
            }, callback);

        };

        this.setMute = function (instanceId, channel, desiredMute, callback) {

            return this.action('SetMute', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    },
                    DesiredMute: {
                        value: desiredMute,
                        type: this.types.boolean
                    }
                }
            }, callback);

        };

        this.getVolume = function (instanceId, channel, callback) {

            return this.action('GetVolume', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    }
                },
                response: {
                    CurrentVolume: {
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.setVolume = function (instanceId, channel, desiredVolume, callback) {

            return this.action('SetVolume', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    },
                    DesiredVolume: {
                        value: desiredVolume,
                        type: this.types.ui2
                    }
                }
            }, callback);

        };

        this.getVolumeDB = function (instanceId, channel, callback) {

            return this.action('GetVolumeDB', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    }
                },
                response: {
                    CurrentVolume: {
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.setVolumeDB = function (instanceId, channel, desiredVolume, callback) {

            return this.action('SetVolumeDB', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    },
                    DesiredVolume: {
                        value: desiredVolume,
                        type: this.types.i2
                    }
                }
            }, callback);

        };

        this.getVolumeDBRange = function (instanceId, channel, callback) {

            return this.action('GetVolumeDBRange', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    }
                },
                response: {
                    MinValue: {
                        type: this.types.i2
                    },
                    MaxValue: {
                        type: this.types.i2
                    },
                }
            }, callback);

        };

        this.getLoudness = function (instanceId, channel, callback) {

            return this.action('GetLoudness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    }
                },
                response: {
                    CurrentLoudness: {
                        type: this.types.boolean
                    }
                }
            }, callback);

        };

        this.setLoudness = function (instanceId, channel, desiredLoudness, callback) {

            return this.action('SetLoudness', {
                request: {
                    InstanceId: {
                        value: instanceId,
                        type: this.types.ui4
                    },
                    Channel: {
                        value: channel || 'Master',
                        type: this.types.string
                    },
                    DesiredLoudness: {
                        value: desiredLoudness,
                        type: this.types.boolean
                    }
                }
            }, callback);

        };

        // *** RenderingControl:2 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:RenderingControl:2' ||
              this.upnpType === 'urn:schemas-upnp-org:service:RenderingControl:3') {

            this.getStateVariables = function (instanceId, stateVariableList, callback) {

                return this.action('GetStateVariables', {
                    request: {
                        InstanceId: {
                            value: instanceId,
                            type: this.types.ui4
                        },
                        StateVariableList: {
                            value: stateVariableList,
                            type: this.types.string
                        }
                    },
                    response: {
                        StateVariableValuePairs: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.setStateVariables = function (instanceId, renderingControlUDN, serviceType, serviceId, stateVariableValuePairs, callback) {

                return this.action('SetStateVariables', {
                    request: {
                        InstanceId: {
                            value: instanceId,
                            type: this.types.ui4
                        },
                        RenderingControlUDN: {
                            value: renderingControlUDN,
                            type: this.types.string
                        },
                        ServiceType: {
                            value: serviceType,
                            type: this.types.string
                        },
                        ServiceId: {
                            value: serviceId,
                            type: this.types.string
                        },
                        StateVariableValuePairs: {
                            value: stateVariableValuePairs,
                            type: this.types.string
                        }
                    },
                    response: {
                        StateVariableList: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

        }

        // *** RenderingControl:3 methods

        if (this.upnpType === 'urn:schemas-upnp-org:service:RenderingControl:3') {

            this.getAllowedTransforms = function (instanceId, callback) {

                return this.action('GetAllowedTransforms', {
                    request: {
                        InstanceId: {
                            value: instanceId,
                            type: this.types.ui4
                        }
                    },
                    response: {
                        CurrentAllowedTransformSettings: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.getTransforms = function (instanceId, callback) {

                return this.action('GetTransforms', {
                    request: {
                        InstanceId: {
                            value: instanceId,
                            type: this.types.ui4
                        }
                    },
                    response: {
                        CurrentTransformValues: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.setTransforms = function (instanceId, desiredTransformValues, callback) {

                return this.action('SetTransforms', {
                    request: {
                        InstanceId: {
                            value: instanceId,
                            type: this.types.ui4
                        },
                        DesiredTransformValues: {
                            value: desiredTransformValues,
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.getAllAvailableTransforms = function (instanceId, callback) {

                return this.action('GetAllAvailableTransforms', {
                    response: {
                        AllAllowedTransformSettings: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.getAllowedDefaultTransforms = function (instanceId, callback) {

                return this.action('GetAllowedDefaultTransforms', {
                    response: {
                        AllowedDefaultTransformSettings: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.getDefaultTransforms = function (instanceId, callback) {

                return this.action('GetDefaultTransforms', {
                    response: {
                        CurrentDefaultTransformSettings: {
                            type: this.types.string
                        }
                    }
                }, callback);

            };

            this.setDefaultTransforms = function (instanceId, desiredDefaultTransformSettings, callback) {

                return this.action('SetDefaultTransforms', {
                    request: {
                        DesiredDefaultTransformSettings: {
                            value: desiredDefaultTransformSettings,
                            type: this.types.string
                        }
                    }
                }, callback);

            };

        }

    };
    WinJSContrib.UPnP.UPnPRenderingControl.prototype = Object.create(WinJSContrib.UPnP.UPnPService.prototype);

})(window);
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib;
(function (WinJSContrib) {
    'use strict';

    /**
     * Custom WinJS Bindings
     * @namespace WinJSContrib.Bindings
     */
    (function (Bindings) {

        /**
         * path for default picture
         */
        WinJSContrib.Bindings.pictureUnavailable = '/images/unavailable.png';

        /**
         * Helper for reading arguments for an element
         * @param {HTMLElement} element
         * @param {string} argument name
         */
        WinJSContrib.Bindings.bindingArguments = function bindingArguments(elt, argname) {
            var data;
            if (WinJS.UI._optionsParser) {
                var text = elt.getAttribute("data-win-bind-args");
                if (text) {
                    data = WinJS.UI.optionsParser(text, window);
                }
            } else {
                data = elt.dataset.winBindArgs;
            }

            if (data) {
                if (argname) {
                    return data[argname];
                } else {
                    return data;
                }
            }
        };
        var bindingArguments = WinJSContrib.Bindings.bindingArguments;

        /**
         * Binding function to remove HTML from data and add it to destination
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.removeHTML = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var elt = document.createElement('DIV');
            elt.innerHTML = data;
            WinJS.Binding.oneTime({ value: elt.innerText }, ['value'], dest, [destProperty]);
        });

        /**
         * Binding function to remove HTML from data and add it to destination with an ellipse after X characters. The number of characters is specified with "ellipsisize" argument
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.removeHTMLAndEllipsisize = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var elt = document.createElement('DIV');
            elt.innerHTML = data;
            var textRes = elt.innerText;
            var size = bindingArguments(dest, 'ellipsisize');

            if (size)
                textRes = toStaticHTML(WinJSContrib.Utils.ellipsisizeString(elt.innerText, size, true));
            WinJS.Binding.oneTime({ value: textRes }, ['value'], dest, [destProperty]);
        });

        /**
         * Binding function to remove HTML from data and add it to destination with an ellipse after X characters. The number of characters is specified with "ellipsisize" argument
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.staticHTML = WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            dest[destProperty] = toStaticHTML(data);
        });

        /**
         * Binding function to add a data-* attribute to the element. Use the destination name to specifiy attribute name
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         * @example
         * //assuming object is { myproperty: 42 }
         * <div data-win-bind="foo : myproperty WinJSContrib.Bindings.dataAttr"></div>
         * //will result to
         * <div data-foo="42" data-win-bind="foo : myproperty WinJSContrib.Bindings.dataAttr"></div>
         */
        WinJSContrib.Bindings.dataAttr = WinJS.Binding.initializer(function dataAttrBinding(source, sourceProperty, dest, destProperty) {
        	var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
        	dest.setAttribute('data-' + destProperty, data)
        });

        /**
         * Binding function to add css class named after object property. You could format class by using a "format" argument
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.addClass = WinJS.Binding.initializer(function addClassBinding(source, sourceProperty, dest, destProperty) {
            function setClass(newval, oldval) {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                var formatParameter = bindingArguments(dest, 'format');
                if (formatParameter) {
                    dest.classList.remove(formatParameter.format(oldval));
                    dest.classList.add(formatParameter.format(data));
                }
                else {
                    dest.classList.remove(oldval);
                    dest.classList.add(data);
                }
            }

            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * add css class based on a prefix defined with destProperty and the value from the source object
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.asClass = WinJS.Binding.initializer(function asClassBinding(source, sourceProperty, dest, destProperty) {
            function setClass(newval, oldval) {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                dest.classList.remove(destProperty + '-' + oldval);
                dest.classList.add(destProperty + '-' + data);
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * add css class based on truthy/falsy value from the source object
         * css class has to be precised through data-win-bind-args='{"className": ""}' attribute
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.showClassIf = WinJS.Binding.initializer(function showClassIfBinding(source, sourceProperty, dest, destProperty) {
            function setClass(newval, oldval) {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                var className = bindingArguments(dest, 'className');
                dest.classList.remove(className);
                if (data)
                    dest.classList.add(className);
            }
            var bindingDesc = {};
            bindingDesc[sourceProperty] = setClass;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * convert a url string for use as a background image url
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.toBgImage = WinJS.Binding.initializer(function toBgImageBinding(source, sourceProperty, dest, destProperty) {
            function setImage() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data || !data.length) {
                    dest.style.backgroundImage = '';
                    return;
                }
                dest.style.backgroundImage = 'url("' + data + '")';
            }

            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setImage;
            return WinJS.Binding.bind(source, bindingDesc);
        });


        WinJSContrib.Bindings.ToRealDate = WinJS.Binding.initializer(function ToRealDateBinding(source, sourceProperty, dest, destProperty) {
            var date = new Date(source.date * 1000);
            dest.innerHTML = date.toLocaleDateString();
        });

        function _setPic(dest, url) {
            if (dest.nodeName.toLowerCase() == 'img') {
                dest.src = url;
            }
            else {
                dest.style.backgroundImage = 'url("' + url + '")';
            }
            dest.classList.add('imageLoaded');
        }

        /**
         * Asynchronously load a picture (using src for image tag and background-image for other elements) from url path, and add 'imageLoaded' css class once picture is ready. 
         * You could rely on '.imageLoaded' to add transitions for image loading
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.picture = WinJS.Binding.initializer(function toSmartBgImageBinding(source, sourceProperty, dest, destProperty) {
            function setImage() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data || !data.length) {
                    data = Bindings.pictureUnavailable;
                }

                dest.classList.remove('imageLoaded');
                setTimeout(function () {
                    WinJSContrib.UI.loadImage(data).done(function () {
                        _setPic(dest, data);
                    }, function () {
                        _setPic(dest, Bindings.pictureUnavailable);
                        WinJS.Utilities.addClass(dest, 'imageLoaded');
                    });
                }, 200);
            }

            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setImage;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        WinJSContrib.Bindings.toSmartBgImage = WinJSContrib.Bindings.picture; //deprecated method name

        /**
         * show element if property is filled or true. The dest property can be used to choose what to use for showing/hiding object (opacity, visibility, or display)
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.showIf = WinJS.Binding.initializer(function hideUndefined(source, sourceProperty, dest, destProperty) {
            function setVisibility() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data) {
                    dest.classList.remove('mcn-show');
                    dest.classList.add('mcn-hide');
                    if (destProperty[0] === 'opacity' || destProperty[1] === 'opacity') {
                        dest.style.opacity = '0';
                    } else if (destProperty[0] === 'visibility' || destProperty[1] === 'visibility') {
                        dest.style.visibility = 'hidden';
                    } else {
                        dest.style.display = 'none';
                    }
                } else {
                    dest.classList.remove('mcn-hide');
                    dest.classList.add('mcn-show');
                    if (destProperty[0] === 'opacity' || destProperty[1] === 'opacity') {
                        dest.style.opacity = '';
                    } else if (destProperty[0] === 'visibility' || destProperty[1] === 'visibility') {
                        dest.style.visibility = '';
                    } else {
                        dest.style.display = '';
                    }
                }
            }
            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setVisibility;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * Alias for {@link WinJSContrib.Bindings.showIf}, just for semantic purpose
         * @function
         * @see WinJSContrib.Bindings.showIf
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.hideIfNot = WinJSContrib.Bindings.showIf;
        WinJSContrib.Bindings.hideIfNotDefined = WinJSContrib.Bindings.showIf;//warning, deprecated

        /**
         * hide element if property is filled or true. The dest property can be used to choose what to use for showing/hiding object (opacity, visibility, or display)
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.hideIf = WinJS.Binding.initializer(function showUndefined(source, sourceProperty, dest, destProperty) {
            function setVisibility() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data) {
                    dest.classList.remove('mcn-hide');
                    dest.classList.add('mcn-show');
                    if (destProperty[0] === 'opacity' || destProperty[1] === 'opacity') {
                        dest.style.opacity = '';
                    } else if (destProperty[0] === 'visibility' || destProperty[1] === 'visibility') {
                        dest.style.visibility = '';
                    } else {
                        dest.style.display = '';
                    }
                } else {
                    dest.classList.remove('mcn-show');
                    dest.classList.add('mcn-hide');
                    if (destProperty[0] === 'opacity' || destProperty[1] === 'opacity') {
                        dest.style.opacity = '0';
                    } else if (destProperty[0] === 'visibility' || destProperty[1] === 'visibility') {
                        dest.style.visibility = 'hidden';
                    } else {
                        dest.style.display = 'none';
                    }
                }
            }
            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setVisibility;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * Alias for {@link WinJSContrib.Bindings.hideIf}, just for semantic purpose
         * @function
         * @see WinJSContrib.Bindings.hideIf
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.showIfNot = WinJSContrib.Bindings.hideIf; //warning, deprecated

        WinJSContrib.Bindings.showIfNotDefined = WinJSContrib.Bindings.hideIf; //warning, deprecated

        /**
         * enable element if property is filled or true
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.enableIf = WinJS.Binding.initializer(function disableUndefined(source, sourceProperty, dest, destProperty) {
            function setVisibility() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data) {
                    dest.disabled = true;
                } else {
                    dest.disabled = false;
                }
            }
            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setVisibility;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        WinJSContrib.Bindings.disableIfNot = WinJSContrib.Bindings.enableIf;

        /**
         * disable element if property is filled or true
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.disableIf = WinJS.Binding.initializer(function enableUndefined(source, sourceProperty, dest, destProperty) {
            function setVisibility() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data) {
                    dest.disabled = false;
                } else {
                    dest.disabled = true;
                }
            }
            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setVisibility;
            return WinJS.Binding.bind(source, bindingDesc);
        });
        WinJSContrib.Bindings.enableIfNot = WinJSContrib.Bindings.disableIf;

        /**
         * apply a percent number as width (in percent) on the element
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.toWidth = WinJS.Binding.initializer(function progressToWidth(source, sourceProperty, dest, destProperty) {
            function setWidth() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (!data) {
                    dest.style.width = '';
                } else {
                    dest.style.width = data + '%';
                }
            }
            var bindingDesc = {
            };
            bindingDesc[sourceProperty] = setWidth;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * truncate a string and add ellipse to the text if string is longer than a limit. The max size of text is determined by a 'ellipsisize' argument
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         * @example {@lang xml}
         * <p data-win-bind="innerText : someLongText WinJSContrib.Bindings.ellipsisize" data-win-bind-args='{ "ellipsisize" : 50}'></p>
         */
        WinJSContrib.Bindings.ellipsisize = WinJS.Binding.initializer(function toEllipsisizedBinding(source, sourceProperty, dest, destProperty) {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            var size = bindingArguments(dest, 'ellipsisize');
            dest[destProperty] = toStaticHTML(WinJSContrib.Utils.ellipsisizeString(sourcedata, size, true));
        });
        WinJSContrib.Bindings.toEllipsisized = WinJSContrib.Bindings.ellipsisize; //deprecated name

        WinJSContrib.Bindings.emptyIfNull = WinJS.Binding.initializer(function emptyIfNull(source, sourceProperty, dest, destProperty) {
            var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (typeof data === "undefined" || data === null) {
                dest[destProperty] = "";
            } else {
                dest[destProperty] = data;
            }
        });


        /**
         * Two way binding triggered by "change" event on inputs
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.twoWayOnChange = WinJS.Binding.initializer(function twoWayOnChangeBinding(source, sourceProperty, dest, destProperty) {
            function setVal() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                WinJSContrib.Utils.writeProperty(dest, destProperty, data || '');
            }

            function getVal() {
                var val = WinJSContrib.Utils.getProperty(dest, destProperty);
                WinJSContrib.Utils.writeProperty(source, sourceProperty, val.propValue);
            }

            dest.addEventListener('change', getVal, false);
            if (!dest.winControl) {
                dest.classList.add('win-disposable');
                dest.winControl = {
                    dispose: function () {
                        dest.removeEventListener('change', getVal);
                    }
                };
            }

            var bindingDesc = {
            };

            bindingDesc[sourceProperty] = setVal;
            return WinJS.Binding.bind(source, bindingDesc);
        });

        /**
         * Add tap by looking for a function in parent scope control, and add binded item to tap callback
         * @function
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        WinJSContrib.Bindings.itemTap = WinJS.Binding.initializer(function twoWayOnChangeBinding(source, sourceProperty, dest, destProperty) {
            //defer tap binding to let element being appended to DOM
            setImmediate(function () {
                var scope = WinJSContrib.Utils.getScopeControl(dest);
                if (scope) {
                    var tapCallback = WinJSContrib.Utils.readProperty(scope, destProperty);
                    var lockpointer = dest.hasAttribute("lockpointer");
                    if (tapCallback && typeof tapCallback == "function") {
                        WinJSContrib.UI.tap(dest, function (arg) {
                            var item = WinJSContrib.Utils.readProperty(source, sourceProperty);                            
                            tapCallback.call(scope, { target : arg, detail: { element: arg, item: item } });
                        }, { lock: lockpointer });
                    }
                }
            });
        });

        /** 
         * cleans up a binding list by returning its items as non-observable 
         * @function 
         * @param {Object[]} bindingList binding list to clean up 
         * @returns {Object[]} array containing the cleaned up items 
         */
        Bindings.cleanUpBindingList = function (bindingList) {
            var result = [];

            bindingList.forEach(function (item) {
                var unwrappedItem = WinJS.Binding.unwrap(item);
                result.push(unwrappedItem);
            });

            return result;
        };


    })(WinJSContrib.Bindings || (WinJSContrib.Bindings = {}));
    var Bindings = WinJSContrib.Bindings;
})(WinJSContrib || (WinJSContrib = {}));

/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/// <reference path="WinJSContrib.binding.utils.js" />
/// <reference path="moment.min.js" />

var WinJSContrib;
WinJSContrib.Utils = WinJSContrib.Utils || {};
WinJSContrib.Bindings = WinJSContrib.Bindings || {};

(function () {
    'use strict';

    /** 
     * format date using binding argument 'formatDate'
     * @function
     * @param {Object} source object owning data
     * @param {string[]} sourceProperty path to object data
     * @param {HTMLElement} dest DOM element targeted by binding
     * @param {string[]} destProperty path to DOM element property targeted by binding
     */
    WinJSContrib.Bindings.formatDate = WinJS.Utilities.markSupportedForProcessing(function formatDateBinding(source, sourceProperty, dest, destProperty) {
        function setDate() {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                var arg = WinJSContrib.Bindings.bindingArguments(dest, 'formatDate') || 'L';
                dest.innerText = moment(sourcedata).format(arg);
            }
        }

        var bindingDesc = {
        };
        bindingDesc[sourceProperty] = setDate;
        return WinJS.Binding.bind(source, bindingDesc);
    });

    /** 
     * format date using calendar function
     * @function
     * @param {Object} source object owning data
     * @param {string[]} sourceProperty path to object data
     * @param {HTMLElement} dest DOM element targeted by binding
     * @param {string[]} destProperty path to DOM element property targeted by binding
     */
    WinJSContrib.Bindings.calendar = WinJS.Utilities.markSupportedForProcessing(function formatDateBinding(source, sourceProperty, dest, destProperty) {
        function setDate() {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                dest.innerText = moment(sourcedata).calendar();
            }
        }

        var bindingDesc = {
        };
        bindingDesc[sourceProperty] = setDate;
        return WinJS.Binding.bind(source, bindingDesc);
    });

    function daysSince(m, d, y) {
        if (d == '' || m == '' || y == '') {
            //alert("All fields must be entered");
            return;
        }

        if (isNaN(m) || isNaN(y) || isNaN(d)) {
            //alert("Only numbers .");
            return;
        }

        var myDate = new Date();
        var yourDate = new Date(y, m - 1, d);

        var secondsInADay = 1000 * 60 * 60 * 24;
        var diff = Math.floor((myDate.getTime() - yourDate.getTime()) / secondsInADay);
        return diff;
    }


    /**
     * display number of days since a date
     * @function
     * @param {Object} source object owning data
     * @param {string[]} sourceProperty path to object data
     * @param {HTMLElement} dest DOM element targeted by binding
     * @param {string[]} destProperty path to DOM element property targeted by binding
     */
    WinJSContrib.Bindings.daysSinceDate = WinJS.Utilities.markSupportedForProcessing(function daysSinceDateBinding(source, sourceProperty, dest, destProperty) {
        function setDate() {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                sourcedata = new Date(sourcedata);
                var m = sourcedata.getMonth() + 1, d = sourcedata.getDate(), y = sourcedata.getFullYear();
                var fromdate = daysSince(m, d, y);
                dest.innerText = fromdate;
            }
        }

        var bindingDesc = {
        };
        bindingDesc[sourceProperty] = setDate;
        return WinJS.Binding.bind(source, bindingDesc);
    });

    /**
     * apply moment.js humanize formatting on a date. Use 'humanizeFormat' and 'addSuffix' arguments to configure binding
     * @function
     * @param {Object} source object owning data
     * @param {string[]} sourceProperty path to object data
     * @param {HTMLElement} dest DOM element targeted by binding
     * @param {string[]} destProperty path to DOM element property targeted by binding
     */
    WinJSContrib.Bindings.humanizeDate = WinJS.Utilities.markSupportedForProcessing(function humanizeDate(source, sourceProperty, dest, destProperty) {
        function setDate() {
            var sourcedata = WinJSContrib.Utils.readProperty(source, sourceProperty);
            if (!sourcedata) {
                dest.innerText = '';
            } else {
                var arg = WinJSContrib.Bindings.bindingArguments(dest, "humanizeFormat"),
                    addSuffix = WinJSContrib.Bindings.bindingArguments(dest, "addSuffix");
                dest.innerText = moment.duration(sourcedata, arg).humanize(addSuffix);
            }
        }

        var bindingDesc = {
        };
        bindingDesc[sourceProperty] = setDate;
        return WinJS.Binding.bind(source, bindingDesc);
    });


})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib = WinJSContrib || {};

(function () {

    function Messenger(receiver, sender) {
        var messenger = this;
        messenger.isWorker = receiver.document === undefined;
        messenger._pendings = {};
        messenger._receiver = receiver;
        messenger._sender = sender || receiver;
        messenger._bindedProcessEvent = messenger._processEvent.bind(messenger);

        if (messenger._receiver)
            messenger._receiver.addEventListener('message', messenger._bindedProcessEvent);
    };

    /**
     * @classdesc
     * Wrapper for messaging between main code and iframe or web worker. All returns are wrapped as WinJS.Promise to enable asynchronous scenarios     
     * @class
     * @param {DOMElement} receiver element that will receive messages
     * @param {DOMElement} sender element that will send messages
     */
    WinJSContrib.Messenger = WinJS.Class.mix(Messenger, WinJS.Utilities.eventMixin);

    /**
     * default path for smart worker js file
     */
    WinJSContrib.Messenger.SmartWorkerPath = '/scripts/winjscontrib/winjscontrib.messenger.worker.js';

    /**
     * @classdesc
     * Wrapper for {@link WinJSContrib.Messenger} when using it with a webworker
     * @class
     * @param {string} [path] path to web worker file
     */
    WinJSContrib.Messenger.SmartWorker = function (path) {
        if (window.Worker) {
            var w = new window.Worker(path || WinJSContrib.Messenger.SmartWorkerPath);
            return new WinJSContrib.Messenger(w, w);
        }

        return new WinJSContrib.Messenger(null, null);
    }


    WinJSContrib.Messenger.prototype._send = function (obj) {
        if (this.isWorker) {
            this._sender.postMessage(JSON.stringify(obj));
        }
        else {
            this._sender.postMessage(JSON.stringify(obj), '*');
        }
    };

    /**
     * import script files
     * @param {Array} scriptPaths an array of string paths to js files
     */
    WinJSContrib.Messenger.prototype.importScripts = function (scriptPaths) {
        if (!this._receiver)
            return WinJS.Promise.wrap();

        return this.start('_doImportScripts', scriptPaths);
    }

    WinJSContrib.Messenger.prototype._doImportScripts = function (scriptPaths) {
        return new WinJS.Promise(function (c) {
            if (typeof scriptPaths == 'string') {
                importScripts(scriptPaths);
            } else if (scriptPaths.length) {
                for (var i = 0 ; i < scriptPaths.length ; i++) {
                    importScripts(scriptPaths[i]);
                }
            }
            c();
        });
    }

    /**
     * run the callback in the web worker. The callback is serialized to string so you must pass all variable used inside the function as arguments
     * @param {function} func function callback
     * @param {...Object} args
     * @returns {WinJS.Promise}
     */
    WinJSContrib.Messenger.prototype.execute = function (func) {
        var messenger = this;
        var args = [];
        if (arguments.length > 1) {
            for (var i = 1 ; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
        }

        if (messenger._receiver) {
            var f = 'var messengerFunction=' + func;

            return this.start('_runFunction', { f: f, args: args });
        }
        else {
            return WinJS.Promise.timeout(0).then(function () {
                return func.apply(null, args);
            });
        }
    }

    WinJSContrib.Messenger.prototype._runFunction = function (functionArgs) {
        var messenger = this;
        return new WinJS.Promise(function (c, e) {
            try {
                eval(functionArgs.f);
                var res = messengerFunction.apply(null, functionArgs.args);
                c(res);
            } catch (exception) {
                e(exception);
            }
        });
    }

    WinJSContrib.Messenger.prototype.map = function (object, functions) {
        var messenger = this;
        functions.forEach(function (name) {
            messenger[name] = function () {
                var f = object[name];
                return f.apply(object, arguments);
            }
        });
    }

    /**
     * start an operation within iframe or worker and get a promise for completion
     * @param {string} eventName name of the event/function to call
     * @param {Object} data event/function passed as argument
     * @returns {WinJS.Promise}
     */
    WinJSContrib.Messenger.prototype.start = function (eventName, data, asArgs) {
        var messenger = this;

        if (!messenger._receiver)
            return WinJS.Promise.wrapError('worker not supported');

        var wrapper = {
            id: WinJSContrib.Utils.guid(),
            complete: null, error: null, progress: null, promise: null
        }

        var event = {
            name: eventName,
            id: wrapper.id,
            type: 'run',
            data: data,
            asArgs: asArgs,
            sender: 'WinJSContrib.WinJSContrib.Messenger'
        };

        wrapper.promise = new WinJS.Promise(function (c, e, p) {
            wrapper.complete = c;
            wrapper.error = e;
            wrapper.progress = p;
        }, function oncancel() {
            console.warn('message canceled');
            event.type = 'cancel';
            messenger._send(event);
        });

        messenger._pendings[wrapper.id] = wrapper;
        var cleanUp = function () {
            delete messenger._pendings[wrapper.id];
        }
        wrapper.promise.done(cleanUp, cleanUp);
        messenger._send(event);

        return wrapper.promise;
    };

    WinJSContrib.Messenger.prototype._processEvent = function (arg) {
        var messenger = this;
       
        var details = typeof (arg.data) == 'string' ? JSON.parse(arg.data) : arg.data;
        var name = details.name;
        var data = details.data;
        var asArgs = details.asArgs;

        if (details.id) {
            var wrapper = messenger._pendings[details.id];
            if (wrapper && wrapper[details.type]) {
                wrapper[details.type](data);
                return;
            }

            if (details.type === 'cancel') {
                var current = messenger._pendings[details.id];
                if (current) {
                    current.promise.cancel();
                    delete messenger._pendings[details.id];
                }
            }
            else if (details.type==='run' && name && messenger[name]) {
                try {
                    var p = null;
                    if (asArgs) {
                        p = WinJS.Promise.as(messenger[name].apply(messenger[name], data));
                    } else {
                        p = WinJS.Promise.as(messenger[name](data));
                    }

                   messenger._pendings[details.id] = { promise: p, details: details };

                    p.then(function (arg) {
                        messenger._send({ name: name, id: details.id, type: 'complete', sender: 'WinJSContrib.WinJSContrib.Messenger', data: arg });
                    }, function (arg) {
                        messenger._send({ name: name, id: details.id, type: 'error', sender: 'WinJSContrib.WinJSContrib.Messenger', data: arg });
                    }, function (arg) {
                        messenger._send({ name: name, id: details.id, type: 'progress', sender: 'WinJSContrib.WinJSContrib.Messenger', data: arg });
                    }).then(function () {
                        delete messenger._pendings[details.id];
                    });
                } catch (exception) {
                    delete messenger._pendings[details.id];
                    messenger._send({ name: name, id: details.id, type: 'error', sender: 'WinJSContrib.WinJSContrib.Messenger', data: { description: exception.description, message: exception.message, stack: exception.stack } });
                }

                return;
            }
            else {
                messenger._send({ name: name, id: details.id, type: 'error', sender: 'WinJSContrib.WinJSContrib.Messenger', data: { message: 'callback function not found' } });
            }
        } else {
            if (name && messenger[name]) {
                messenger[name](data);
                return;
            }
            messenger.dispatchEvent(name, data);
        }
    };

    /**
     * release messenger and associated resources (if using webworker, worker is terminated
     */
    WinJSContrib.Messenger.prototype.dispose = function () {
        var messenger = this;
        if (messenger._receiver) {
            if (messenger._receiver.terminate)
                messenger._receiver.terminate();

            messenger._receiver.removeEventListener('message', messenger._bindedProcessEvent);
        }
    };
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var __global = this;
var WinJSContrib;
(function (WinJSContrib) {
    var DataContainer;
    (function (DataContainer) {
        DataContainer.current = WinJSContrib.DataContainer.current || null;
        var containerLogger = WinJSContrib.Logs.getLogger("WinJSContrib.DataContainer.WinRT");
        var WinRTFilesContainer = (function () {
            function WinRTFilesContainer(key, options, parent) {
                var container = this;
                container.key = key;
                container.options = options || {};
                container.parent = parent;
                container.folderPromise;
                container.useDataCache = container.options.useDataCache || false;
                container.dataCache = {};
                container.childs = {};
                if (!__global.Windows)
                    throw "WinRT is required !";
                if (!key) {
                    container.folder = Windows.Storage.ApplicationData.current.localFolder;
                    container.folderPromise = WinJS.Promise.wrap(container.folder);
                }
                else if (parent) {
                    container.folderPromise = parent.folderPromise.then(function (parentfolder) {
                        if (container.options.logger)
                            container.options.logger.debug("open folder " + key);
                        return parentfolder.createFolderAsync(key, Windows.Storage.CreationCollisionOption.openIfExists);
                    }).then(function (folder) {
                        container.folder = folder;
                        return folder;
                    });
                }
            }
            WinRTFilesContainer.makeCurrent = function (key, options) {
                WinJSContrib.DataContainer.current = new WinRTFilesContainer(key, options);
            };
            WinRTFilesContainer.prototype.read = function (itemkey) {
                var container = this;
                if (container.useDataCache) {
                    var data = container.dataCache[itemkey];
                    if (data) {
                        //clone object to avoid unintended object alteration
                        var clone = JSON.parse(JSON.stringify(data));
                        return WinJS.Promise.wrap(clone);
                    }
                }
                return container.folderPromise.then(function (folder) {
                    return readFileAsync(folder, itemkey, container.options.encrypted, Windows.Storage.CreationCollisionOption.openIfExists, 0, container.options.logger).then(function (data) {
                        if (container.useDataCache) {
                            container.dataCache[itemkey] = data;
                        }
                        return data;
                    });
                });
            };
            WinRTFilesContainer.prototype.save = function (itemkey, obj) {
                var container = this;
                if (container.useDataCache) {
                    container.dataCache[itemkey] = obj;
                }
                return container.folderPromise.then(function (folder) {
                    return writeFileAsync(folder, itemkey, obj, container.options.encrypted, Windows.Storage.CreationCollisionOption.replaceExisting, 0, container.options.logger);
                });
            };
            WinRTFilesContainer.prototype.remove = function (itemkey) {
                var container = this;
                return container.folderPromise.then(function (folder) {
                    return deleteItemIfExistsAsync(folder, itemkey, container.options.logger);
                });
            };
            WinRTFilesContainer.prototype.listKeys = function () {
                var container = this;
                return container.folderPromise.then(function (folder) {
                    return folder.getFilesAsync().then(function (files) {
                        return files.map(function (f) {
                            var key = f.path.substr(folder.path.length + 1);
                            var ext = key.indexOf('.json');
                            if (ext > 0) {
                                key = key.substr(0, ext);
                            }
                            return key;
                        });
                    });
                });
            };
            WinRTFilesContainer.prototype.list = function () {
                var container = this;
                return container.folderPromise.then(function (folder) {
                    return folder.getFilesAsync();
                });
            };
            WinRTFilesContainer.prototype.child = function (key) {
                if (this.childs[key])
                    return this.childs[key];
                var res = new WinRTFilesContainer(key, this.options, this);
                this.childs[key] = res;
                return res;
            };
            WinRTFilesContainer.prototype.childWithTransaction = function (key, process) {
                var current = this;
                return this.child(key + "-tmp").folderPromise.then(function (winrtfolder) {
                    return winrtfolder.deleteAsync().then(function () {
                        return current.child(key + "-tmp");
                    });
                }).then(function (folder) {
                    return process(folder).then(function (data) {
                        return folder.folderPromise.then(function (winrtfolder) {
                            return winrtfolder.renameAsync(key, Windows.Storage.NameCollisionOption.replaceExisting).then(function () {
                                current.childs[key] = null;
                                current.childs[key + "-tmp"] = null;
                                return current.child(key);
                            });
                        });
                    });
                });
            };
            WinRTFilesContainer.prototype.deleteContainer = function () {
                var container = this;
                return container.folderPromise.then(function (folder) {
                    return folder.deleteAsync();
                });
            };
            WinRTFilesContainer.prototype.clearAllCache = function () {
                var container = this;
                container.clearCache();
                container.clearDataCache();
            };
            WinRTFilesContainer.prototype.clearCache = function () {
                var container = this;
                container.childs = {};
                for (var k in container.childs) {
                    if (container.childs.hasOwnProperty(k)) {
                        container.childs[k].clearCache();
                    }
                }
            };
            WinRTFilesContainer.prototype.clearDataCache = function () {
                var container = this;
                container.dataCache = {};
                for (var k in container.childs) {
                    if (container.childs.hasOwnProperty(k)) {
                        container.childs[k].clearDataCache();
                    }
                }
            };
            return WinRTFilesContainer;
        })();
        DataContainer.WinRTFilesContainer = WinRTFilesContainer;
        function toJSONFileName(fileName) {
            return encodeURIComponent(fileName) + ".json";
        }
        function deleteItemIfExistsAsync(folder, itemName, logger) {
            return folder.getItemAsync(toJSONFileName(itemName)).then(function (item) {
                return item;
            }, function () {
            }).then(function (item) {
                if (item) {
                    return item.deleteAsync().then(function () {
                        if (logger)
                            logger.debug("item deleted " + item.path);
                    }, function (err) {
                        if (logger)
                            logger.error("cannot delete item " + item.path);
                    });
                }
                else {
                    return WinJS.Promise.wrap([]);
                }
            });
        }
        function getFileContentAsJSONAsync(file, encrypted) {
            return Windows.Storage.FileIO.readBufferAsync(file).then(function (cypheredText) {
                if (!encrypted)
                    return cypheredText;
                // On vérifie que le fichier n'est pas vide
                if (cypheredText.length) {
                    var provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider();
                    return provider.unprotectAsync(cypheredText);
                }
                else {
                    return null;
                }
            }).then(function (unprotectedData) {
                var obj = null;
                if (unprotectedData !== null && unprotectedData !== undefined) {
                    var rawText = Windows.Security.Cryptography.CryptographicBuffer.convertBinaryToString(Windows.Security.Cryptography.BinaryStringEncoding.utf8, unprotectedData);
                    if (rawText) {
                        try {
                            obj = JSON.parse(rawText);
                        }
                        catch (exception) { }
                    }
                }
                return obj;
            });
        }
        function readFileAsync(folder, fileName, encrypted, creationCollisionOption, retry, logger) {
            logger = logger || containerLogger;
            return new WinJS.Promise(function (readComplete, readError) {
                retry = retry || 0;
                creationCollisionOption = creationCollisionOption || Windows.Storage.CreationCollisionOption.openIfExists;
                var filename = toJSONFileName(fileName);
                //folder.getFilesAsync(filename).then(function(file){})
                folder.getFileAsync(filename).then(function (file) {
                    return getFileContentAsJSONAsync(file, encrypted);
                }).then(function (res) {
                    logger.verbose("read " + folder.path + '\\' + toJSONFileName(fileName));
                    readComplete(res);
                }, function (err) {
                    if (err.number == -2147024894) {
                        logger.debug("read empty " + folder.path + '\\' + toJSONFileName(fileName));
                        readComplete();
                        return;
                    }
                    logger.warn("error reading " + folder.path + '\\' + toJSONFileName(fileName));
                    if (retry < 2) {
                        setImmediate(function () {
                            logger.info("retry reading " + folder.path + '\\' + toJSONFileName(fileName));
                            readFileAsync(folder, fileName, encrypted, creationCollisionOption, retry + 1, logger).then(readComplete, readError);
                        });
                    }
                    else {
                        readError({ message: 'fatal error reading ' + folder.path + '\\' + toJSONFileName(fileName), exception: err });
                    }
                });
            });
        }
        function writeFileAsync(folder, fileName, objectGraph, encrypt, creationCollisionOption, retry, logger) {
            logger = logger || containerLogger;
            return new WinJS.Promise(function (writeComplete, writeError) {
                retry = retry || 0;
                creationCollisionOption = creationCollisionOption || Windows.Storage.CreationCollisionOption.replaceExisting;
                var bufferedText = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(JSON.stringify(objectGraph), Windows.Security.Cryptography.BinaryStringEncoding.utf8);
                if (encrypt) {
                    var provider = new Windows.Security.Cryptography.DataProtection.DataProtectionProvider("Local=user");
                }
                function manageError(err) {
                    logger.warn("error writing " + folder.path + '\\' + toJSONFileName(fileName));
                    if (retry < 2) {
                        setImmediate(function () {
                            logger.info("retry writing " + folder.path + '\\' + toJSONFileName(fileName));
                            writeFileAsync(folder, fileName, objectGraph, encrypt, creationCollisionOption, retry + 1, logger).then(writeComplete, writeError);
                        });
                    }
                    else {
                        writeError({ message: "fatal error writing " + folder.path + '\\' + toJSONFileName(fileName) + '\r\n', exception: err });
                    }
                }
                // Ces deux opérations ne sont pas dépendantes l'une de l'autre et peuvent s'exécuter en parallèle
                var filePromise = folder.createFileAsync(toJSONFileName(fileName), creationCollisionOption);
                var protectionPromise = encrypt ? provider.protectAsync(bufferedText) : WinJS.Promise.wrap(bufferedText);
                WinJS.Promise.join([filePromise, protectionPromise]).then(function (data) {
                    var file = data[0];
                    var protectedData = data[1];
                    Windows.Storage.FileIO.writeBufferAsync(file, protectedData).then(function () {
                        logger.verbose("file written " + file.path);
                        //setImmediate(function () {
                        writeComplete(file);
                        //});
                    }, manageError);
                }, manageError);
            });
        }
    })(DataContainer = WinJSContrib.DataContainer || (WinJSContrib.DataContainer = {}));
})(WinJSContrib || (WinJSContrib = {}));

/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/**
 * @namespace
 */
var WinJSContrib = WinJSContrib || {};

/**
 * @namespace
 */
WinJSContrib.UI = WinJSContrib.UI || {};

/**
 * @namespace
 */
WinJSContrib.Utils = WinJSContrib.Utils || {};

/// <reference path="winjscontrib.core.js" />
function HSL(hVal, sVal, lVal) {
    var res = {
        h: hVal,
        s: sVal,
        l: lVal,
        addH: function (increment) {
            this.h = this.h + increment;
        },
        addS: function (increment) {
            this.s = this.s + increment;
        },
        addL: function (increment) {
            this.l = this.l + increment;
        },
        toString: function () {
            return 'hsl(' + this.h + ',' + this.s + '%, ' + this.l + '%)';
        },
        clone: function (hInc, sInc, lInc) {
            var res = new HSL(this.h, this.s, this.l);
            res.addH(hInc);
            res.addS(sInc);
            res.addL(lInc);
            return res;
        }
    };

    return res;
}

(function ($) {
    $.fn.winControl = function () {
        return this[0].winControl;
    };
})(jQuery);

(function ($) {
    $.fn.tap = function (callback, options) {
        var opt = options || {};

        return this.each(function () {
        	WinJSContrib.UI.tap(this, callback, options);
        });
    };

    $.fn.untap = function (callback) {
        return this.each(function () {
            WinJSContrib.UI.untap(this);            
        });
    };

    jQuery.fn.hatchShow = function () {
        $('.hsjs').css('visibility', 'hidden').css('font-size', '').css('display', 'inner-block').css('white-space', 'pre').each(function () {
            var t = $(this);
            var parent = t.parent();
            if (parent.hasClass('hatchshow_temp')) {
                //t = parent;
                parent = parent.parent();
            }
            else {
                t.wrap("<span class='hatchshow_temp' style='display:block'>");
            }
            var pw = parent.width();
            var w = t.width();
            while (t.width() < pw) {
                var fsize = t.fontSize();
                if (fsize > 200)
                    break;
                t.css('font-size', (fsize + 1) + "px"),
                  function () {
                      while (t.width() > pw) {
                          var fsize = t.fontSize();
                          if (fsize < 8)
                              break;
                          t.css('font-size', (fsize - .1) + "px")
                      }
                  };
            };
        }).hide().css('visibility', '').fadeIn();
    };


    jQuery.fn.fontSize = function () { return parseInt($(this).css('font-size').replace('px', '')); };

})(jQuery);

(function ($) {
    $.fn.pressEnterDefaultTo = function (eltSelector, scope) {
        return this.each(function () {
            var $this = $(this);
            $this.keypress(function (e) {
                var key = e.which ? e.which : e.keyCode;
                if (key == 13) {
                    var $elt = scope ? $(eltSelector, scope) : $(eltSelector);
                    jQuery(this).blur();
                    e.preventDefault();
                    e.stopPropagation();
                    if ($elt[0].mcnTapTracking && $elt[0].mcnTapTracking.callback) {
                        $elt[0].mcnTapTracking.callback($elt[0]);
                    }
                    $elt.focus().click();
                }
            });
        });
    };

    $.fn.onPressEnter = function (callback) {
        return this.each(function () {
            var $this = $(this);
            $this.keypress(function (e) {
                var key = e.which ? e.which : e.keyCode;
                if (key == 13) {
                    jQuery(this).blur();
                    e.preventDefault();
                    if (callback) callback();
                }
            });
        });
    };

    $.fn.throttleTextChanged = function (throttling, callback) {
        return this.each(function () {
            var elt = this;
            var $this = $(this);
            var lastval = elt.value;
            $this.keydown(function (e) {
                clearTimeout(elt.mcnTxtThrottling);
                elt.mcnTxtThrottling = setTimeout(function () {
                    lastval = elt.value;
                    callback(elt, elt.value);
                }, throttling);
            });

            $this.blur(function (e) {
                if (lastval != elt.value) {
                    lastval = elt.value;
                    callback(elt, elt.value);
                }
            });
        });
    };
})(jQuery);

(function ($) {
    $.fn.transitionProperties = function (properties, delay, targetValueCallback) {
        var that = $(this);
        //-ms-transition: all @transdur ease-in-out;
        return new WinJS.Promise(function (complete, error) {
            var val = properties + ' ' + delay + 'ms ease-out';
            var res = that.css('transition', val);

            if (targetValueCallback) {
                targetValueCallback(res);
            }
            res.delay(delay + 10).promise().done(function () {
                that.css('-ms-transition', '');
                complete(res);
            },
            function () {
                that.css('-ms-transition', '');
                error(res);
            });
        });
    };
})(jQuery);

(function ($) {
    $.fn.toWinJSPromise = function () {
        return new WinJS.Promise(function (complete, error) {
            var res = this.promise().done(function () {
                complete(res);
            },
            function () {
                error(res);
            });
        });
    };
})(jQuery);

(function ($) {
    $.fn.renderWith = function (templateSelector, object) {
        var template = $(templateSelector).get(0);
        if (template)
            template = template.winControl;

        return this.each(function () {
            var $this = $(this);
            if (template) {
                template.render(null, object).done(function (elt) {
                    $this.append(elt.children[0]);
                });
            }
        });
    };
})(jQuery);

(function ($) {
    $.fn.renderWithEach = function (templateSelector, objectArray, itemCallback) {
        var template = $(templateSelector).get(0);
        if (template)
            template = template.winControl;

        return this.each(function () {
            var $this = $(this);
            if (template) {
                objectArray.forEach(function (element, index) {
                    template.render(null, element).done(function (elt) {
                        var templatedElt = elt.children[0];
                        $this.append(templatedElt);
                        if (itemCallback)
                            itemCallback(element, templatedElt);
                    });
                });
            }
        });
    };
})(jQuery);

(function ($) {
    $.fn.scrollInView = function (offset, animate) {
        var viewState = Windows.UI.ViewManagement.ApplicationView.value;
        var horizontal = true;
        if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped || viewState === Windows.UI.ViewManagement.ApplicationViewState.fullScreenPortrait)
            horizontal = false;

        return this.each(function () {
            var $this = $(this);
            if (horizontal) {
                this.offsetParent.scrollLeft = this.offsetLeft - (offset ? offset : 0);
            } else {
                this.offsetParent.scrollTop = this.offsetTop - (offset ? offset : 0);
            }
        });
    };
})(jQuery);

(function ($) {
    $.fn.scrollInParentView = function (offset, animate) {
        var viewState = Windows.UI.ViewManagement.ApplicationView.value;
        var horizontal = true;
        if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped || viewState === Windows.UI.ViewManagement.ApplicationViewState.fullScreenPortrait)
            horizontal = false;

        return this.each(function () {
            if (horizontal) {
                this.offsetParent.offsetParent.scrollLeft = this.offsetLeft - (offset ? offset : 0);
            } else {
                this.offsetParent.offsetParent.scrollTop = this.offsetTop - (offset ? offset : 0);
            }
        });
    };
})(jQuery);

(function ($) {
    $.fn.loadedPromises = function (callback) {
        var res = [];
        this.each(function () {
            var $this = $(this);
            var that = this;
            var promise = new WinJS.Promise(function (complete, error) {
                function onerror(e) {
                    that.removeEventListener('error', onerror);
                    that.removeEventListener('load', onloaded);
                    error({ message: 'element not loaded', elt: e.currentTarget });
                }

                function onloaded() {
                    that.removeEventListener('error', onerror);
                    that.removeEventListener('load', onloaded);
                    complete(that);
                    if (callback)
                        callback(that);
                }

                that.addEventListener('error', onerror);
                that.addEventListener('load', onloaded, false);

                if (that.naturalWidth > 0) {
                    onloaded();
                }
            });
            res.push(promise);
        });

        return res;
    };

    $.fn.whenLoaded = function (callback) {
        var promises = this.loadedPromises();
        if (callback) {
            WinJS.Promise.join(promises).done(function (res) {
                callback(res);
            });
        } else {
            return WinJS.Promise.join(promises);
        }
    };

    $.fn.afterTransition = function (callback, timeout) {
        var promises = [];
        var completed = false;

        this.each(function () {
            var currentElement = this;

            var prom = new WinJS.Promise(function (complete, error) {
                var onaftertransition = function (event) {
                    if (event.srcElement === currentElement) {
                        close();
                    }
                };
                var close = function () {
                    clearTimeout(timeOutRef);
                    currentElement.removeEventListener("transitionend", onaftertransition, false);
                    complete();
                }

                currentElement.addEventListener("transitionend", onaftertransition, false);
                timeOutRef = setTimeout(close, timeout || 1000);
            });
            promises.push(prom);
        });

        var success = null, error = null;
        var resultPromise = new WinJS.Promise(function (c, e) {
            success = c;
            error = e;
        });

        var p = WinJS.Promise.join(promises);
        p.done(function () {
            if (!completed) {
                completed = true;
                if (callback) {
                    callback();
                }
                success();
                return;
            }
            p.cancel();
            error();
        }, error);

        return resultPromise;
    };

    $.fn.afterAnimation = function (callback) {
        var promises = [];
        this.each(function () {
            var ctrl = this;
            var prom = new WinJS.Promise(function (complete, error) {
                function ontransition(event) {
                    if (event.srcElement === currentElement) {
                        ctrl.removeEventListener("animationend", ontransition);
                        complete();
                    }
                }

                ctrl.addEventListener("animationend", ontransition);
            });
            promises.push(prom);
        });

        WinJS.Promise.join(promises).done(function () {
            if (callback)
                callback();
        });

        return this;
    };

    $.fn.classBasedAnimation = function (classname) {
        var promises = [];
        return this.each(function () {
            var ctrl = this;
            $(ctrl).afterAnimation(function () {
                $(ctrl).removeClass(classname);
            });

            $(ctrl).addClass(classname);
        });
    };
})(jQuery);
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

(function () {
    'use strict';
    
    var DataFormState = WinJS.Class.mix(WinJS.Class.define(function () {
        this._initObservable();
    }, {
    }), WinJS.Binding.mixin, WinJS.Binding.expandProperties({ isValid: false, updated: false }));

    WinJS.Namespace.define("WinJSContrib.UI", {
        DataForm: WinJS.Class.mix(WinJS.Class.define(
            /**
             * @class WinJSContrib.UI.DataForm
             * @classdesc
             * This control enhance data form management by adding validation mecanism and form state helpers. It must be placed on a form element.
             * Input fields must use {@link WinJSContrib.UI.DataFormBinding} to bind object properties to input
             * @param {HTMLElement} element DOM element containing the control
             * @param {Object} options
             */
            function ctor(element, options) {
                var ctrl = this;
                this.element = element || document.createElement('FORM');
                //$(this.element).submit(function (e) {
                //    e.preventDefault()
                //})
                options = options || {};
                this.groups = options.groups;
                this.messages = options.messages;
                this.rules = options.rules;
                /**
                 * state of the form
                 * @field
                 * @type {Object}
                 */
                this.state = new DataFormState();
                this.state.item = {};
                this.allowTooltip = options.allowTooltip || true;
                this.workOnCopy = options.workOnCopy || true;
                this.tooltipDelay = options.tooltipDelay || 4000;
                this.tooltipPosition = options.tooltipPosition || 'right';
                this.tooltipTheme = options.tooltipTheme || 'tooltipster-error';
                this.initValidator();
                this.element.winControl = this;
                this.element.mcnDataForm = true;
                this.element.classList.add('win-disposable');
                if (WinJSContrib.CrossPlatform && WinJSContrib.CrossPlatform.crossPlatformClass)
                    WinJSContrib.CrossPlatform.crossPlatformClass(this.element);
                WinJS.UI.setOptions(this, options);
                WinJS.UI.processAll(this.element).done(function () {
                    WinJS.Binding.processAll(ctrl.element, ctrl.state);
                });

                $('.mcn-dataform-cancel', this.element).click(function (arg) {
                    arg.preventDefault();
                    ctrl.cancel();
                });
            },
            /**
             * @lends WinJSContrib.UI.DataForm.prototype
             */
        {
            /**
             * @member {Array}
             */
            messages: {
                get: function () {
                    return this._messages;
                },
                set: function (val) {
                    this._messages = val;
                }
            },
            /**
             * @member {Array}
             */
            rules: {
                get: function () {
                    return this._rules;
                },
                set: function (val) {
                    this._rules = val;
                }
            },
            /**
             * @member {Array}
             */
            groups: {
                get: function () {
                    return this._groups;
                },
                set: function (val) {
                    this._groups = val;
                }
            },
            /**
             * object bound to data form
             * @member {Object}
             */
            item: {
                get: function () {
                    return this.state.item;
                },
                set: function (val) {
                    var dataform = this;
                    if (dataform.workOnCopy) {
                        dataform.state.item = $.extend(true, {}, val);
                        dataform.state.refItem = val;
                    }
                    else {
                        dataform.state.item = val;
                    }

                    
                    dataform.validator.resetForm();

                    dataform.autobindFields();
                    WinJS.Binding.processAll(this.element, this.state).done(function () {
                        var tooltips = dataform.allowTooltip;
                        dataform.allowTooltip = false;
                        dataform.validator.form();
                        dataform.allowTooltip = tooltips;
                        dataform.checkState();
                        dataform.initValidator();
                        dataform.state.updated = false;
                    });
                    dataform.dispatchEvent("itemchanged", { dataform: this, item: val });
                }
            },
            /**
             * indicate if form has updates
             * @member {boolean}
             */
            updated: {
                get: function () {
                    return this.state.updated;
                },
                set: function (val) {
                    this.state.updated = val;
                    this.dispatchEvent("haschanges");
                }
            },

            autobindFields: function () {
                var ctrl = this;
                $('[data-formfield]', ctrl.element).each(function () {
                    var fieldElt = this;
                    var srcProperty = $(fieldElt).data('formfield');
                    var destFieldType = 'value';
                    if (fieldElt.type == 'checkbox') {
                        destFieldType = 'checked';
                    }
                    WinJSContrib.UI.DataFormBinding(ctrl.state.item, srcProperty.split('.'), fieldElt, [destFieldType]);
                });
            },

            /**
             * check form state
             */
            checkState: function () {
                var nbInvalids = this.validator.numberOfInvalids();
                this.state.isValid = nbInvalids == 0;
            },

            /**
             * cancel updates on form item
             */
            cancel: function () {
                var dataform = this;
                if (dataform.workOnCopy) {
                    dataform.item = $.extend(true, {}, dataform.state.refItem);
                }
            },

            /**
             * apply changes to source object (relevant only if using workOnCopy)
             */
            save: function () {
                var dataform = this;
                if (dataform.workOnCopy) {
                    dataform.state.updated = false;
                    dataform.state.refItem = $.extend(true, {}, dataform.state.item);
                }
            },

            initValidator: function () {
                var dataform = this;

                this.validator = $(this.element).validate({
                    groups: this.groups,
                    rules: this.rules,
                    submitHandler: function (form) {
                        dataform.dispatchEvent('submitted', { item: dataform.state.item });
                    },

                    invalidHandler: function (form, validator) {
                        dataform.checkState();
                    },

                    errorPlacement: function (error, element) {
                        dataform.checkState();
                        if (!dataform.allowTooltip)
                            return;

                        var $e = $(element);
                        $e.tooltipster({
                            trigger: 'custom',
                            onlyOne: false,
                            position: dataform.tooltipPosition,
                            theme: dataform.tooltipTheme
                        });

                        var lastError = $e.data('lastError'),
                            newError = $(error).text();

                        $e.data('lastError', newError);

                        if (newError !== '' && newError !== lastError) {
                            $e.tooltipster('content', newError);
                            $e.tooltipster('show');
                            $e[0].tooltipsterValidationTimeout = setTimeout(function () {
                                $e[0].tooltipsterValidationTimeout = null;
                                if ($e.hasClass('tooltipster'))
                                    $e.tooltipster('hide');
                            }, dataform.tooltipDelay);
                        }
                    },

                    success: function (label, element) {
                        dataform.checkState();
                        var $e = $(element);
                        if ($e[0].tooltipsterValidationTimeout) {
                            clearTimeout($e[0].tooltipsterValidationTimeout);
                            $e[0].tooltipsterValidationTimeout = null;
                        }

                        if ($e.hasClass('tooltipstered')) {
                            $e.tooltipster('hide');
                        }
                    }

                });
            },

            /**
             * validate form
             */
            validate: function () {
                var res = this.validator.form();
                return res;
            },

            /**
             * release form
             */
            dispose: function () {
                WinJS.Utilities.disposeSubTree(this.element);
            }
        },
        /**
         * @lends WinJSContrib.UI.DataForm
         */
        {
            /**
             * @namespace WinJSContrib.UI.DataForm.defaultBindingOptions
             */
            DefaultBindingOptions: {
                trimText: true,
                convertEmptyToNull: true,
            },

            /**
             * @namespace WinJSContrib.UI.DataForm.Converters
             */
            Converters: {
                /**
                 * @member
                 */
                "none": {
                    fromObject: function (val, options) {
                        return val.toString();
                    },
                    fromInput: function (val, options) {
                        return val;
                    }
                },
                /**
                 * @member
                 */
                "text": {
                    fromObject: function (val, options) {
                        if (typeof val === "undefined" || val === null)
                            return '';

                        var res = val.toString();
                        
                        return res;
                    },
                    fromInput: function (val, options) {
                        var res = val;
                        if (res && options && options.trimText) {
                            res = res.trim();
                        }
                        if (options && options.convertEmptyToNull) {
                            res = (res === '') ? null : res;
                        }
                        return res;
                    }
                },
                /**
                 * @member
                 */
                "number": {
                    fromObject: function (val, options) {
                        if (typeof val !== "number")
                            return '';

                        return val.toString();
                    },
                    fromInput: function (val, options) {
                        if (typeof val !== "undefined" && val !== null)
                          //return parseFloat(val);
                          return parseFloat(val.toString().replace(',', '.').replace(' ', ''));

                        return null;
                    }
                },
                /**
                 * @member
                 */
                "boolean": {
                    fromObject: function (val, options) {
                        if (typeof val === "undefined" || val === null)
                            return '';

                        return val.toString();
                    },
                    fromInput: function (val, options) {
                        if (val === 'true')
                            return true;
                        if (val === 'false')
                            return false;

                        return null;
                    }
                },
                /**
                 * @member
                 */
                "object": {
                    fromObject: function (val, options) {
                        return val;
                    },
                    fromInput: function (val, options) {
                        return val;
                    }
                },
                /**
                 * @member
                 */
                "stringifiedObject": {
                    fromObject: function (val, options) {
                        return JSON.stringify(val);
                    },
                    fromInput: function (val, options) {
                        return JSON.parse(val);
                    }
                }
            }
        }),
        WinJS.UI.DOMEventMixin,
        WinJS.Utilities.createEventProperties("itemchanged", "haschanges", "submitted")),

        parentDataForm: function (element) {
            var current = element.parentNode;

            while (current) {
                if (current.mcnDataForm) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        },

        

        /**
         * bi-directional binding for working with input fields and custom input controls. This binding expect a {@link WinJSContrib.UI.DataForm} to be found on the parent form
         * @function WinJSContrib.UI.DataFormBinding
         * @param {Object} source object owning data
         * @param {string[]} sourceProperty path to object data
         * @param {HTMLElement} dest DOM element targeted by binding
         * @param {string[]} destProperty path to DOM element property targeted by binding
         */
        DataFormBinding: WinJS.Binding.initializer(function (source, sourceProperty, dest, destProperty) {
            //if (dest.binded && dest.winControl)
            //    dest.winControl.dispose();

            var dataform = WinJSContrib.UI.parentDataForm(dest);
            var options = WinJSContrib.UI.DataForm.DefaultBindingOptions;
            var optionsText = dest.getAttribute("data-formfield-options");
            if (optionsText) {
                options = WinJS.UI.optionsParser(optionsText, window);
            }
            var inputType = "";
            var inputOption = dest.getAttribute("data-forminput");
            if (inputOption) {
                inputType = inputOption;
            }

            var fieldUpdated = false;
            dest.classList.add('mcn-dataform-field');

            //si le noeud n'est pas un champ input html, on renseigne la propriété form, sinon plantage de jquery validate
            if (!dest.form) {
                dest.form = dataform.element;
            }

            var inputType = 'text';
            if ($(dest).data('formfield-type')) {
                inputType = $(dest).data('formfield-type');
            }
            else if (dest.nodeName !== "TEXTAREA" && typeof dest.type !== "undefined") {
                inputType = dest.type;
            }
            var converter = WinJSContrib.UI.DataForm.Converters[inputType] || WinJSContrib.UI.DataForm.Converters['text'];

            function updateInputFromObject() {
                var data = WinJSContrib.Utils.readProperty(source, sourceProperty);
                if (typeof data === "undefined")
                    data = null;

                if (dest.nodeName == "INPUT" && dest.type == "radio") {
                    var fieldname = dest.name;
                    if (dest.value == data) {
                        dest.checked = true;
                    }
                } else {
                    data = converter.fromObject(data, options);
                    WinJSContrib.Utils.writeProperty(dest, destProperty, data);
                }
            }

            function updateObjectFromInput() {
                dataform.checkState();
                if (!dest.id || dataform.validator.element(dest)) {
                    var val = null;
                    if (dest.nodeName == "INPUT" && dest.type == "radio") {
                        var fieldname = dest.name;
                        if (dest.form && dest.form[fieldname] && dest.form[fieldname].length) {
                            for (var i = 0, l = dest.form[fieldname].length; i < l ; i++) {
                                var field = dest.form[fieldname][i];
                                if (field.checked){
                                    val = field.value;
                                    break;
                                }
                            }
                        }
                    } else {
                        val = WinJSContrib.Utils.getProperty(dest, destProperty).propValue;
                    }

                    if (val !== undefined)
                        val = converter.fromInput(val, options);

                    WinJSContrib.Utils.writeProperty(source, sourceProperty, val);
                }
                dataform.updated = true;
            }

            function validateObjectOnBlur() {
                if (fieldUpdated)
                    dataform.validator.element(dest);
            }
            if (!dest.binded)
                dest.binded = true;


            if (!dest.winControl) {
                dest.classList.add('win-disposable');
                dest.winControl = {
                    dispose: function () {
                        dest.removeEventListener("change", dest.winControl.updateObjectFromInput);
                        dest.removeEventListener("blur", dest.winControl.validateObjectOnBlur);
                        if (inputType) {
                            dest.removeEventListener(inputType, dest.winControl.updateObjectFromInput);
                        }
                    }
                }
            }
            dest.winControl.updateObjectFromInput = updateObjectFromInput;
            dest.winControl.validateObjectOnBlur = validateObjectOnBlur;

            if (inputType) {
                dest.addEventListener(inputType, dest.winControl.updateObjectFromInput);
            }
            dest.addEventListener("change", dest.winControl.updateObjectFromInput);
            if (dest.id) {
                dest.addEventListener("blur", validateObjectOnBlur);
            }

            var bindingDesc = {
            };

            bindingDesc[sourceProperty] = updateInputFromObject;
            return WinJS.Binding.bind(source, bindingDesc);
        })
    });
})();

/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/// <reference path="WinJSContrib.core.js" />

(function () {
    "use strict";

    var appView = null;
    if (window.Windows && window.Windows.UI && window.Windows.UI.ViewManagement && window.Windows.UI.ViewManagement.ApplicationView)
        appView = window.Windows.UI.ViewManagement.ApplicationView;

    var nav = WinJS.Navigation;

    var defaultExitPageAnimation = function (elt) {
        return WinJS.UI.Animation.exitPage(elt)
    }

    var defaultEnterPageAnimation = function (elt) {
        return WinJS.UI.Animation.enterPage(elt);
    }

    WinJS.Namespace.define("WinJSContrib.UI", {
        parentNavigator: function (element) {
            var current = element.parentNode;

            while (current) {
                if (current.mcnNavigator) {
                    return current.winControl;
                }
                current = current.parentNode;
            }
        },

        PageControlNavigator: WinJS.Class.mix(WinJS.Class.define(
            /**
             * @class WinJSContrib.UI.PageControlNavigator
             * @param {HTMLElement} element DOM element containing the control
             * @param {Object} options
             */
            function PageControlNavigator(element, options) {
                var options = options || {};
                var navigator = this;
                this.element = element || document.createElement("div");
                this.element.winControl = this;
                this.element.mcnNavigator = true;
                this.element.classList.add('mcn-navigator');
                this.element.classList.add('mcn-navigation-ctrl');
                this.eventTracker = new WinJSContrib.UI.EventTracker();
                this.delay = options.delay || 0;
                this.disableHistory = options.disableHistory || false;
                this.animationWaitForPreviousPageClose = options.animationWaitForPreviousPageClose || true;
                this.animations = {};
                this.locks = 0;

                if (options.enterPageAnimation) {
                    this.animations.enterPage = WinJSContrib.Utils.resolveMethod(element, options.enterPageAnimation);
                }
                if (!this.animations.enterPage)
                    this.animations.enterPage = defaultEnterPageAnimation;

                if (options.exitPageAnimation) {
                    this.animations.exitPage = WinJSContrib.Utils.resolveMethod(element, options.exitPageAnimation);
                }
                if (!this.animations.exitPage)
                    this.animations.exitPage = defaultExitPageAnimation;
                this.home = options.home;
                if (appView)
                    this._lastViewstate = appView.value;

                this.global = options.global !== undefined ? options.global : true;
                if (this.global) { //navigation classique 
                    document.body.onkeyup = this._keyupHandler.bind(this);
                    document.body.onkeypress = this._keypressHandler.bind(this);
                    document.body.onmspointerup = this._mspointerupHandler.bind(this);

                    WinJSContrib.UI.Application = WinJSContrib.UI.Application || {};
                    WinJSContrib.UI.Application.navigator = this;

                    this.eventTracker.addEvent(nav, 'beforenavigate', this._beforeNavigate.bind(this));
                    this.eventTracker.addEvent(nav, 'navigated', this._navigated.bind(this));

                    var systemNavigationManager = null;
                    if (WinJSContrib.UI.enableSystemBackButton && window.Windows && window.Windows.UI && window.Windows.UI.Core && window.Windows.UI.Core.SystemNavigationManager) {
                        systemNavigationManager = window.Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                    }

                    if (systemNavigationManager && WinJSContrib.UI.enableSystemBackButton) {
                        this.eventTracker.addEvent(systemNavigationManager, 'backrequested', function (arg) {
                            if (WinJS.Navigation.canGoBack) {
                                navigator.back();
                                arg.handled = true;
                            }
                        });

                    }
                }
                else {
                    if (options.navigationEvents) {
                        this.addNavigationEvents();
                    }
                    this._history = { backstack: [] };
                }

                this.eventTracker.addEvent(window, 'resize', function (args) {
                    if (navigator.resizeHandler)
                        cancelAnimationFrame(navigator.resizeHandler);

                    navigator.resizeHandler = requestAnimationFrame(function () {
                        navigator.resizeHandler = null;
                        navigator._resized(args);
                    });
                });
            },
                /**
                 * @lends WinJSContrib.UI.PageControlNavigator.prototype
                 */
                {
                    home: "",
                    /// <field domElement="true" />
                    element: null,
                    _lastNavigationPromise: WinJS.Promise.as(),
                    _lastViewstate: 0,

                    // This is the currently loaded Page object.
                    pageControl: {
                        get: function () {
                            return this.pageElement ? this.pageElement.winControl : null;
                        }
                    },

                    // This is the root element of the current page.
                    pageElement: {
                        get: function () {
                            var elt = this.element.lastElementChild;
                            while (elt && elt.winControl && elt.winControl.mcnPageClosing) {
                                elt = elt.previousSibling;
                            }
                            return elt;
                        }
                    },

                    history: {
                        get: function () {
                            if (this.global)
                                return WinJS.Navigation.history;
                            else
                                return this._history;
                        }
                    },

                    addLock: function () {
                        this.locks++;
                    },

                    removeLock: function () {
                        this.locks--;
                    },

                    // Creates a container for a new page to be loaded into.
                    _createPageElement: function () {
                        var element = document.createElement("div");
                        element.setAttribute("dir", window.getComputedStyle(this.element, null).direction);
                        //element.style.width = "100%";
                        //element.style.height = "100%";
                        //element.style.position = 'relative';
                        return element;
                    },

                    // This function disposes the page navigator and its contents.
                    dispose: function () {
                        if (this._disposed) {
                            return;
                        }
                        this._disposed = true;
                        this.removeNavigationEvents();
                        if (WinJS.Utilities.disposeSubTree)
                            WinJS.Utilities.disposeSubTree(this.element);

                        this.eventTracker.dispose();
                    },

                    //check back navigation in the context of navigation events.
                    _checkBackNavigation: function (arg) {
                        var navigator = this;
                        var currentPage = navigator.pageControl;
                        var confirm = function () {
                            arg.handled = true;
                            if (arg.preventDefault)
                                arg.preventDefault();
                        }
                        var check = function () {
                            if (navigator.canGoBack) {
                                navigator.back();
                                confirm();
                                return true;
                            };
                        }

                        if (currentPage.canClose) {
                            var res = currentPage.canClose();
                            if (WinJS.Promise.is(res)) {
                                res.then(function (canClose) {
                                    if (!canClose) {
                                        confirm();
                                        return true;
                                    }
                                    return check();
                                });
                            } else {
                                if (!res) {
                                    confirm();
                                    return true;
                                }
                                return check();
                            }

                        } else {
                            return check();
                        }
                    },

                    //register hardware backbutton. unecessary if navigator is global
                    addNavigationEvents: function () {
                        var navigator = this;
                        this.navigationEvents = WinJSContrib.UI.registerNavigationEvents(this, function (arg) {
                            navigator._checkBackNavigation(arg);
                        });
                    },

                    removeNavigationEvents: function () {
                        if (this.navigationEvents) {
                            this.navigationEvents();
                            this.navigationEvents = null;
                        }
                    },

                    // Retrieves a list of animation elements for the current page.
                    // If the page does not define a list, animate the entire page.
                    _getAnimationElements: function (isExit) {
                        if (this.pageControl && this.pageControl.getAnimationElements) {
                            return this.pageControl.getAnimationElements(isExit);
                        }
                        return this.pageElement;
                    },

                    // Navigates back whenever the backspace key is pressed and
                    // not captured by an input field.
                    _keypressHandler: function (args) {
                        if (this.locks > 0)
                            return;

                        if (args.key === "Backspace") {
                            this.back();
                        }
                    },

                    // Navigates back or forward when alt + left or alt + right
                    // key combinations are pressed.
                    _keyupHandler: function (args) {
                        if (this.locks > 0)
                            return;

                        if ((args.key === "Left" && args.altKey) || (args.key === "BrowserBack")) {
                            this.back();
                        }/* else if ((args.key === "Right" && args.altKey) || (args.key === "BrowserForward")) {
                        nav.forward();
                    }*/
                    },

                    // This function responds to clicks to enable navigation using
                    // back and forward mouse buttons.
                    _mspointerupHandler: function (args) {
                        if (args.button === 3) {
                            nav.back();
                        } else if (args.button === 4) {
                            nav.forward();
                        }
                    },

                    navigate: function (location, initialState, skipHistory, isback, stacked) {
                        var nav = this;
                        if (this.global) {
                            return WinJS.Navigation.navigate(location, initialState);
                        } else {
                            var arg = {
                                skipHistory: skipHistory,
                                detail: {
                                    location: location,
                                    state: initialState,
                                    navigateStacked: stacked,
                                    setPromise: function (promise) {
                                        this.pagePromise = promise;
                                    }
                                }
                            };
                            nav._beforeNavigate(arg);
                            arg.detail.pagePromise = arg.detail.pagePromise || WinJS.Promise.wrap();
                            nav._history.current = { state: initialState, location: location };
                            return arg.detail.pagePromise.then(function () {
                                if (isback) {
                                    nav._history.backstack.splice(nav._history.backstack.length - 1, 1);
                                }
                                nav._navigated(arg);
                                return arg.detail.pagePromise;
                            });
                        }
                    },

                    clearHistory: function () {
                        if (this.global) {
                            WinJS.Navigation.history.backStack = [];
                        } else {
                            this._history.backstack = [];
                            this._history.current = null;
                        }
                    },

                    closeAllPages: function () {
                        var navigator = this;
                        var pages = navigator.element.children;

                        for (var i = pages.length - 1 ; i >= 0 ; i--) {
                            var page = pages[i];
                            if (page && page.classList.contains("pagecontrol")) {
                                navigator.element.removeChild(page);
                                page.winControl.dispose();
                            }
                        }
                    },

                    clear: function () {
                        this.clearHistory();
                        this.closeAllPages();
                        this.element.innerHTML = '';
                    },

                    //warning, deprecated...
                    open: function (uri, options) {
                        return this.navigate(uri, options);
                    },

                    pick: function (uri, options) {
                        options = options || {};
                        options.navigateStacked = true;
                        return this.navigate(uri, options);
                    },

                    canGoBack: {
                        get: function () {
                            if (this.global)
                                return nav.canGoBack;
                            else
                                return this._history.backstack.length > 0;
                        }
                    },

                    _handleStackedBack: function () {
                        var navigator = this;
                        if (navigator.global) {
                            var isStacked = navigator.stackNavigation == true || (WinJS.Navigation.history.current.state && WinJS.Navigation.history.current.state.navigateStacked);
                            if (isStacked) {
                                var previousPage = navigator.element.children[navigator.element.children.length - 2];
                                if (previousPage) {
                                    WinJS.Navigation.history.backStack.splice(WinJS.Navigation.history.backStack.length - 1, 1);
                                    navigator.triggerPageExit();
                                    return navigator.closePage(navigator.pageControl.element).then(function () {
                                        navigator._updateBackButton(previousPage.winControl.element);
                                        if (previousPage.winControl && previousPage.winControl.navactivate) {
                                            previousPage.winControl.navactivate();
                                        }
                                        if (WinJSContrib.UI.Application.progress)
                                            WinJSContrib.UI.Application.progress.hide();
                                    });
                                }
                            }
                        }
                    },

                    back: function (distance) {
                        var navigator = this;

                        if (navigator.global) {
                            //navigator._handleBack();

                            return WinJS.Navigation.back(distance);
                        }
                        else {
                            if (navigator._history.backstack.length) {
                                var pageindex = navigator._history.backstack.length - 1;
                                var previousPage = navigator._history.backstack[pageindex];

                                return navigator.navigate(previousPage.location, previousPage.state, true, true);
                            }
                        }
                    },

                    _beforeNavigate: function (args) {
                        var navigator = this;
                        var page = this.pageElement;
                        var navlocation = args.detail.location;
                        var navstate = args.detail.state;

                        args.detail.state = args.detail.state || {};
                        var openStacked = navigator.stackNavigation == true || args.detail.navigateStacked || args.detail.state.navigateStacked;

                        if (navigator.global && page && page.winControl && page.winControl.navigationState && page.winControl.navigationState.state && page.winControl.navigationState.state.navigateStacked) {
                            var history = WinJS.Navigation.history.backStack[WinJS.Navigation.history.backStack.length - 1];
                            if (navlocation == history.location && navstate == history.state) {
                                var res = navigator._handleStackedBack();
                                if (WinJS.Promise.is(res)) {
                                    WinJS.Navigation.history.current = history;
                                    args.detail.setPromise(res.then(function () {
                                        var p = new WinJS.Promise(function (c) { });
                                        args.detail.setPromise(p);
                                        p.cancel();
                                        return p;
                                    }));
                                    return;
                                }
                            }
                        }

                        if (this.locks > 0) {
                            var p = new WinJS.Promise(function (c) { });
                            args.detail.setPromise(p);
                            p.cancel();
                            return;
                        }
                        else if (page && page.winControl && !openStacked && page.winControl.canClose) {
                            var completeCallback = null;
                            var p = new WinJS.Promise(function (c) {
                                completeCallback = c;
                            });
                            setImmediate(function () {
                                WinJS.Promise.wrap(page.winControl.canClose()).then(function (res) {
                                    if (!res) {
                                        p.cancel();
                                    }
                                    else {
                                        navigator.triggerPageExit(openStacked);
                                        completeCallback();
                                    }
                                });
                            });
                            args.detail.setPromise(p);

                            return;
                        }

                        if (openStacked && !args.detail.state.mcnNavigationDetails && page && page.winControl) {
                            if (page.winControl.navdeactivate) {
                                args.detail.setPromise(WinJS.Promise.as(page.winControl.navdeactivate.apply(page.winControl)));
                                return;
                            }
                            return;
                        }

                        if (navigator.global && !openStacked && WinJS.Navigation.history.current.state && WinJS.Navigation.history.current.state.navigateStacked) {
                            navigator.closeAllPages();
                            var backstack = WinJS.Navigation.history.backStack;
                            for (var i = backstack.length - 1 ; i >= 0 ; i--) {
                                if (backstack[i].state && backstack[i].state.navigateStacked) {
                                    backstack.splice(i, 1);
                                }
                            }
                        }

                        navigator.triggerPageExit();
                    },

                    triggerPageExit: function (openStacked) {
                        var navigator = this;
                        var page = this.pageElement;
                        if (openStacked) {
                            if (page.winControl.navdeactivate) {
                                page.winControl.exitPagePromise = WinJS.Promise.as(page.winControl.navdeactivate());
                            } else {
                                page.winControl.exitPagePromise = WinJS.Promise.wrap();
                            }
                            return;
                        }

                        var hidepage = function () {
                            if (!openStacked) {
                                //page.style.display = 'none';
                                //page.style.visibility = 'hidden';
                                //page.style.opacity = '';
                            }
                        }

                        if (page && page.winControl && !page.winControl.exitPagePromise) {
                            if (page.winControl.exitPage) {
                                var exitPageResult = page.winControl.exitPage();
                                if (exitPageResult) {
                                    var res = WinJS.Promise.as(exitPageResult);
                                    page.winControl.exitPagePromise = res.then(function () {
                                        if (page.winControl.exitPageAnimation) {
                                            return WinJS.Promise.as(page.winControl.exitPageAnimation());
                                        }
                                    }).then(hidepage);
                                } else {
                                    if (page.winControl.exitPageAnimation) {
                                        page.winControl.exitPagePromise = WinJS.Promise.as(page.winControl.exitPageAnimation()).then(hidepage);
                                    } else {
                                        page.winControl.exitPagePromise = WinJS.Promise.as(navigator.animations.exitPage(navigator._getAnimationElements(true))).then(hidepage);
                                    }
                                }
                            } else {
                                if (page.winControl.exitPageAnimation) {
                                    page.winControl.exitPagePromise = WinJS.Promise.as(page.winControl.exitPageAnimation()).then(hidepage);
                                } else {
                                    page.winControl.exitPagePromise = WinJS.Promise.as(navigator.animations.exitPage(navigator._getAnimationElements(true))).then(hidepage);
                                }
                            }

                            var layoutCtrls = page.querySelectorAll('.mcn-layout-ctrl');
                            if (layoutCtrls && layoutCtrls.length) {
                                for (var i = 0 ; i < layoutCtrls.length; i++) {
                                    var ctrl = layoutCtrls[i].winControl;
                                    if (ctrl.exitPage)
                                        ctrl.exitPage();
                                }
                            }

                            if (WinJSContrib.UI.Application.progress)
                                WinJSContrib.UI.Application.progress.show();
                        }
                    },

                    closePage: function (pageElementToClose, args) {
                        var navigator = this;
                        args = args || {};
                        var pagecontainer = navigator.element;
                        var oldElement = pageElementToClose || this.pageElement;
                        if (oldElement) {
                            WinJSContrib.UI.untapAll(oldElement);
                        }
                        var oldPageExitPromise = (oldElement && oldElement.winControl && oldElement.winControl.exitPagePromise) ? oldElement.winControl.exitPagePromise : WinJS.Promise.wrap()
                        navigator.dispatchEvent('closingPage', { page: oldElement });

                        if (oldElement && oldElement.winControl) {
                            oldElement.winControl.mcnPageClosing = true;
                            oldElement.winControl.pageLifeCycle.stop();
                            oldElement.winControl.dispatchEvent('closing', { youpla: 'boom' });

                            if (oldElement.winControl.cancelPromises) {
                                oldElement.winControl.cancelPromises();
                            }
                        }

                        if (!navigator.global && !navigator.disableHistory && oldElement && oldElement.winControl && oldElement.winControl.navigationState && !args.skipHistory) {
                            navigator._history.backstack.push(oldElement.winControl.navigationState);
                        }
                        
                        setImmediate(function () {
                            var p = navigator._lastNavigationPromise ? navigator._lastNavigationPromise.then(function () { }, function () { }) : WinJS.Promise.wrap();
                            
                            p.then(function () {
                                return oldPageExitPromise;
                            }).then(function () {
                                return WinJS.Promise.timeout(200);
                            }).then(function () {
                                WinJS.Utilities.Scheduler.schedule(function () {
                                    navigator.destroyOldPage(oldElement);
                                });
                            });
                        }, 1000);

                        return WinJS.Promise.wrap();
                    },

                    destroyOldPage: function (oldElement) {
                        if (oldElement) {
                            oldElement.style.opacity = '0';
                            oldElement.style.display = 'none';
                            //    }
                            //    return WinJS.Promise.timeout();
                            //}).then(function () {
                            //    if (oldElement) {
                            if (oldElement.winControl) {
                                oldElement.winControl.stackedOn = null;
                                oldElement.winControl.stackedBy = null;
                                if (oldElement.winControl.eventTracker) {
                                    oldElement.winControl.eventTracker.dispose();
                                }

                                if (oldElement.winControl.unload) {
                                    oldElement.winControl.unload();
                                }
                            }

                            if (WinJS.Utilities.disposeSubTree)
                                WinJS.Utilities.disposeSubTree(oldElement);

                            //oldElement.innerHTML = '';
                            //setImmediate(function () {
                            try {
                                if (oldElement.parentElement) oldElement.parentElement.removeChild(oldElement);
                            }
                            catch (exception) {
                                console.log('cannot remove page, WTF ????????')
                            }
                            //});
                        }
                    },

                    // Responds to navigation by adding new pages to the DOM.
                    _navigated: function (args) {
                        var navigator = this;

                        args.detail.state = args.detail.state || {};
                        var pagecontainer = navigator.element;
                        var oldPage = this.pageControl;
                        var oldElement = this.pageElement;
                        var openStacked = navigator.stackNavigation == true || args.detail.navigateStacked || (args.detail.state && args.detail.state.navigateStacked);

                        if (this._lastNavigationPromise) {
                            this._lastNavigationPromise.cancel();

                            if (WinJSContrib.UI.Application.progress)
                                WinJSContrib.UI.Application.progress.hide();
                        }

                        if (oldPage && oldPage.stackedOn && args.detail.state.mcnNavigationDetails) {//back en nav stacked
                            var closeOldPagePromise = navigator.closePage(oldElement, args);
                            this._lastNavigationPromise = closeOldPagePromise;
                            args.detail.setPromise(closeOldPagePromise);
                            if (WinJSContrib.UI.Application.progress)
                                WinJSContrib.UI.Application.progress.hide();
                            return;
                        }
                        else if (openStacked) {
                            if (!navigator.global && !navigator.disableHistory && oldElement && oldElement.winControl && oldElement.winControl.navigationState && !args.skipHistory) {
                                navigator._history.backstack.push(oldElement.winControl.navigationState);
                            }

                            var closeOldPagePromise = WinJS.Promise.wrap();
                        }
                        else {
                            var closeOldPagePromise = navigator.closePage(oldElement, args);
                        }

                        if (navigator.global && !openStacked) {
                            var backstack = WinJS.Navigation.history.backStack;
                            for (var i = backstack.length - 1 ; i >= 0 ; i--) {
                                if (backstack[i].state && backstack[i].state.navigateStacked) {
                                    backstack.splice(i, 1);
                                }
                            }
                        }

                        args.detail.state.mcnNavigationDetails = {
                            id: WinJSContrib.Utils.guid(),
                            date: new Date()
                        };

                        //var newElement = null; //this._createPageElement();
                        //var newElementCtrl = null;
                        var parentedComplete;
                        var parented = new WinJS.Promise(function (c) { parentedComplete = c; });
                        //newElement.style.opacity = '0';
                        var layoutCtrls = [];


                        //if (navigator.animationWaitForPreviousPageClose) {
                        //    var tempo = closeOldPagePromise.then(function () {
                        //        return WinJS.Promise.timeout(navigator.delay);
                        //    });
                        //} else {
                        //    var tempo = WinJS.Promise.timeout(navigator.delay);
                        //}

                        navigator.currentPageDetails = args.detail;
                        //var timekey = "opening " + args.detail.location;
                        //console.time(timekey);
                        var openNewPagePromise = WinJSContrib.UI.Pages.renderFragment(pagecontainer, args.detail.location, args.detail.state, {
                            //delay: tempo,
                            enterPage: navigator.animations.enterPage,

                            //parented: closeOldPagePromise.then(function () {
                            //  return parented;
                            //}),

                            getFragmentElement: navigator.fragmentInjector,

                            closeOldPagePromise: closeOldPagePromise.then(function () { }, function () { }),

                            oninit: function (element, options) {
                                if (!element) return;
                                var control = element.winControl;
                                control.navigator = navigator;
                                control.element.mcnPage = true;
                                if (openStacked) {
                                    control.stackedOn = oldPage;
                                    if (oldPage) {
                                        oldPage.stackedBy = control;
                                    }
                                }
                                control.renderComplete = control.renderComplete.then(function () {
                                    parentedComplete();
                                });
                            },

                            onrender: function (element, options) {
                                if (args.detail.state && args.detail.state.clearNavigationHistory) {
                                    if (navigator.global) {
                                        WinJS.Navigation.history.backStack = [];

                                        var systemNavigationManager = null;
                                        if (WinJSContrib.UI.enableSystemBackButtonVisibility && window.Windows && window.Windows.UI && window.Windows.UI.Core && window.Windows.UI.Core.SystemNavigationManager) {
                                            systemNavigationManager = window.Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                                            if (systemNavigationManager) {
                                                systemNavigationManager.appViewBackButtonVisibility = window.Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                                            }
                                        }
                                    } else {
                                        navigator._history.backstack = [];
                                    }
                                }
                                navigator._updateBackButton(element);
                            },

                            onready: function (element, options) {
                                navigator.dispatchEvent('pageContentReady', { page: element.winControl });
                                if (WinJSContrib.UI.Application.progress)
                                    WinJSContrib.UI.Application.progress.hide();
                            }
                        }).then(function () {
                            if (navigator._lastNavigationPromise == openNewPagePromise)
                                navigator._lastNavigationPromise = undefined;
                            //console.timeEnd(timekey);
                        });

                        this._lastNavigationPromise = openNewPagePromise;


                        args.detail.setPromise(WinJS.Promise.join([closeOldPagePromise, openNewPagePromise]));
                    },

                    // Responds to resize events and call the updateLayout function
                    // on the currently loaded page.
                    _resized: function (args) {
                        var navigator = this;
                        if (this.pageControl && this.pageControl.element) {
                            var navigator = this;
                            var control = this.pageControl;
                            var element = control.element;

                            //navigator.pageControl.element.opacity = '0';
                            cancelAnimationFrame(navigator.layoutProcess);
                            navigator.layoutProcess = requestAnimationFrame(function () {
                                var vw = appView ? appView.value : null;
                                for (var i = 0, l = navigator.element.children.length; i < l; i++) {
                                    var control = navigator.element.children[i].winControl;
                                    if (control) {
                                        if (control.__checkLayout) {
                                            control.__checkLayout(element, vw, navigator._lastViewstate);
                                        }
                                        else {
                                            if (control.updateLayout) {
                                                control.updateLayout.call(control, element, vw, navigator._lastViewstate);
                                            }
                                            var layoutCtrls = element.querySelectorAll('.mcn-layout-ctrl');
                                            if (layoutCtrls && layoutCtrls.length) {
                                                for (var i = 0 ; i < layoutCtrls.length; i++) {
                                                    var ctrl = layoutCtrls[i].winControl;
                                                    if (ctrl.updateLayout)
                                                        ctrl.updateLayout(ctrl.element, vw, navigator._lastViewstate);
                                                }
                                            }
                                        }
                                    }
                                }
                                //WinJS.UI.Animation.fadeIn(navigator.pageControl.element);
                            });
                        }
                        this._lastViewstate = appView ? appView.value : null;
                    },

                    _handleBack: function () {
                        nav.back();
                    },

                    // Updates the back button state. Called after navigation has
                    // completed.
                    _updateBackButton: function (element) {
                        var ctrl = this;
                        var canGoBack = ctrl.canGoBack;

                        var systemNavigationManager = null;

                        if ((WinJSContrib.UI.enableSystemBackButtonVisibility) && window.Windows && window.Windows.UI && window.Windows.UI.Core && window.Windows.UI.Core.SystemNavigationManager) {
                            systemNavigationManager = window.Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                        }
                        if (ctrl.global && systemNavigationManager && WinJSContrib.UI.enableSystemBackButtonVisibility) {
                            if (!canGoBack)
                                systemNavigationManager.appViewBackButtonVisibility = window.Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                            else
                                systemNavigationManager.appViewBackButtonVisibility = window.Windows.UI.Core.AppViewBackButtonVisibility.visible;
                        }

                        var backButtons = element.querySelectorAll(".win-backbutton, .back-button, .win-navigation-backbutton");
                        //var backButton = this.pageElement.querySelector("header[role=banner] .win-backbutton");

                        if (backButtons && backButtons.length > 0) {
                            var clearNav = false;
                            //console.log('nav:' + JSON.stringify(args.detail.state))
                            //if (args && args.detail && args.detail.state && args.detail.state.clearNavigationHistory)
                            //    clearNav = args.detail.state.clearNavigationHistory;

                            for (var i = 0, l = backButtons.length; i < l ; i++) {
                                var btn = backButtons[i];
                                if (btn) {
                                    if (canGoBack && !clearNav) {
                                        btn.classList.remove('disabled');
                                        btn.disabled = false;
                                    } else {
                                        btn.classList.add('disabled');
                                        btn.disabled = true;
                                    }

                                    btn.onclick = function (arg) {
                                        if (arg.currentTarget.classList.contains("win-navigation-backbutton")) {
                                            //it is winjs backbutton control, skip action...
                                            return;
                                        }
                                        if (ctrl.global) {
                                            nav.back();
                                        }
                                        else {
                                            var navigator = WinJSContrib.UI.parentNavigator(arg.currentTarget);
                                            navigator.back();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ), WinJS.Utilities.eventMixin)
    });

    if (WinJSContrib.UI.WebComponents) {
        WinJSContrib.UI.WebComponents.register('mcn-navigator', WinJSContrib.UI.PageControlNavigator, {
            properties: ['global'],
            map: {
                "ENTERPAGEANIMATION": {
                    attribute: "enterPageAnimation",
                    property: "animations.enterPage",
                    resolve: true
                },
                "EXITPAGEANIMATION": {
                    attribute: "exitPageAnimation",
                    property: "animations.exitPage",
                    resolve: true
                }
            }
        });
    }
})();

/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/**
 * @namespace WinJSContrib.UI.Animation
 */
/**
 */
var WinJSContrib;
(function (WinJSContrib) {
    var UI;
    (function (UI) {
        var Animation;
        (function (Animation) {
            /**
             * @enum
             * @memberof WinJSContrib.UI.Animation
             */
            Animation.Easings = {
                /**
                 * Quad ease in
                 */
                easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
                /**
                 * Cubic ease in
                 */
                easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
                /**
                 * Quart ease in
                 */
                easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
                /**
                 * Quint ease in
                 */
                easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                /**
                 * Sine ease in
                 */
                easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
                /**
                 * Expo ease in
                 */
                easeInExpo: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
                /**
                 * Circ ease in
                 */
                easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
                /**
                 * Back ease in
                 */
                easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
                /**
                 * Quad ease out
                 */
                easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                /**
                 * Cubic ease out
                 */
                easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                /**
                 * Quart ease out
                 */
                easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
                /**
                 * Quint ease out
                 */
                easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
                /**
                 * Sine ease out
                 */
                easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
                /**
                 * Expo ease out
                 */
                easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                /**
                 * Circ ease out
                 */
                easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
                /**
                 * Back ease out
                 */
                easeOutBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
                /**
                 * Quad ease in-out
                 */
                easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
                /**
                 * Cubic ease in-out
                 */
                easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                /**
                 * Quart ease in-out
                 */
                easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
                /**
                 * Quint ease in-out
                 */
                easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
                /**
                 * Sine ease in-out
                 */
                easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
                /**
                 * Expo ease in-out
                 */
                easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
                /**
                 * Circ ease in-out
                 */
                easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
                /**
                 * Back ease in-out
                 */
                easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
            };
            var equivalents = WinJS.Utilities._browserStyleEquivalents || { transform: { cssName: 'transform' } };
            function getOpt(options) {
                if (options && typeof options == 'number')
                    return { duration: options };
                else
                    return options || {};
            }
            /**
             * configurable fade out
             * @function WinJSContrib.UI.Animation.fadeOut
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function fadeOut(elements, options) {
                options = getOpt(options);
                var args = {
                    property: "opacity",
                    delay: staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333),
                    duration: options.duration || 167,
                    timing: options.easing || "ease-in-out",
                    to: 0
                };
                return WinJS.UI.executeTransition(elements, args);
            }
            Animation.fadeOut = fadeOut;
            /**
             * configurable fade in
             * @function WinJSContrib.UI.Animation.fadeIn
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function fadeIn(elements, options) {
                options = getOpt(options);
                return WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333),
                    duration: options.duration || 167,
                    timing: options.easing || "ease-in-out",
                    to: 1
                });
            }
            Animation.fadeIn = fadeIn;
            function staggerDelay(initialDelay, extraDelay, delayFactor, delayCap) {
                return function (i) {
                    var ret = initialDelay;
                    for (var j = 0; j < i; j++) {
                        extraDelay *= delayFactor;
                        ret += extraDelay;
                    }
                    if (delayCap) {
                        ret = Math.min(ret, delayCap);
                    }
                    return ret;
                };
            }
            /**
             * configurable page exit effect
             * @function WinJSContrib.UI.Animation.pageExit
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function pageExit(elements, options) {
                options = getOpt(options);
                var args = {
                    property: "opacity",
                    delay: staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333),
                    duration: options.duration || 160,
                    timing: options.easing || "ease-in",
                    to: 0
                };
                return WinJS.UI.executeTransition(elements, args);
            }
            Animation.pageExit = pageExit;
            /**
             * configurable page enter effect
             * @function WinJSContrib.UI.Animation.enterPage
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function enterPage(elements, options) {
                options = getOpt(options);
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 120, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var animationParams = {
                    keyframe: 'WinJSContrib-EnterPage',
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: options.duration || 600,
                    timing: options.easing || "cubic-bezier(0.1, 0.9, 0.2, 1)"
                };
                var promise1 = WinJS.UI.executeAnimation(elements, animationParams);
                var args = {
                    property: "opacity",
                    delay: stagger,
                    duration: options.duration || 600,
                    timing: options.easing || "ease-out",
                    to: 1
                };
                var promise2 = WinJS.UI.executeTransition(elements, args);
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.enterPage = enterPage;
            function slideAnim(element, keyframeName, isIn, options) {
                var offsetArray;
                options = getOpt(options);
                var duration = options.duration || isIn ? 250 : 150;
                var delay = options.delay || 5;
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var easing = WinJSContrib.UI.Animation.Easings.easeInQuad;
                if (isIn)
                    easing = WinJSContrib.UI.Animation.Easings.easeOutQuad;
                var animationParams = {
                    keyframe: keyframeName,
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: duration,
                    timing: options.easing || easing
                };
                var promise1 = WinJS.UI.executeAnimation(element, animationParams);
                var transitionParams = {
                    property: "opacity",
                    delay: stagger,
                    duration: duration / 2,
                    timing: easing,
                    from: 0,
                    to: 1
                };
                if (!isIn) {
                    transitionParams.from = 1;
                    transitionParams.to = 0;
                    if (transitionParams.delay < duration / 2)
                        transitionParams.delay = duration / 2;
                }
                var promise2 = WinJS.UI.executeTransition(element, transitionParams);
                return WinJS.Promise.join([promise1, promise2]);
            }
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideFromBottom
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideFromBottom(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideFromBottom', true, options);
            }
            Animation.slideFromBottom = slideFromBottom;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideFromTop
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideFromTop(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideFromTop', true, options);
            }
            Animation.slideFromTop = slideFromTop;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideFromLeft
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideFromLeft(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideFromLeft', true, options);
            }
            Animation.slideFromLeft = slideFromLeft;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideFromRight
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideFromRight(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideFromRight', true, options);
            }
            Animation.slideFromRight = slideFromRight;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideToBottom
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideToBottom(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideToBottom', false, options);
            }
            Animation.slideToBottom = slideToBottom;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideToTop
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideToTop(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideToTop', false, options);
            }
            Animation.slideToTop = slideToTop;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideToLeft
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideToLeft(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideToLeft', false, options);
            }
            Animation.slideToLeft = slideToLeft;
            /**
             * configurable slide effect
             * @function WinJSContrib.UI.Animation.slideToRight
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function slideToRight(elements, options) {
                return slideAnim(elements, 'WinJSContrib-slideToRight', false, options);
            }
            Animation.slideToRight = slideToRight;
            /**
             * animation for tab exit
             * @function WinJSContrib.UI.Animation.tabExitPage
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function tabExitPage(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var animationParams = {
                    keyframe: "WinJSContrib-tabExitPage",
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: options.duration || 160,
                    timing: "ease-in"
                };
                var promise1 = WinJS.UI.executeAnimation(elements, animationParams);
                var transitionParams = {
                    property: "opacity",
                    delay: stagger,
                    duration: options.duration || 160,
                    timing: "linear",
                    from: 1,
                    to: 0
                };
                var promise2 = WinJS.UI.executeTransition(elements, transitionParams);
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.tabExitPage = tabExitPage;
            /**
             * animation for tab exit
             * @function WinJSContrib.UI.Animation.tabEnterPage
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like duration, delay, easing
             */
            function tabEnterPage(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: "WinJSContrib-tabEnterPage",
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: options.duration || 250,
                    timing: WinJSContrib.UI.Animation.Easings.easeOutQuad
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: options.duration || 250,
                    timing: "ease-out",
                    from: 0,
                    to: 1
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.tabEnterPage = tabEnterPage;
            /**
             * exit and grow animation
             * @function WinJSContrib.UI.Animation.exitGrow
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function exitGrow(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var keyframeName = "WinJSContrib-exitGrow";
                if (options.exagerated) {
                    keyframeName += '-exagerated';
                }
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var dur = options.duration || 250;
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: keyframeName,
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeInQuad
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeInQuint,
                    from: 1,
                    to: 0
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.exitGrow = exitGrow;
            /**
             * exit and shrink animation
             * @function WinJSContrib.UI.Animation.exitShrink
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function exitShrink(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var keyframeName = "WinJSContrib-exitShrink";
                if (options.exagerated) {
                    keyframeName += '-exagerated';
                }
                var dur = options.duration || 250;
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 10, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: keyframeName,
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeInQuad
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: dur,
                    timing: WinJSContrib.UI.Animation.Easings.easeInQuint,
                    from: 1,
                    to: 0
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.exitShrink = exitShrink;
            /**
             * shrink and fall animation
             * @function WinJSContrib.UI.Animation.shrinkAndFall
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function shrinkAndFall(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var dur = options.duration || 250;
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: "WinJSContrib-shrinkAndFall",
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || "ease-in"
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: dur,
                    timing: "ease-in",
                    from: 1,
                    to: 0
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.shrinkAndFall = shrinkAndFall;
            /**
             * enter and shrink animation
             * @function WinJSContrib.UI.Animation.enterShrink
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function enterShrink(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var keyframeName = "WinJSContrib-enterShrink";
                if (options.exagerated) {
                    keyframeName += '-exagerated';
                }
                var dur = options.duration || 350;
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: keyframeName,
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeOutQuad
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeOutQuint,
                    from: 0,
                    to: 1
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.enterShrink = enterShrink;
            /**
             * enter and shrink animation
             * @function WinJSContrib.UI.Animation.enterGrow
             * @param {Object} elements element or array of elements
             * @param {WinJSContrib.UI.AnimationOptions} options options like delay, easing
             */
            function enterGrow(elements, options) {
                var offsetArray;
                options = getOpt(options);
                var keyframeName = "WinJSContrib-enterGrow";
                if (options.exagerated) {
                    keyframeName += '-exagerated';
                }
                var dur = options.duration || 350;
                var stagger = staggerDelay(options.delay !== undefined ? options.delay : 5, options.itemdelay !== undefined ? options.itemdelay : 83, 1, options.maxdelay !== undefined ? options.maxdelay : 333);
                var promise1 = WinJS.UI.executeAnimation(elements, {
                    keyframe: keyframeName,
                    property: equivalents.transform.cssName,
                    delay: stagger,
                    duration: dur,
                    timing: options.easing || WinJSContrib.UI.Animation.Easings.easeOutQuad
                });
                var promise2 = WinJS.UI.executeTransition(elements, {
                    property: "opacity",
                    delay: stagger,
                    duration: dur,
                    timing: WinJSContrib.UI.Animation.Easings.easeOutQuint,
                    from: 0,
                    to: 1
                });
                return WinJS.Promise.join([promise1, promise2]);
            }
            Animation.enterGrow = enterGrow;
        })(Animation = UI.Animation || (UI.Animation = {}));
    })(UI = WinJSContrib.UI || (WinJSContrib.UI = {}));
})(WinJSContrib || (WinJSContrib = {}));

//# sourceMappingURL=../../Sources/Common/winjscontrib.ui.animation.js.map
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

//this control requires snap.svg

(function () {
    'use strict';
    var elasticbuttonkinds = {
        rectangle: {
            morphpath: 'M286,113c0,0-68.8,6-136,6c-78.2,0-137-6-137-6S6,97.198,6,62.5C6,33.999,13,12,13,12s59-7,137-7c85,0,136,7,136,7s8,17.598,8,52C294,96.398,286,113,286,113z',
            svg: '<svg width="100%" height="100%" viewBox="0 0 300 125" preserveAspectRatio="none"><path d="M286.5,113c0,0-104,0-136.5,0c-35.75,0-136.5,0-136.5,0s0-39.417,0-52.5c0-12.167,0-48.5,0-48.5s101.833,0,136.5,0c33.583,0,136.5,0,136.5,0s0,35.917,0,48.5C286.5,73.167,286.5,113,286.5,113z"/></svg>'
        },
        roundedrectangle: {
            morphpath: 'M287,95.25c0,11.046-5.954,19.75-17,19.75c0,0-90-4-120-4s-120,4-120,4c-11.046,0-17.25-9.5-17.25-20.5c0-8.715,0.25-10.75,0.25-34s-0.681-26.257-1-33.75C11.5,15,18.954,10,30,10c0,0,90,3,120,3s120-3,120-3c11.046,0,17.75,6.5,17,20c-0.402,7.239,0,6.75,0,30.5C287,83.5,287,84.75,287,95.25z',
            svg: '<svg width="100%" height="100%" viewBox="0 0 300 125" preserveAspectRatio="none"><path d="M290,95c0,11.046-8.954,20-20,20c0,0-90,0-120,0s-120,0-120,0c-11.046,0-20-9-20-20c0-8.715,0-25.875,0-34.5c0-7.625,0-22.774,0-30.5c0-11.625,8.954-20,20-20c0,0,90,0,120,0s120,0,120,0c11.046,0,20,8.954,20,20c0,7.25,0,22.875,0,30.5C290,69.125,290,84.5,290,95z"/></svg>'
        },
        round: {
            morphpath: 'M251,150c0,93.5-29.203,143-101,143S49,243.5,49,150C49,52.5,78.203,7,150,7S251,51.5,251,150z',
            svg: '<svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="none"><path d="M281,150c0,71.797-59.203,131-131,131S19,221.797,19,150S78.203,19,150,19S281,78.203,281,150z"/></svg>'
        },
    };

    WinJS.Namespace.define("WinJSContrib.UI", {
        ElasticButton: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.element.winControl = this;
            this.behavior = {
                speed: { reset: 800, active: 150 },
                easing: { reset: mina.elastic, active: mina.easein }
            };

            this.element.classList.add('mcn-elasticbutton');
            this.element.classList.add('win-disposable');
            WinJS.UI.setOptions(this, options);
        }, {
            kind: {
                get: function () {
                    return this._kind;
                },
                set: function (val) {
                    this._kind = val;
                    this.render();
                }
            },

            render: function () {
                var ctrl = this;
                this.element.classList.add('mcn-elasticbutton-' + ctrl.kind);
                var contentCreated = false;
                if (!ctrl.contentElement) {
                    ctrl.contentElement = document.createElement('DIV');
                    ctrl.contentElement.className = 'mcn-elasticbutton-content';
                    WinJSContrib.Utils.moveChilds(ctrl.element, ctrl.contentElement);
                    contentCreated = true;
                }

                if (!ctrl.bgElement) {
                    ctrl.bgElement = document.createElement('DIV');
                    ctrl.bgElement.className = 'mcn-elasticbutton-bg';
                    ctrl.element.appendChild(ctrl.bgElement);
                }

                if (contentCreated) {
                    ctrl.element.appendChild(ctrl.contentElement);
                }

                if (!ctrl.contentElement) {
                    ctrl.contentElement = document.createElement('DIV');
                    ctrl.contentElement.className = 'mcn-elasticbutton-content';
                    while (ctrl.element.children.length > 0) {
                        ctrl.contentElement.appendChild(ctrl.element.children[0]);
                    }
                    ctrl.element.appendChild(ctrl.contentElement);
                }

                ctrl.currentKind = elasticbuttonkinds[this.kind];
                if (ctrl.currentKind) {
                    ctrl.bgElement.innerHTML = ctrl.currentKind.svg;
                    ctrl.snap = Snap(ctrl.bgElement.querySelector('svg'));
                    ctrl.pathEl = ctrl.snap.select('path');
                    ctrl.paths = {
                        reset: ctrl.pathEl.attr('d'),
                        active: ctrl.currentKind.morphpath
                    };
                    if (ctrl.eventTracker)
                        ctrl.eventTracker.dispose();
                    ctrl.eventTracker = new WinJSContrib.UI.EventTracker();
                    ctrl.eventTracker.addEvent(ctrl.element, 'pointerdown', function (arg) { ctrl._ptdown(arg); });
                    ctrl.eventTracker.addEvent(ctrl.element, 'pointerup', function (arg) { ctrl._ptup(arg); });
                    ctrl.eventTracker.addEvent(ctrl.element, 'pointerleave', function (arg) { ctrl._ptup(arg); })
                }
            },

            _ptdown: function (arg) {
                this.element.classList.add("pressed");
                this.pathEl.stop().animate({ 'path': this.paths.active }, this.behavior.speed.active, this.behavior.easing.active);
            },

            _ptup: function (arg) {
                this.element.classList.remove("pressed");
                this.pathEl.stop().animate({ 'path': this.paths.reset }, this.behavior.speed.reset, this.behavior.easing.reset);
            },

            dispose: function () {
                if (this.eventTracker) this.eventTracker.dispose();
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
            }
        }),
		WinJS.Utilities.eventMixin,
		WinJS.Utilities.createEventProperties("myevent"))
    });
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/// <reference path="winjscontrib.core.js" />

//this controls requires snap.svg

(function () {
    'use strict';
    WinJS.Namespace.define("WinJSContrib.UI", {
        FOWrapper: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.element.winControl = this;
            this.element.classList.add('mcn-fowrapper');
            this.element.classList.add('mcn-layout-ctrl');
            this.element.classList.add('win-disposable');
            WinJS.UI.setOptions(this, options);
            this.render();
        }, {
            someProperty: {
                get: function () {
                    return this._someProperty;
                },
                set: function (val) {
                    this._someProperty = val;
                }
            },

            render: function () {
                var ctrl = this;
                ctrl.wrapperId = WinJSContrib.Utils.guid();

                if (WinJSContrib.UI.FOWrapper.disabled) {
                    var content = document.createElement("DIV");
                    content.className = "mcn-fowrapper-content";
                    
                    WinJSContrib.Utils.moveChilds(ctrl.element, content);
                    ctrl.content = content;
                    ctrl.element.appendChild(content);
                } else {
                    var body = document.createElement("BODY");
                    body.className = "mcn-fowrapper-content";
                    body.style.width = '100%';
                    body.style.height = '100%';
                    WinJSContrib.Utils.moveChilds(ctrl.element, body);
                    ctrl.element.innerHTML = '<svg id="' + ctrl.wrapperId + '" class="mcn-fowrapper-svg" xmlns="http://www.w3.org/2000/svg" style="width:100%; height: 100%">' +
                        '<defs>' +
                            '<filter id="blur-' + ctrl.wrapperId + '" x="0" y="0"><feGaussianBlur class="gblur" in="SourceGraphic" stdDeviation="0" /></filter>' +
                        '</defs>' +
                        '<foreignObject class="fowrapper" width="100%" height="100%" requiredExtensions="http://www.w3.org/1999/xhtml" filter="url(#blur-' + ctrl.wrapperId + ')">' +
                        '</foreignObject>' +
                    '</svg>';
                    var container = ctrl.element.querySelector(".fowrapper");
                    ctrl.svg = ctrl.element.querySelector("svg");
                    ctrl.container = container;
                    ctrl.content = body;
                    ctrl.blurFilter = ctrl.element.querySelector(".gblur");
                    ctrl.sblurFilter = Snap(ctrl.blurFilter);
                    container.appendChild(body);
                }
            },

            blurTo: function (blur, duration, easing) {
                var ctrl = this;
                if (ctrl.blurFilter) {
                    ctrl.sblurFilter.stop();
                    if (!duration) {
                        ctrl.blurFilter.setAttribute("stdDeviation", blur);
                        return;
                    }

                    ctrl.sblurFilter.animate({ stdDeviation: blur }, duration, easing || mina.easeout);
                    ctrl.dispatchEvent('blur');

                } else {
                    if (blur == 0) {
                        ctrl.content.style.transition = "opacity " + duration + "ms ease-out";
                        ctrl.content.style.opacity = "1";
                        //WinJSContrib.UI.Animation.fadeIn(ctrl.content, { duration: duration });
                    } else {
                        ctrl.content.style.transition = "opacity " + duration + "ms ease-out";
                        ctrl.content.style.opacity = "0.15";
                        //WinJSContrib.UI.Animation.fadeOut(ctrl.content, { duration: duration });
                    }
                }
            },

            updateLayout: function () {
                if (this.container) {
                    this.container.setAttribute("width", "100%");
                    this.container.setAttribute("height", "100%");
                }
            },

            dispose: function () {
                WinJS.Utilities.disposeSubTree(this.element);                
                this.element = null;
            }
        }, {
            disabled : false
        }),
        WinJS.Utilities.eventMixin,
        WinJS.Utilities.createEventProperties("blur"))
    });

    //WinJSContrib.UI.FOWrapper.disabled = true;
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

var WinJSContrib = WinJSContrib || {};
WinJSContrib.UI = WinJSContrib.UI || {};

(function () {
    "use strict";

    WinJSContrib.UI.MultiPassRenderer = WinJS.Class.define(
    /**
     * This control manage multi-pass rendering for improving performances when showing a list of items.
     * The renderer will render "shells" for the items to enable page layout, and render items content on demand, or when items scrolls to view.  
     * @class WinJSContrib.UI.MultiPassRenderer
     */
    function (element, options) {
        options = options || {};
        this.items = [];
        this.element = element;
        this._scrollProcessor = null;
        this._tolerance = 1;
        this._virtualize = false;
        this._scrollContainer = options.scrollContainer || null;
        this._multipass = options.multipass || false;
        this._orientation = options.orientation || '';
        this.itemClassName = options.itemClass || options.className || options.itemClassName;
        this.itemTemplate = WinJSContrib.Utils.getTemplate(options.template || options.itemTemplate);
        this.itemInvoked = options.invoked || options.itemInvoked;
        this.onitemContent = options.onitemContent;
        this._onScrollBinded = this._onScroll.bind(this);

        if (element) {
            element.className = element.className + ' mcn-items-ctrl mcn-layout-ctrl win-disposable';
        }

        //element.mcnRenderer = this;
        //WinJS.UI.setOptions(this, options);
    },
    /**
      * @lends WinJSContrib.UI.MultiPassRenderer.prototype
      */
    {
        dispose : function(){
            var ctrl = this;
            WinJSContrib.UI.untapAll(ctrl.element);
            WinJS.Utilities.disposeSubTree(ctrl.element);
            ctrl._unregisterScrollEvents();
            ctrl._scrollContainer = null;
            ctrl.element = null;
            ctrl._scrollProcessor = null;
            ctrl.rect = null;           
            ctrl.items = [];
        },

        clear: function () {
            var ctrl = this;
            WinJS.Utilities.disposeSubTree(ctrl.element);
            ctrl.element.innerHTML = '';
        },

        /**
         * kind of multipass, can be 'section', or 'item'
         * @type {String}
         * @field
         */
        multipass: {
            get: function () {
                return this._multipass;
            },
            set: function (val) {
                this._multipass = val;
                this.refreshScrollEvents();
            }
        },

        /**
         * tolerance for determining if the rendering should apply. Tolerance is expressed in scroll container proportion. For example, 1 means that tolerance is equal to scroll container size
         * @type {number}
         * @field
         */
        tolerance: {
            get: function () {
                return this._tolerance;
            },
            set: function (val) {
                this._tolerance = val;
            }
        },

        /**
         * indicate if renderer empty items out of sight
         * @type {boolean}
         * @field
         */
        virtualize: {
            get: function () {
                return this._virtualize;
            },
            set: function (val) {
                this._virtualize = val;
            }
        },

        /**
         * could be 'vertical' or 'horizontal'
         * @type {String}
         * @field
         */
        orientation: {
            get: function () {
                return this._orientation;
            },
            set: function (val) {
                this._orientation = val;
                this.refreshScrollEvents();
            }
        },

        /**
         * Element containing scroll. If scrollContainer is filled, items content will get rendered when coming into view
         * @type {HTMLElement}
         * @field
         */
        scrollContainer: {
            get: function () {
                return this._scrollContainer;
            },
            set: function (val) {
                this._unregisterScrollEvents();
                this._scrollContainer = val;
                this._registerScrollEvents();
                //this.checkRendering();
            }
        },

        _onScroll: function () {
            var ctrl = this;
            if (ctrl.scrollContainer && ctrl._scrollProcessor) {
                if (ctrl._scrollRequest) {
                    cancelAnimationFrame(ctrl._scrollRequest);
                }

                ctrl._scrollRequest = requestAnimationFrame(function () {
                    ctrl.checkRendering();
                });
            }
        },

        _unregisterScrollEvents: function () {
            this._scrollProcessor = null;
            this.clearOffsets();
            if (this.scrollContainer) {
                this.scrollContainer.removeEventListener('scroll', this._onScrollBinded);
            }
        },

        _registerScrollEvents: function () {
            var ctrl = this;
            if (ctrl.scrollContainer) {
                this.scrollContainer.addEventListener('scroll', this._onScrollBinded);

                if (ctrl.orientation == 'vertical') {
                    if (ctrl.multipass == 'section') {
                        ctrl._scrollProcessor = function () { ctrl._checkSection(ctrl._vIsInView); }
                    } else if (ctrl.multipass == 'item') {
                        ctrl._scrollProcessor = function () { ctrl._checkItem(ctrl._vIsInView); }
                    }
                } else {
                    if (ctrl.multipass == 'section') {
                        ctrl._scrollProcessor = function () { ctrl._checkSection(ctrl._hIsInView); }
                    } else if (ctrl.multipass == 'item') {
                        ctrl._scrollProcessor = function () { ctrl._checkItem(ctrl._hIsInView); }
                    }
                }
            }
        },

        /**
         * refresh scroll events associated to multi pass renderer
         */
        refreshScrollEvents: function () {
            this._unregisterScrollEvents();
            this._registerScrollEvents();
            this.clearOffsets();
        },

        _vIsInView: function (rect, scrollContainer, tolerance) {
            var pxTolerance = scrollContainer.clientHeight * tolerance;
            if (rect.y >= scrollContainer.scrollTop - pxTolerance && rect.y <= scrollContainer.scrollTop + scrollContainer.clientHeight + pxTolerance)
                return true;

            if (rect.y + rect.height >= scrollContainer.scrollTop - pxTolerance && rect.y + rect.height <= scrollContainer.scrollTop + scrollContainer.clientHeight + pxTolerance)
                return true;

            if (rect.y <= scrollContainer.scrollTop - pxTolerance && rect.y + rect.height >= scrollContainer.scrollTop + scrollContainer.clientHeight + pxTolerance)
                return true;

            return false;
        },

        _hIsInView: function (rect, scrollContainer, tolerance) {
            var pxTolerance = scrollContainer.clientWidth * (tolerance || 0);
            if (rect.x >= scrollContainer.scrollLeft - pxTolerance && rect.x <= scrollContainer.scrollLeft + scrollContainer.clientWidth + pxTolerance)
                return true;

            if (rect.x + rect.width >= scrollContainer.scrollLeft - pxTolerance && rect.x + rect.width <= scrollContainer.scrollLeft + scrollContainer.clientWidth + pxTolerance)
                return true;

            if (rect.x <= scrollContainer.scrollLeft - pxTolerance && rect.x + rect.width >= scrollContainer.scrollLeft + scrollContainer.clientWidth + pxTolerance)
                return true;

            return false;
        },

        /**
         * Clear cached offsets for bloc and for items
         */
        clearOffsets: function () {
            var ctrl = this;
            if (!ctrl.element)
                return;
            
            ctrl.rect = null;
            ctrl.items.forEach(function (item) {
                item.rect = null;
            });
        },

        /**
         * update ui related properties like cached offsets, scroll events, ...
         */
        updateLayout: function () {
            var ctrl = this;
            if (!ctrl.element)
                return;
            ctrl.refreshScrollEvents();
        },

        _checkSection: function (check, tolerance, noRender) {
            var ctrl = this;
            if (!ctrl.element)
                return;
            tolerance = tolerance || 0;

            if (!ctrl.rect && ctrl.items && ctrl.items.length) {
                ctrl.rect = WinJSContrib.UI.offsetFrom(ctrl.element, ctrl.scrollContainer);
            } else {
                ctrl.rect = ctrl.rect || { x: 0, y: 0, width: 0, height: 0 };
                ctrl.rect.width = ctrl.element.clientWidth;
                ctrl.rect.height = ctrl.element.clientHeight;
            }

            if (check(ctrl.rect, ctrl.scrollContainer, tolerance)) {
                if (noRender)
                    return true;

                ctrl.renderItemsContent();
                if (ctrl.onrendersection) {
                    ctrl.onrendersection();
                }
            } else if (ctrl.virtualize && tolerance > 0 && ctrl.items && ctrl.items.length && ctrl.items[0].rendered) {
                ctrl.items.forEach(function (item) {
                    item.empty();
                });
            }

            if (tolerance == 0 && ctrl.tolerance > 0) {
                setImmediate(function () {
                    ctrl._checkSection(check, ctrl.tolerance);
                });
            }
        },

        _checkItem: function (check, tolerance) {
            var ctrl = this;
            if (!ctrl.element)
                return;
            tolerance = tolerance || 0;
            var allRendered = true;

            var countR = function () {
                var countRendered = 0;
                ctrl.items.forEach(function (item) {
                    if (item.rendered) {
                        countRendered++;
                    }
                });
                console.log('rendered ' + countRendered);
            }

            if (ctrl._checkSection(check, tolerance, true)) {
                ctrl.items.forEach(function (item) {
                    if (!item.rect) {
                        item.rect = WinJSContrib.UI.offsetFrom(item.element, ctrl.scrollContainer);
                    }
                    allRendered = allRendered & item.rendered;

                    if (!item.rendered && check(item.rect, ctrl.scrollContainer, tolerance)) {
                        item.render();
                    } else if (item.rendered && ctrl.virtualize && tolerance > 0 && !check(item.rect, ctrl.scrollContainer, tolerance)) {
                        item.empty();
                    }
                });
                ctrl.allRendered = allRendered;
                //countR();
            } else if (tolerance > 0 && ctrl.items.length && (ctrl.items[0].rendered || ctrl.items[ctrl.items.length - 1].rendered)) {
                ctrl.items.forEach(function (item) {
                    if (!item.rect) {
                        item.rect = WinJSContrib.UI.offsetFrom(item.element, ctrl.scrollContainer);
                    }
                    if (ctrl.virtualize && !check(item.rect, ctrl.scrollContainer, tolerance)) {
                        item.empty();
                    }
                });
                //countR();
            }

            if (tolerance == 0 && ctrl.tolerance > 0) {
                setImmediate(function () {
                    ctrl._checkItem(check, ctrl.tolerance);
                });
            }


        },

        /**
         * render items shells to the page
         * @param {Array} items array of items to render
         * @param {Object} renderOptions options for rendering items, can override control options like item template
         */
        prepareItems: function (items, renderOptions) {
            var ctrl = this;
            items = items || [];
            renderOptions = renderOptions || {};
            var numItems = items.length;

            var itemInvoked = renderOptions.itemInvoked || ctrl.itemInvoked;
            if (typeof itemInvoked == 'string')
                itemInvoked = WinJSContrib.Utils.resolveMethod(ctrl.element, itemInvoked);
            var template = WinJSContrib.Utils.getTemplate(renderOptions.template) || ctrl.itemTemplate;
            var className = renderOptions.itemClassName || ctrl.itemClassName;
            var onitemInit = renderOptions.onitemInit || ctrl.onitemInit;
            var onitemContent = renderOptions.onitemContent || ctrl.onitemContent;
            var container = ctrl.element;
            var registereditems = ctrl.items;

            items.forEach(function (itemdata) {
                var item = new WinJSContrib.UI.MultiPassItem(ctrl, null, {
                    data: itemdata,
                    template: template,
                    className: className,
                    itemInvoked: itemInvoked,
                    onitemInit: onitemInit,
                    onitemContent: onitemContent
                });
                registereditems.push(item);
                container.appendChild(item.element);
            });
            //for (var i = 0 ; i < numItems; i++) {
            //    var itemdata = items[i];
            //    var item = new WinJSContrib.UI.MultiPassItem(ctrl, null, {
            //        data: itemdata,
            //        template: template,
            //        className: className,
            //        itemInvoked: itemInvoked,
            //        onitemInit: onitemInit,
            //        onitemContent: onitemContent
            //    });
            //    registereditems.push(item);
            //    container.appendChild(item.element);
            //}

            if (renderOptions.renderItems || !this.multipass) {
                ctrl.renderItemsContent();
            }
            //ctrl.element.style.display = '';
        },

        /**
         * check rendering of items, based on multipass configuration (force items on screen to render)
         */
        checkRendering: function () {
            var ctrl = this;
            if (ctrl.element && ctrl._scrollProcessor)
                ctrl._scrollProcessor();
        },

        /**
         * force rendering of all unrendered items
         */
        renderItemsContent: function () {
            var ctrl = this;
            if (!ctrl.element)
                return;

            ctrl.items.forEach(function (item) {
                if (!item.rendered) {
                    //setImmediate(function () {
                    item.render();
                    //});
                }
            });
            ctrl.allRendered = true;
        }
    });

    WinJSContrib.UI.MultiPassItem = WinJS.Class.define(
        /**
         * Item for multipass rendering
         * @class WinJSContrib.UI.MultiPassItem
         */
    function (renderer, element, options) {
        options = options || {};
        var item = this;
        item.renderer = renderer;
        item.element = element || document.createElement('DIV');
        item.element.className = item.element.className + ' ' + options.className + ' mcn-multipass-item unloaded win-disposable';
        item.element.winControl = item;

        item.itemInvoked = options.itemInvoked;
        item.itemDataPromise = WinJS.Promise.as(options.data);

        item.itemTemplate = options.template;
        item.rendered = false;
        item.onitemContent = options.onitemContent;
        if (options.onitemInit) {
            options.onitemInit(this);
        }
    },
    /**
     * @lends WinJSContrib.UI.MultiPassItem
     */
    {
        dispose: function () {
            var item = this;
            item.renderer = null;
            item.element = null;
            item.itemInvoked = null;
            item.itemData = null;
            item.itemDataPromise = null;
            item.itemTemplate = null;
            item.onitemContent = null;
        },

        /**
         * render item content
         */
        render: function (delayed) {
            var ctrl = this;

            if (ctrl.element && ctrl.itemTemplate && !ctrl.rendered) {

                ctrl.rendered = true;
                return ctrl._renderContent();
            }

            return WinJS.Promise.wrap(ctrl.contentElement);
        },

        /**
         * empty item and mark it as unrendered
         */
        empty: function () {
            var ctrl = this;
            if (ctrl.element && ctrl.rendered) {
                WinJSContrib.UI.untapAll(ctrl.element);
                ctrl.element.classList.remove('loaded');
                ctrl.element.innerHTML = '';
                ctrl.rendered = false;
            }
        },

        _renderItemContent: function (rendered) {
            var ctrl = this;
            if (!ctrl.element)
                return;

            ctrl.element.appendChild(rendered);

            if (ctrl.itemInvoked) {
                if (typeof ctrl.itemInvoked == 'string')
                    ctrl.itemInvoked = WinJSContrib.Utils.resolveMethod(ctrl.element, ctrl.itemInvoked);

                if (ctrl.itemInvoked) {
                    WinJSContrib.UI.tap(ctrl.element, function (arg) {
                        ctrl.itemInvoked(ctrl);
                    });
                }
            }

            if (ctrl.onitemContent) {
                ctrl.onitemContent(ctrl.itemData, rendered);
            }
            else if (ctrl.renderer.onitemContent) {
                ctrl.renderer.onitemContent(ctrl.itemData, rendered);
            }

            setImmediate(function () {
                if (ctrl.element) {
                    ctrl.element.classList.remove('unloaded');
                    ctrl.element.classList.add('loaded');
                }
            });

            ctrl.rendered = true;
            ctrl.contentElement = rendered;
            return rendered;
        },

        _renderContent: function () {
            var ctrl = this;

            if (ctrl.element && ctrl.itemTemplate) {
                return ctrl.itemDataPromise.then(function (data) {
                    ctrl.itemData = data;
                    return ctrl.itemTemplate.render(data).then(function (rendered) {
                        ctrl._renderItemContent(rendered);
                    });
                });
            }

            return WinJS.Promise.wrap();
        }
    });
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

(function () {

	"use strict";

	/**
     * Object representing a layout configuration for the grid control
     * @typedef {Object} WinJSContrib.UI.GridControlLayout
     * @property {string} layout layout algorythm to apply (horizontal | vertical | flexhorizontal | flexvertical | hbloc
     * @property {number} cellSpace space between grid cells
     * @property {number} cellWidth width of grid cells
     * @property {number} cellHeight height of grid cells
     * @property {number} itemsPerColumn number of cells per column if using a layout with a fixed number of cells
     * @property {number} itemsPerRow number of cells per row if using a layout with a fixed number of cells
     * @example
     * {
     *     layout: 'horizontal',
     *     itemsPerColumn: (options.itemsPerColumn) ? options.itemsPerColumn : undefined,
     *     itemsPerRow: (options.itemsPerRow) ? options.itemsPerRow : undefined,
     *     cellSpace: 10,
     *     cellWidth: (options.cellWidth) ? options.cellWidth : undefined,
     *     cellHeight: (options.cellHeight) ? options.cellHeight : undefined,
     * }
     */

	WinJS.Namespace.define("WinJSContrib.UI", {
		GridControl: WinJS.Class.define(
            /**
             * @classdesc
             * Control that layout it's children with different algorythms. Used with {@link WinJSContrib.UI.Hub}, The Grid could rely on multipass rendering to optimize large hub pages load.
             * @class WinJSContrib.UI.GridControl
             * @param {HTMLElement} element DOM element containing the control
             * @param {Object} options
             */
            function GridControl(element, options) {
            	var grid = this;
            	options = options || {};
            	grid.element = element;

            	grid.element.className = grid.element.className + ' mcn-grid-ctrl mcn-layout-ctrl win-disposable';
            	grid.element.winControl = grid;


            	/**
                 * multipass renderer for the grid
                 * @field
                 * @type WinJSContrib.UI.MultiPassRenderer
                 */
            	grid.renderer = new WinJSContrib.UI.MultiPassRenderer(grid.element, {
            		multipass: options.multipass,
            		itemClassName: options.itemClassName,
            		itemTemplate: options.itemTemplate,
            		itemInvoked: options.itemInvoked,
            	});


            	grid.layouts = options.layouts;

            	/**
                 * default layout definitions for the grid
                 * @field
                 * @type WinJSContrib.UI.GridControlLayout
                 */
            	grid.defaultLayout = {
            		layout: options.layout || 'none',
            		itemsPerColumn: (options.itemsPerColumn) ? options.itemsPerColumn : undefined,
            		itemsPerRow: (options.itemsPerRow) ? options.itemsPerRow : undefined,
            		cellSpace: (options.cellSpace) ? options.cellSpace : 10,
            		cellWidth: (options.cellWidth) ? options.cellWidth : undefined,
            		cellHeight: (options.cellHeight) ? options.cellHeight : undefined,
            	};

            	/**
                 * indicate if grid accept layout event from the page (if you use WinJS Contrib page events)
                 * @field
                 * @type boolean
                 */
            	grid.autolayout = options.autolayout || true;

            	var parent = WinJSContrib.Utils.getScopeControl(grid.element);
            	if (parent && parent.pageLifeCycle) {
            		parent.pageLifeCycle.steps.layout.attach(function () {
            			if (grid.autolayout) {
            				grid.layout();
            			}
            		});
            	}
            	else if (parent && parent.elementReady) {
            		parent.elementReady.then(function () {
            			parent.readyComplete.then(function () {
            				if (grid.autolayout) {
            					grid.layout();
            				}
            			});
            		});
            	}
            },
            /**
             * @lends WinJSContrib.UI.GridControl.prototype
             */
            {
            	/**
                 * scroll element containing the grid. Required for multi pass rendering
                 * @field
                 * @type HTMLElement
                 */
            	scrollContainer: {
            		get: function () {
            			return this.renderer.scrollContainer;
            		},
            		set: function (val) {
            			this.renderer.scrollContainer = val;
            		}
            	},

            	/**
                 * indicate if grid layout itself according to the page lifecycle (default to true)
                 * @field
                 * @type boolean
                 */
            	autolayout: {
            		get: function () {
            			return this._autolayout;
            		},
            		set: function (val) {
            			this._autolayout = val;
            		}
            	},

            	/**
                 * layout definitions for the grid. It's an object containing several grid layout options. See {@link WinJSContrib.UI.GridControlLayout}
                 * @field
                 * @type Object
                 */
            	layouts: {
            		get: function () {
            			return this.gridLayouts;
            		},
            		set: function (val) {
            			this.gridLayouts = val;
            		}
            	},

            	/**
                 * indicate the kind of multipass treatment
                 * @field
                 * @type string
                 */
            	multipass: {
            		get: function () {
            			return this.renderer.multipass;
            		},
            		set: function (val) {
            			this.renderer.multipass = val;
            		}
            	},

            	/**
                 * callback triggered when clicking on an item
                 * @field
                 * @type HTMLElement
                 */
            	itemInvoked: {
            		get: function () {
            			return this.renderer.itemInvoked;
            		},
            		set: function (val) {
            			this.renderer.itemInvoked = val;
            		}
            	},

            	/**
                 * item template (WinJS Template or template function)
                 * @field
                 * @type Object
                 */
            	itemTemplate: {
            		get: function () {
            			return this.renderer.itemTemplate;
            		},
            		set: function (val) {
            			this.renderer.itemTemplate = val;
            		}
            	},

            	/**
                 * css class added on item's placeholder
                 * @field
                 * @type Object
                 */
            	itemClassName: {
            		get: function () {
            			return this.renderer.itemClassName;
            		},
            		set: function (val) {
            			this.renderer.itemClassName = val;
            		}
            	},

            	/**
                 * items to render
                 * @field
                 * @type Object
                 */
            	items: {
            		get: function () {
            			return;
            		},
            		set: function (val) {
						if (val && val.length)
            				this.prepareItems(val);
            		}
            	},

            	/**
                 * render HTML for items
                 * @param {Array} items array of items to render
                 * @param {Object} renderOptions
                 */
            	prepareItems: function (items, renderOptions) {
                    if (!this.element)
                        return;
                    
            		var parent = WinJSContrib.Utils.getParentControlByClass('mcn-layout-ctrl', this.element);
            		var parentMultipass = undefined;
            		if (!this.renderer.multipass && parent && parent.multipass) {
            			this.renderer.multipass = parent.multipass;
            		}

            		this.renderer.prepareItems(items, renderOptions);
            	},

            	/**
                 * force items content to render
                 */
            	renderItemsContent: function () {
            		if (!this.renderer)
                        return;
                    this.renderer.renderItemsContent();
            	},

            	resetElement: function (elt, isItem) {
            		var style = elt.style;
            		if (isItem && style.position) style.position = '';
            		if (!isItem && style.display) style.display = '';
            		if (style.width) style.width = '';
            		if (style.height) style.height = '';
            		if (style.minWidth) style.minWidth = '';
            		if (style.minHeight) style.minHeight = '';
            		if (style.left) style.left = '';
            		if (style.top) style.top = '';
            	},

            	clearContent: function () {
            		var ctrl = this;
            		ctrl.renderer.clear();
            	},

            	/**
                 * Clear all layout and position styles on items
                 */
            	clearLayout: function () {
            		var ctrl = this;
            		
            		ctrl.resetElement(ctrl.element, false);
            		if (ctrl.element.children.length) {
            			for (var i = 0, l = ctrl.element.children.length; i < l; i++) {
            				ctrl.resetElement(ctrl.element.children[i], true);
            			}
            		}
            	},

            	fill: function (matrix, x, y, w, h) {
            		if (matrix.length < x + w) {
            			for (var i = matrix.length ; i < x + w ; i++) {
            				matrix.push([]);
            			}
            		}

            		for (var i = x ; i < x + w ; i++) {
            			var col = matrix[i];
            			if (col.length < y + h) {
            				for (var j = col.length ; j < y + h ; j++) {
            					col.push(false);
            				}
            			}

            			for (var j = y ; j < y + h ; j++) {
            				col[j] = true;
            			}
            		}
            	},

            	fit: function (matrix, x, y, w, h, maxW, maxH) {
            		//items to big
            		if (maxH && h > maxH && y === 0)
            			return true;
            		if (maxW && w > maxW && x === 0)
            			return true;

            		//overflow grid capacity
            		if (maxW && (x + w) > maxW)
            			return false;
            		if (maxH && (y + h) > maxH)
            			return false;

            		for (var i = x ; i < x + w ; i++) {
            			var col = matrix[i];
            			if (col) {
            				for (var j = y ; j < y + h ; j++) {
            					if (col[j] === true)
            						return false;
            				}
            			}
            		}

            		return true;
            	},

            	firstFit: function (matrix, w, h, maxH, numItems) {
            		var ctrl = this;
            		for (var i = 0 ; i < numItems * maxH * 2 ; i++) {
            			var col = matrix[i];
            			if (col) {
            				for (var j = 0 ; j < maxH ; j++) {
            					if (col[j] !== true && ctrl.fit(matrix, i, j, w, h, undefined, maxH)) {
            						return { x: i, y: j };
            					}
            				}
            			}
            			else {
            				return { x: i, y: 0 };
            			}
            		}

            		return undefined;
            	},

            	visibleChilds: function () {
            		var ctrl = this;
            		var res = [];

            		for (var i = 0, l = ctrl.element.children.length; i < l ; i++) {
            			var item = ctrl.element.children[i];
            			var st = window.getComputedStyle(item);
            			if (st.display != 'none' && st.visibility != 'hidden') {
            				res.push(item);
            			}
            		}

            		return res;
            	},

            	/**
                 * Layouts algorythm implementations
                 */
            	GridLayoutsImpl: {
            		none: function () {
            		},

            		flexhorizontal: function () {
            			var ctrl = this;
            			ctrl.renderer.orientation = 'horizontal';
            			ctrl.element.style.position = 'relative';
            			ctrl.element.style.display = 'flex';
            			ctrl.element.style.flexFlow = 'column wrap';
            			ctrl.element.style.alignContent = 'flex-start';
            			//ctrl.element.style.alignContent = 'flex-start';

            			if (ctrl.element.style.width)
            				ctrl.element.style.width = '';

            			ctrl.element.style.height = '';

            			if (ctrl.element.clientHeight)
            				ctrl.element.style.height = ctrl.element.clientHeight + 'px';
            			else
            				ctrl.element.style.height = '';

            			var _itemsPerColumn = Math.floor(ctrl.element.clientHeight / (ctrl.data.cellHeight + ctrl.data.cellSpace));
            			if (_itemsPerColumn) {
            				var visibleitems = ctrl.visibleChilds();
            				var columns = Math.ceil(visibleitems.length / _itemsPerColumn);
            				ctrl.element.style.minWidth = ((ctrl.data.cellWidth + ctrl.data.cellSpace) * columns) + 'px';
            			}
            		},

            		flexvertical: function () {
            		    var ctrl = this;
                        ctrl.renderer.orientation = 'vertical';
            			ctrl.element.style.position = 'relative';
            			ctrl.element.style.display = 'flex';
            			ctrl.element.style.flexFlow = 'row wrap';
            			ctrl.element.style.alignContent = 'flex-start';

            			ctrl.element.style.width = '';
            			if (ctrl.element.clientWidth)
            				ctrl.element.style.width = ctrl.element.clientWidth + 'px';
            			else
            				ctrl.element.style.width = '';

            			if (ctrl.element.style.height)
            				ctrl.element.style.height = '';
            		},

            		hbloc: function () {
            			var ctrl = this;
            			ctrl.renderer.orientation = 'horizontal';
            			ctrl.element.style.position = 'relative';
            			ctrl.element.style.height = '';
            			var _containerH = ctrl.element.clientHeight;
            			if (!_containerH)
            				return;

            			var cellW = ctrl.data.cellWidth;
            			var space = ctrl.data.cellSpace;
            			var colCount = 1;
            			var colOffset = 0;
            			var topOffset = 0;

            			var childs = ctrl.visibleChilds();
            			childs.forEach(function (elt) {
            				if (elt.style.position != 'absolute')
            					elt.style.position = 'absolute';
            				var eltH = elt.clientHeight;
            				if (topOffset + eltH > _containerH) {
            					colCount++;
            					colOffset = colOffset + space + cellW;
            					topOffset = 0;
            				}

            				if (elt.style.left != colOffset + 'px')
            					elt.style.left = colOffset + 'px';
            				if (elt.style.top != topOffset + 'px')
            					elt.style.top = topOffset + 'px';

            				topOffset += eltH;
            			});

            			colOffset = colOffset + cellW;
            			if (ctrl.element.style.width != colOffset + 'px')
            				ctrl.element.style.width = colOffset + 'px';
            		},

            		horizontal: function () {
            			var ctrl = this;
            			ctrl.renderer.orientation = 'horizontal';
            			ctrl.element.style.position = 'relative';
            			ctrl.element.style.height = '';
            			var _containerH = ctrl.element.clientHeight;
            			if (!_containerH)
            				return;

            			var _itemsPerColumn = Math.floor(_containerH / (ctrl.data.cellHeight + ctrl.data.cellSpace));
            			if (_itemsPerColumn <= 0)
            				_itemsPerColumn = 1;

            			var cellW = ctrl.data.cellWidth;
            			var cellH = ctrl.data.cellHeight;
            			var space = ctrl.data.cellSpace;
            			var aspectRatio = cellW / cellH;
            			var ratioW = 1;
            			var ratioH = 1;

            			if (ctrl.data.itemsPerColumn) {
            				_itemsPerColumn = ctrl.data.itemsPerColumn;
            				cellH = ((_containerH - ((_itemsPerColumn - 1) * space)) / _itemsPerColumn) >> 0;
            				cellW = (ctrl.data.cellWidth * cellH / ctrl.data.cellHeight) >> 0;
            				ratioW = cellW / ctrl.data.cellWidth;
            				ratioH = cellH / ctrl.data.cellHeight;
            			}

            			var gridCellsMatrix = [[]];
            			var childs = ctrl.visibleChilds();
            			childs.forEach(function (elt) {
            				elt.style.position = 'absolute';
            				var eltW = elt.offsetWidth * ratioW;
            				var eltH = elt.offsetHeight * ratioH;
            				var eltColumns = (eltW / cellW) >> 0;
            				var eltRows = (eltH / cellH) >> 0;

            				var pos = ctrl.firstFit(gridCellsMatrix, eltColumns, eltRows, _itemsPerColumn, ctrl.element.children.length);
            				if (!pos)
            					pos = { x: 0, y: 0 };
            				ctrl.fill(gridCellsMatrix, pos.x, pos.y, eltColumns, eltRows);

            				var left = pos.x * (cellW + space);
            				var top = pos.y * (cellH + space);
            				var w = (eltColumns * cellW + ((eltColumns - 1) * space));
            				var h = (eltRows * cellH + ((eltRows - 1) * space));
            				elt.style.left = left + 'px';
            				elt.style.top = top + 'px';
            				elt.style.width = w + 'px';
            				elt.style.height = h + 'px';
            			});

            			var elementWidth = gridCellsMatrix.length * (cellW + space);
            			ctrl.element.style.width = elementWidth + 'px';
            		},

            		vertical: function (plugin) {
            			var ctrl = this;
            			ctrl.renderer.orientation = 'vertical';
            			ctrl.element.style.width = '';
            			ctrl.element.style.position = 'relative';
            			//Be aware that in this case, we invert the matrix to crawl data in lines
            			var _containerW = ctrl.element.clientWidth;
            			if (!_containerW)
            				return;

            			var _itemsPerLine = Math.floor(_containerW / (ctrl.data.cellWidth + ctrl.data.cellSpace));
            			if (_itemsPerLine <= 0)
            				_itemsPerLine = 1;

            			var cellW = ctrl.data.cellWidth;
            			var cellH = ctrl.data.cellHeight;
            			var space = ctrl.data.cellSpace;
            			var aspectRatio = cellW / cellH;
            			var ratioW = 1;
            			var ratioH = 1;

            			if (ctrl.data.itemsPerRow) {
            				_itemsPerLine = ctrl.data.itemsPerRow;
            				cellW = ((_containerW - ((_itemsPerLine - 1) * space)) / _itemsPerLine) >> 0;
            				cellH = (ctrl.data.cellHeight * cellW / ctrl.data.cellWidth) >> 0;
            				ratioW = cellW / ctrl.data.cellWidth;
            				ratioH = cellH / ctrl.data.cellHeight;
            			}

            			var gridCellsMatrix = [[]];
            			var childs = ctrl.visibleChilds();
            			childs.forEach(function (elt) {
            				elt.style.position = 'absolute';

            				var eltW = elt.offsetWidth * ratioW;
            				var eltH = elt.offsetHeight * ratioH;
            				var eltColumns = (eltW / cellW) >> 0;
            				var eltRows = (eltH / cellH) >> 0;

            				var pos = ctrl.firstFit(gridCellsMatrix, eltRows, eltColumns, _itemsPerLine, ctrl.element.children.length);
            				//if (!pos)
            				//    return;

            				ctrl.fill(gridCellsMatrix, pos.x, pos.y, eltRows, eltColumns);

            				var left = pos.y * (cellW + space);
            				var top = pos.x * (cellH + space);
            				elt.style.left = left + 'px';
            				elt.style.top = top + 'px';
            				elt.style.width = (eltColumns * cellW + ((eltColumns - 1) * space)) + 'px';
            				elt.style.height = (eltRows * cellH + ((eltRows - 1) * space)) + 'px';

            			});

            			var elementHeight = gridCellsMatrix.length * (cellH + space);
            			ctrl.element.style.height = elementHeight + 'px';
            		},
            	},

            	/**
                 * layout content items
                 */
            	layout: function () {
            	    var ctrl = this;
            	    if (!ctrl.element)
            	        return;
            		var oldlayout = ctrl.data;
            		ctrl.data = ctrl.getLayout();

            		if (ctrl.data) {
            			//if (ctrl.data == oldlayout && ctrl.data.applyed)
            			//    return;

            			ctrl.data.cellSpace = (ctrl.data.cellSpace != undefined ? ctrl.data.cellSpace : (ctrl.defaultLayout.cellSpace != undefined ? ctrl.defaultLayout.cellSpace : 10));
            			ctrl.data.cellWidth = ctrl.data.cellWidth || ctrl.defaultLayout.cellWidth || 0;
            			ctrl.data.cellHeight = ctrl.data.cellHeight || ctrl.defaultLayout.cellHeight || 0;

            			//if cell dimensions are not defined, take it from last child
            			if (!ctrl.data.cellWidth || !ctrl.data.cellHeight) {
            			    if (ctrl.element && ctrl.element.childNodes && ctrl.element.children.length > 0) {
            					var childs = ctrl.visibleChilds();
            					if (childs && childs.length) {
            						var firstChild = childs[0];
            						var w = firstChild.clientWidth;
            						var h = firstChild.clientHeight;
            						var l = childs.length;
            						if (l > 10) l = 10;
            						for (var i = 0, l = childs.length; i < l ; i++) {
            							var item = childs[i];
            							if (w == 0 || item.clientWidth < w) {
            								w = item.clientWidth;
            							}
            							if (h == 0 || item.clientHeight < h) {
            								h = item.clientHeight;
            							}
            						}
            						ctrl.data.cellWidth = w;
            						ctrl.data.cellHeight = h;
            					}
            				}
            			}

            			var layoutChanged = !oldlayout || ctrl.data.layout !== oldlayout.layout;
            			if (ctrl.data.layout) {
            				var layoutfunc = ctrl.GridLayoutsImpl[ctrl.data.layout.toLowerCase()];
            				if (layoutfunc) {
            					if (layoutChanged)
            						ctrl.changeLayout();

            					layoutfunc.bind(ctrl)(layoutChanged);
            					ctrl.data.applyed = true;
            				}
            			}
            			ctrl.renderer.checkRendering();
            		}
            	},

            	changeLayout: function () {
            		var ctrl = this;
            		ctrl.clearLayout();
            		ctrl.renderer.updateLayout();
            	},

            	/**
                 * update grid layout
                 */
            	updateLayout: function (element, viewState, lastViewState) {
            	    var ctrl = this;
            	    if (!ctrl.element)
            	        return;
            		ctrl.layout();
            	},

            	/**
                 * get layout applicable to the current context
                 */
            	getLayout: function () {
            		var ctrl = this;
            		var matchingLayout = undefined;
            		if (ctrl.gridLayouts) {
            			for (var name in ctrl.gridLayouts) {
            				var layout = ctrl.gridLayouts[name];
            				if (ctrl.gridLayouts.hasOwnProperty(name)) {
            					if (layout.query) {
            						var mq = window.matchMedia(layout.query);
            						if (mq.matches) {
            							matchingLayout = layout;
            						}
            					} else if (!matchingLayout) {
            						matchingLayout = layout;
            					}
            				}
            				else if (!matchingLayout) {
            					matchingLayout = layout;
            				}
            			}
            		}

            		if (!matchingLayout) {
            			matchingLayout = ctrl.defaultLayout;
            		}

            		return JSON.parse(JSON.stringify(matchingLayout));
            	},

            	/**
                 * Release grid resources
                 */
            	dispose: function () {
            		this.element = null;
            		this.renderer.dispose();
            		if (WinJS.Utilities.disposeSubTree)
            			WinJS.Utilities.disposeSubTree(this.element);
            	}
            })
	});

	if (WinJSContrib.UI.WebComponents) {
		WinJSContrib.UI.WebComponents.register('mcn-grid', WinJSContrib.UI.GridControl, {
			properties: ['multipass', 'autolayout', 'layouts', 'itemInvoked', 'itemTemplate', 'itemClassName', 'items']
		});
	}
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

/// <reference path="winjscontrib.core.js" />
(function () {
    'use strict';
    WinJS.Namespace.define("WinJSContrib.UI", {
        AspectRatio: WinJS.Class.mix(WinJS.Class.define(
        /**
             * @classdesc 
             * resize item based on its proportions
             * @class WinJSContrib.UI.AspectRatio
             * @param {HTMLElement} element DOM element owning the control
             * @param {Object} options
             */
        function ctor(element, options) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.element.winControl = this;
            this.element.style.display = 'none';
            this.element.classList.add('mcn-aspectratio');
            this.element.classList.add('win-disposable');
            this.element.classList.add('mcn-layout-ctrl');
            WinJS.UI.setOptions(this, options);
            this.render();
        }, 
        /**
         * @lends WinJSContrib.UI.AspectRatio.prototype
         */
        {
            /**
             * base width
             * @field
             */
            baseWidth: {
                get: function () {
                    return this._baseWidth;
                },
                set: function (val) {
                    this._baseWidth = val;
                }
            },

            /**
             * base width minimum
             * @field
             */
            baseWidthMin: {
                get: function () {
                    return this._baseWidthMin;
                },
                set: function (val) {
                    this._baseWidthMin = val;
                }
            },

            /**
             * base width margin
             * @field
             */
            baseWidthMargin: {
                get: function () {
                    return this._baseWidthMargin || 0;
                },
                set: function (val) {
                    this._baseWidthMargin = val;
                }
            },

            /**
             * base height
             * @field
             */
            baseHeight: {
                get: function () {
                    return this._baseHeight;
                },
                set: function (val) {
                    this._baseHeight = val;
                }
            },

            /**
             * base height minimum
             * @field
             */
            baseHeightMin: {
                get: function () {
                    return this._baseHeightMin;
                },
                set: function (val) {
                    this._baseHeightMin = val;
                }
            },

            /**
             * base height margin
             * @field
             */
            baseHeightMargin: {
                get: function () {
                    return this._baseHeightMargin || 0;
                },
                set: function (val) {
                    this._baseHeightMargin = val;
                }
            },

            /**
             * aspect ratio
             * @field
             */
            ratio: {
                get: function () {
                    return this._ratio;
                },
                set: function (val) {
                    this._ratio = val;
                }
            },

            /**
             * based on
             * @field
             */
            basedOn: {
                get: function () {
                    return this._basedOn;
                },
                set: function (val) {
                    this._basedOn = val;
                }
            },

            /**
             * target
             * @field
             */
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
                    ctrl.element.appendChild(ctrl.styleElt);
                }
                ctrl.updateLayout();
            },

            pageLayout: function () {
                this.updateLayout();
            },

            updateLayout: function () {
                var ctrl = this;

                if (!ctrl.parentpage)
                    ctrl.parentpage = WinJSContrib.Utils.getScopeControl(ctrl.element);

                if (!ctrl.container)
                    ctrl.container = ctrl.element.parentElement;

                if (ctrl.container && ctrl.target) {
                    if (ctrl.basedOn == "height") {
                        ctrl.updateLayoutBasedOnHeight();
                    } else {
                        ctrl.updateLayoutBasedOnWidth();
                    }
                }
            },

            updateLayoutBasedOnWidth: function () {
                var ctrl = this;

                var classname = ctrl.target;
                if (ctrl.prefix) {
                    classname = ctrl.prefix + ' ' + classname;
                }

                var container = ctrl.parentpage.element;
                if (ctrl.baseWidth) {
                    var nbitems = ((ctrl.container.clientWidth / ctrl.baseWidth) << 0) + 1;
                    var itemW = ((ctrl.container.clientWidth / nbitems) << 0) - ctrl.baseWidthMargin - 0.25;
                    if (ctrl.ratio) {
                        var targetH = (itemW / ctrl.ratio) << 0;
                        ctrl.styleElt.innerHTML = classname + "{ width: " + itemW + "px; height:" + targetH + "px}";
                    } else {
                        ctrl.styleElt.innerHTML = classname + "{ width: " + itemW + "px; }";
                    }
                } else if (ctrl.ratio) {
                    var elements = ctrl.container.querySelectorAll(ctrl.target);
                    var eltW = elements[0].clientWidth;
                    var eltH = elements[0].clientHeight;

                    if (eltW > 0) {
                        var targetH = (eltW / ctrl.ratio) << 0;
                        if (ctrl.max) {
                            var maxH = (container.clientHeight * ctrl.max / 100) << 0;
                            if (targetH > maxH) {
                                targetH = maxH;
                            }
                        }
                        ctrl.styleElt.innerHTML = classname + "{ height:" + targetH + "px}";
                    }
                } else {
                    console.warn("aspect ratio control must have baseWidth and/or ratio")
                }
            },

            updateLayoutBasedOnHeight: function () {
                var ctrl = this;

                var classname = ctrl.target;
                if (ctrl.prefix) {
                    classname = ctrl.prefix + ' ' + classname;
                }

                if (ctrl.baseHeight) {
                    var nbitems = ((ctrl.container.clientHeight / ctrl.baseHeight) << 0) + 1;
                    var itemH = ((ctrl.container.clientHeight / nbitems) << 0) - ctrl.baseHeightMargin;
                    var targetW = (itemH / ctrl.ratio) << 0;
                    ctrl.styleElt.innerHTML = classname + "{ width: " + targetW + "px; height:" + itemH + "px}";
                } else {
                    var elements = ctrl.container.querySelectorAll(ctrl.target);
                    var eltW = elements[0].clientWidth;
                    var eltH = elements[0].clientHeight;

                    if (eltH > 0) {
                        var targetW = (eltH * ctrl.ratio) << 0;
                        if (ctrl.max) {
                            var maxW = (ctrl.container.clientWidth * ctrl.max / 100) << 0;
                            if (targetW > maxW) {
                                targetW = maxW;
                            }
                        }
                        ctrl.styleElt.innerHTML = classname + "{ width:" + targetW + "px}";
                    }
                }
            },

            dispose: function () {
                var ctrl = this;
                ctrl.parentpage = null;
                ctrl.container = null;
                ctrl.styleElt.parentElement.removeChild(ctrl.styleElt);
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
            }
        }),
		WinJS.Utilities.eventMixin,
		WinJS.Utilities.createEventProperties("myevent"))
    });
})();
/* 
 * WinJS Contrib v2.1.0.6
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

(function () {
    'use strict';
    WinJS.Namespace.define("WinJSContrib.UI", {
        VisualState: WinJS.Class.mix(WinJS.Class.define(function ctor(element, options) {
            this.element = element || document.createElement('DIV');
            options = options || {};
            this.cssprefix = "state";
            this.isDirty = false;
            this.element.winControl = this;
            this.element.style.display = "none";
            this.element.classList.add('mcn-visualstate');
            this.element.classList.add('mcn-layout-ctrl');
            this.element.classList.add('win-disposable');
            WinJS.UI.setOptions(this, options);
        }, {
            states: {
                get: function () {
                    return this._states;
                },
                set: function (val) {
                    this._states = val;
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

            checkAllStates: function (name, state) {
                var ctrl = this;
                if (ctrl.states) {
                    for (var n in ctrl.states) {
                        ctrl.checkState(n, ctrl.states[n]);
                    }

                    if (ctrl.isDirty) {
                        ctrl.isDirty = false;
                        ctrl.dispatchEvent("statechanged", { sender : this });
                    }
                }
            },

            checkState: function (name, state) {
                var ctrl = this;
                if (!ctrl.element)
                    return;

                var target = ctrl.target || ctrl.element.parentElement;
                var targetW = target.clientWidth;
                var targetH = target.clientHeight;
                var evaluate = true;
                if (state.wGt)
                    evaluate = evaluate && targetW > state.wGt;
                if (state.wGtE)
                    evaluate = evaluate && targetW >= state.wGtE;
                if (state.wLt)
                    evaluate = evaluate && targetW < state.wLt;
                if (state.wLtE)
                    evaluate = evaluate && targetW <= state.wLtE;
                if (state.hGt)
                    evaluate = evaluate && targetH > state.hGt;
                if (state.hGtE)
                    evaluate = evaluate && targetH >= state.hGtE;
                if (state.hLt)
                    evaluate = evaluate && targetH < state.hLt;
                if (state.hLtE)
                    evaluate = evaluate && targetH <= state.hLtE;

                if (evaluate) {
                    if (!state.active) {
                        state.active = true;
                        ctrl.isDirty = true;
                        target.classList.add(ctrl.cssprefix + "-" + name);
                    }
                    
                } else {
                    if (state.active) {
                        state.active = false;
                        ctrl.isDirty = true;
                        target.classList.remove(ctrl.cssprefix + "-" + name);
                    }
                }
            },

            isInState : function(statename){
                var state = this.states[statename];
                if (state && state.active)
                    return true;

                return false;
            },

            pageLayout: function () {
                var ctrl = this;
                ctrl.checkAllStates();
            },

            updateLayout: function () {
                var ctrl = this;
                ctrl.checkAllStates();
            },

            dispose: function () {
                WinJS.Utilities.disposeSubTree(this.element);
                this.element = null;
            }
        }),
		WinJS.Utilities.eventMixin,
		WinJS.Utilities.createEventProperties("statechanged"))
    });
})();
//# sourceMappingURL=winjscontrib-custom.js.map