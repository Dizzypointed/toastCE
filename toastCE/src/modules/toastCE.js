(function () {
    angular.module("toastCE", ["ngSanitize"])
    .config(["$provide",
    function ($provide) {
        $provide.value("toastConfig", {
            types: ["success", "danger", "warning", "info"],
            icons: ["glyphicon-ok-sign", "glyphicon-remove-sign", "glyphicon-exclamation-sign", "glyphicon-info-sign"],
            layoutClasses: ["alert-success", "alert-danger", "alert-warning", "alert-info"],
            positionClasses: [{ top: true, right: true }, { top: true, left: true }, { bottom: true, left: true }, { bottom: true, right: true }, { top: true, thin: true }, { bottom: true, thin: true }],
            postitions: [["top-right", "top-left", "bottom-left", "bottom-right", "top-thin", "bottom-thin"]],
            position: [0],
            defaultTimer: 20,
            timerEnabled: true
        });
    }]);
})();