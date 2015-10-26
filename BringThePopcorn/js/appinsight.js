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
    BtPo.appInsight.wrapWinJSNavigation(false);
    BtPo.appInsight.onerror = function (err) {
        WinJS.Navigation.navigate("/pages/errorpage/errorpage.html");
        return true;
    }

    BtPo.appInsight.ontaperror = function (err) {
        //
    }
})();