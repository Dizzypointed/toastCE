(function () {
    angular.module("toastCE").directive("toast", [
        "toastFactory",
        "toastConfig",
        "$templateCache",
        function (toastFactory, toastConfig) {
            var link = function ($scope) {
                if(!angular.isDefined($scope.channel)){
                    $scope.channel = "default";
                }

                $scope.toasts = toastFactory.toasts;
                $scope.config = toastConfig;
                $scope.close = function (id) {
                    toastFactory.close(id);
                };
                $scope.pauseTimer = function (toast) {
                    if(toast.timerEnabled){
                        toast.pauseTimer();
                    }
                };
                $scope.playTimer = function (toast) {
                    if(toast.timerEnabled) {
                        toast.startTimer();
                    }
                };

                $scope.positionClasses = angular.isDefined($scope.position) ? $scope.config.positionClasses[$scope.config.positions.indexOf($scope.position)] : $scope.config.positionClasses[$scope.config.defaultPosition];
            };

            return {
                restrict: "E",
                replace: "true",
                scope: {
                    channel: "=",
                    position: "="
                },
                link: link,
                template:  "<div class='toast-container' data-ng-class='positionClasses'><ul><li class='toast-item' data-ng-repeat='toast in toasts | filter: {channel: channel}'><div class='alert col-sm-12' data-ng-class='toast.class' data-ng-mouseenter='pauseTimer(toast)' data-ng-mouseleave='playTimer(toast)' data-ng-click='toast.closeOnClick ? close(toast.id) : null' data-ng-style='toast.clickable'><div class='toast-content'><span data-ng-if='toast.showCloseButton'><button type='button' class='close' aria-label='Close' data-ng-click='close(toast.id)'><span aria-hidden='true'>&times;</span></button></span><strong ng-if='toast.title'>{{toast.title}}</strong><toast-message message='toast.message' scope='toast.scope'></toast-message></div><div class='bar-timer progress' data-ng-if='toast.timerEnabled && toast.showTimer'><div class='bar-inner progress-bar' data-ng-class='config.progressBarClassPre + toast.typeName' data-ng-style='toast.timerStyle'></div></div></div></li></ul></div>"
            };
        }]);
})();