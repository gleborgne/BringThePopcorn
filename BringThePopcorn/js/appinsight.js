/// <reference path="../scripts/microsoft.applicationinsights.js" />

var BtPo = BtPo || {};
(function () {
    'use strict';

    if (!BtPo.trackerInstrumentationKey) {
        console.warn("NO INSTRUMENTATION KEY FOR APPINSIGHT");
        return;
    }

    BtPo.appInsight = new WinJSContrib.WinRT.AppInsight({ instrumentationKey: BtPo.trackerInstrumentationKey });
    BtPo.appInsight.tracker.trackEvent("app start");
    return;
})();