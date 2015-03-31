(function () {
    angular.module("toastCE")
        .config(["$provide",
            function ($provide) {
                $provide.value("toastConfig", {
                    templatePath: "dist/templates/",
                    types: ["success", "danger", "warning", "info"],
                    icons: ["glyphicon-ok-sign", "glyphicon-remove-sign", "glyphicon-exclamation-sign", "glyphicon-info-sign"],
                    layoutClassPre: "alert-",
                    progressBarClassPre: "progress-bar-",
                    positionClasses: [{top: true, right: true},
                        {top: true, left: true},
                        {bottom: true,left: true},
                        {bottom: true, right: true},
                        {top: true, full: true},
                        {bottom: true, full: true}],
                    positions: ["top-right", "top-left", "bottom-left", "bottom-right", "top-full", "bottom-full"],
                    defaultPosition: 0,
                    defaultTimer: 20,
                    defaultTimerEnabled: true,
                    defaultCloseOnClick: false,
                    defaultShowCloseButton: true,
                    defaultShowTimer: true,
                    defaultShowIcon: true
                });
            }]);
})();